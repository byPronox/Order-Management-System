import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product, ProductStatus } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(params: {
    workspaceId?: number;
    status?: OrderStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const filteredQb = () => {
      const qb = this.ordersRepository
        .createQueryBuilder('order')
        .leftJoin('order.customer', 'customer');

      if (params.workspaceId) qb.andWhere('order.workspaceId = :workspaceId', { workspaceId: params.workspaceId });
      if (params.status) qb.andWhere('order.status = :status', { status: params.status });
      if (params.search) {
        qb.andWhere('(customer.name LIKE :search OR customer.email LIKE :search OR order.id LIKE :search)', {
          search: `%${params.search}%`,
        });
      }
      return qb;
    };

    if (!params.page && !params.limit) {
      return filteredQb()
        .leftJoinAndSelect('order.customer', 'customerFull')
        .leftJoinAndSelect('order.items', 'items')
        .orderBy('order.createdAt', 'DESC')
        .getMany();
    }

    const currentPage = params.page && params.page > 0 ? params.page : 1;
    const pageSize = params.limit && params.limit > 0 ? Math.min(params.limit, 100) : 20;

    const [ids, total] = await filteredQb()
      .select('order.id')
      .orderBy('order.createdAt', 'DESC')
      .skip((currentPage - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    if (ids.length === 0) {
      return { data: [], meta: { total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) } };
    }

    const orders = await this.ordersRepository.find({
      where: { id: In(ids.map((o) => o.id)) },
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    return {
      data: orders,
      meta: { total, page: currentPage, limit: pageSize, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findOne(id: number, workspaceId?: number) {
    const order = await this.ordersRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async create(dto: CreateOrderDto, workspaceId: number, createdByUserId?: number) {
    const customer = await this.customersRepository.findOne({
      where: { id: dto.customerId, workspaceId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer #${dto.customerId} not found in this workspace`);
    }

    const productIds = dto.items.map((item) => item.productId);
    const products = await this.productsRepository.find({
      where: { id: In(productIds), workspaceId },
    });

    if (products.length !== new Set(productIds).size) {
      throw new BadRequestException('One or more products were not found in this workspace');
    }

    const productMap = new Map(products.map((p) => [Number(p.id), p]));

    for (const itemDto of dto.items) {
      const product = productMap.get(Number(itemDto.productId));
      if (!product) {
        throw new BadRequestException(`Product #${itemDto.productId} not found`);
      }
      if (product.status !== ProductStatus.ACTIVE) {
        throw new BadRequestException(
          `Product "${product.name}" is not available for sale (status: ${product.status})`,
        );
      }
      if (product.stock !== null && product.stock !== undefined && product.stock < itemDto.quantity) {
        throw new BadRequestException(
          `Not enough stock for "${product.name}" — available: ${product.stock}, requested: ${itemDto.quantity}`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const orderItems: OrderItem[] = dto.items.map((itemDto) => {
        const product = productMap.get(Number(itemDto.productId))!;
        const unitPrice = Number(product.price);
        totalAmount += unitPrice * itemDto.quantity;

        const orderItem = new OrderItem();
        orderItem.productId = Number(product.id);
        orderItem.quantity = itemDto.quantity;
        orderItem.unitPrice = unitPrice;
        return orderItem;
      });

      const order = manager.create(Order, {
        workspaceId,
        customerId: dto.customerId,
        createdByUserId,
        status: OrderStatus.PENDING,
        totalAmount,
        items: orderItems,
      });
      const saved = await manager.save(order);

      for (const itemDto of dto.items) {
        const product = productMap.get(Number(itemDto.productId))!;
        if (product.stock !== null && product.stock !== undefined) {
          const newStock = product.stock - itemDto.quantity;
          await manager.update(Product, product.id, {
            stock: newStock,
            status: newStock === 0 ? ProductStatus.OUT_OF_STOCK : product.status,
          });
        }
      }

      return saved.id;
    }).then((orderId) => this.findOne(orderId, workspaceId));
  }

  async updateStatus(id: number, newStatus: OrderStatus, workspaceId?: number) {
    const order = await this.findOne(id, workspaceId);

    const allowed = ALLOWED_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition order from "${order.status}" to "${newStatus}"`,
      );
    }

    if (newStatus === OrderStatus.CANCELLED) {
      await this.dataSource.transaction(async (manager) => {
        for (const item of order.items) {
          const product = await manager.findOne(Product, { where: { id: item.productId } });
          if (product && product.stock !== null && product.stock !== undefined) {
            const restoredStock = product.stock + item.quantity;
            await manager.update(Product, product.id, {
              stock: restoredStock,
              status: product.status === ProductStatus.OUT_OF_STOCK ? ProductStatus.ACTIVE : product.status,
            });
          }
        }
        order.status = newStatus;
        order.cancelledAt = new Date();
        await manager.save(order);
      });
    } else {
      order.status = newStatus;
      await this.ordersRepository.save(order);
    }

    return this.findOne(id, workspaceId);
  }

  async getSummary(workspaceId?: number) {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 30);
    const previousStart = new Date(now);
    previousStart.setDate(now.getDate() - 60);
    const previousEnd = currentStart;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const base = () => {
      const qb = this.ordersRepository.createQueryBuilder('o');
      if (workspaceId) qb.where('o.workspace_id = :workspaceId', { workspaceId });
      return qb;
    };

    const totalOrders = await base().getCount();
    const ordersCurrentPeriod = await base().andWhere('o.created_at >= :start', { start: currentStart }).getCount();
    const ordersPreviousPeriod = await base()
      .andWhere('o.created_at >= :start AND o.created_at < :end', { start: previousStart, end: previousEnd })
      .getCount();
    const pendingFulfillment = await base().andWhere('o.status = :status', { status: OrderStatus.PENDING }).getCount();

    const revenueThisMonthRow = await base()
      .andWhere('o.created_at >= :monthStart', { monthStart })
      .andWhere('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .select('SUM(o.total_amount)', 'total')
      .getRawOne();

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = monthStart;
    const revenueLastMonthRow = await base()
      .andWhere('o.created_at >= :start AND o.created_at < :end', { start: lastMonthStart, end: lastMonthEnd })
      .andWhere('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .select('SUM(o.total_amount)', 'total')
      .getRawOne();

    const revenueThisMonth = Number(revenueThisMonthRow?.total) || 0;
    const revenueLastMonth = Number(revenueLastMonthRow?.total) || 0;

    const growthPercent = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    return {
      totalOrders,
      ordersGrowthPercent: growthPercent(ordersCurrentPeriod, ordersPreviousPeriod),
      pendingFulfillment,
      revenueThisMonth,
      revenueGrowthPercent: growthPercent(revenueThisMonth, revenueLastMonth),
    };
  }
}