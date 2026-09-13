import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { OrderStatus } from '../../orders/entities/order.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity('workspace_settings')
export class WorkspaceSettings {
  @PrimaryColumn({ name: 'workspace_id', type: 'bigint', unsigned: true })
  workspaceId: number;

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

  @OneToOne(() => Workspace)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;
}