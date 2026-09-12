import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}