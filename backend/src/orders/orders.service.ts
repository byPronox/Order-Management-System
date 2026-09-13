import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async findAll(params: { workspaceId?: number; status?: OrderStatus; search?: string }) {
    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .orderBy('order.createdAt', 'DESC');

    if (params.workspaceId) {
      qb.andWhere('order.workspaceId = :workspaceId', { workspaceId: params.workspaceId });
    }
    if (params.status) {
      qb.andWhere('order.status = :status', { status: params.status });
    }
    if (params.search) {
      qb.andWhere('(customer.name LIKE :search OR customer.email LIKE :search OR order.id LIKE :search)', {
        search: `%${params.search}%`,
      });
    }

    return qb.getMany();
  }

  async findOne(id: number, workspaceId?: number) {
    const order = await this.ordersRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
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

    const ordersCurrentPeriod = await base()
      .andWhere('o.created_at >= :start', { start: currentStart })
      .getCount();
    const ordersPreviousPeriod = await base()
      .andWhere('o.created_at >= :start AND o.created_at < :end', {
        start: previousStart,
        end: previousEnd,
      })
      .getCount();

    const pendingFulfillment = await base()
      .andWhere('o.status = :status', { status: OrderStatus.PENDING })
      .getCount();

    const revenueThisMonthRow = await base()
      .andWhere('o.created_at >= :monthStart', { monthStart })
      .andWhere('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .select('SUM(o.total_amount)', 'total')
      .getRawOne();

    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = monthStart;
    const revenueLastMonthRow = await base()
      .andWhere('o.created_at >= :start AND o.created_at < :end', {
        start: lastMonthStart,
        end: lastMonthEnd,
      })
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