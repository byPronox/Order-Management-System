import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  private periodBounds() {
    const now = new Date();
    const currentStart = new Date(now);
    currentStart.setDate(now.getDate() - 30);

    const previousStart = new Date(now);
    previousStart.setDate(now.getDate() - 60);
    const previousEnd = currentStart;

    return { now, currentStart, previousStart, previousEnd };
  }

  private growthPercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  async getSummary(workspaceId?: number) {
    const { now, currentStart, previousStart, previousEnd } = this.periodBounds();

    const orderWhere = workspaceId ? { workspaceId } : {};

    // ---- Customers ----
    const totalCustomers = await this.customersRepository.count();
    const customersCurrentPeriod = await this.customersRepository
      .createQueryBuilder('c')
      .where('c.created_at >= :start', { start: currentStart })
      .getCount();
    const customersPreviousPeriod = await this.customersRepository
      .createQueryBuilder('c')
      .where('c.created_at >= :start AND c.created_at < :end', {
        start: previousStart,
        end: previousEnd,
      })
      .getCount();

    // ---- Products ----
    const totalProducts = await this.productsRepository.count();
    const lowStockCount = await this.productsRepository
      .createQueryBuilder('p')
      .where('p.stock IS NOT NULL AND p.stock < :threshold', { threshold: 10 })
      .getCount();

    // ---- Orders ----
    const totalOrders = await this.ordersRepository.count({ where: orderWhere });
    const ordersCurrentPeriod = await this.ordersRepository
      .createQueryBuilder('o')
      .where('o.created_at >= :start', { start: currentStart })
      .andWhere(workspaceId ? 'o.workspace_id = :workspaceId' : '1=1', { workspaceId })
      .getCount();
    const ordersPreviousPeriod = await this.ordersRepository
      .createQueryBuilder('o')
      .where('o.created_at >= :start AND o.created_at < :end', {
        start: previousStart,
        end: previousEnd,
      })
      .andWhere(workspaceId ? 'o.workspace_id = :workspaceId' : '1=1', { workspaceId })
      .getCount();

    // ---- Revenue ----
    const revenueRow = await this.ordersRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('SUM(o.total_amount)', 'total')
      .where(workspaceId ? 'o.workspace_id = :workspaceId' : '1=1', { workspaceId })
      .groupBy('o.status')
      .getRawMany();

    const revenueByStatus: Record<string, number> = { pending: 0, completed: 0, cancelled: 0 };
    for (const row of revenueRow) {
      revenueByStatus[row.status] = Number(row.total) || 0;
    }
    const totalRevenue = revenueByStatus.completed + revenueByStatus.pending;

    // ---- Orders by status (counts) ----
    const statusCountsRaw = await this.ordersRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(workspaceId ? 'o.workspace_id = :workspaceId' : '1=1', { workspaceId })
      .groupBy('o.status')
      .getRawMany();

    const statusCounts: Record<string, number> = { pending: 0, completed: 0, cancelled: 0 };
    for (const row of statusCountsRaw) {
      statusCounts[row.status] = Number(row.count);
    }
    const totalForPercentages = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
    const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / totalForPercentages) * 1000) / 10,
    }));

    const conversionRate = totalForPercentages > 0
      ? Math.round(((statusCounts.completed + statusCounts.pending) / totalForPercentages) * 1000) / 10
      : 0;

    // ---- Recent orders ----
    const recentOrders = await this.ordersRepository.find({
      where: orderWhere,
      relations: ['customer'],
      order: { createdAt: 'DESC' },
      take: 6,
    });

    return {
      metrics: {
        totalCustomers,
        customersGrowthPercent: this.growthPercent(customersCurrentPeriod, customersPreviousPeriod),
        totalProducts,
        lowStockCount,
        totalOrders,
        ordersGrowthPercent: this.growthPercent(ordersCurrentPeriod, ordersPreviousPeriod),
        totalRevenue,
        revenueCompleted: revenueByStatus.completed,
        revenuePending: revenueByStatus.pending,
      },
      ordersByStatus,
      conversionRate,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        customerName: order.customer?.name ?? 'Unknown',
        customerEmail: order.customer?.email ?? '',
        status: order.status,
        totalAmount: Number(order.totalAmount),
        createdAt: order.createdAt,
      })),
    };
  }
}