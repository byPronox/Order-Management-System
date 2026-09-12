import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum CustomerType {
  INDIVIDUAL = 'individual',
  SMB = 'smb',
  ENTERPRISE = 'enterprise',
}

export enum CustomerStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'company_name', length: 150, nullable: true })
  companyName: string;

  @Column({ name: 'customer_type', type: 'enum', enum: CustomerType, default: CustomerType.INDIVIDUAL })
  customerType: CustomerType;

  @Column({ length: 191, unique: true })
  email: string;

  @Column({ length: 30, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ type: 'enum', enum: CustomerStatus, default: CustomerStatus.ACTIVE })
  status: CustomerStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}