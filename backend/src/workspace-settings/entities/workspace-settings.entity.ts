import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from '../../orders/entities/order.entity';

@Entity('workspace_settings')
export class WorkspaceSettings {
  @PrimaryColumn({ type: 'tinyint', unsigned: true, default: 1 })
  id: number;

  @Column({ name: 'workspace_name', length: 150, default: 'Orderly HQ' })
  workspaceName: string;

  @Column({ name: 'default_timezone', length: 60, default: 'America/New_York' })
  defaultTimezone: string;

  @Column({ name: 'default_currency', length: 3, default: 'USD' })
  defaultCurrency: string;

  @Column({ name: 'default_order_status', type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  defaultOrderStatus: OrderStatus;

  @Column({ name: 'require_order_review', default: false })
  requireOrderReview: boolean;

  @Column({ name: 'allow_partial_fulfillment', default: false })
  allowPartialFulfillment: boolean;

  @Column({ name: 'notify_customers_on_status', default: true })
  notifyCustomersOnStatus: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}