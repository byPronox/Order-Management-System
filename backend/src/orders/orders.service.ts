import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  findAll(workspaceId?: number) {
    return this.ordersRepository.find({
      where: workspaceId ? { workspaceId } : {},
      relations: ['customer', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, workspaceId?: number) {
    const order = await this.ordersRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
      relations: ['customer', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }
}