import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';

describe('OrdersService — status transitions', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<Repository<Order>>;

  beforeEach(async () => {
    const mockOrdersRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrdersRepository },
        { provide: getRepositoryToken(OrderItem), useValue: {} },
        { provide: getRepositoryToken(Product), useValue: {} },
        { provide: getRepositoryToken(Customer), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(getRepositoryToken(Order));
  });

  it('allows pending -> completed', async () => {
    const order = { id: 1, status: OrderStatus.PENDING } as Order;
    jest.spyOn(service, 'findOne').mockResolvedValue(order);
    ordersRepository.save.mockResolvedValue(order);

    await service.updateStatus(1, OrderStatus.COMPLETED);
    expect(order.status).toBe(OrderStatus.COMPLETED);
  });

  it('allows pending -> cancelled and sets cancelledAt', async () => {
    const order = { id: 1, status: OrderStatus.PENDING } as Order;
    jest.spyOn(service, 'findOne').mockResolvedValue(order);
    ordersRepository.save.mockResolvedValue(order);

    await service.updateStatus(1, OrderStatus.CANCELLED);
    expect(order.status).toBe(OrderStatus.CANCELLED);
    expect(order.cancelledAt).toBeDefined();
  });

  it('rejects completed -> pending (terminal state)', async () => {
    const order = { id: 1, status: OrderStatus.COMPLETED } as Order;
    jest.spyOn(service, 'findOne').mockResolvedValue(order);

    await expect(service.updateStatus(1, OrderStatus.PENDING)).rejects.toThrow(BadRequestException);
  });

  it('rejects cancelled -> completed (terminal state)', async () => {
    const order = { id: 1, status: OrderStatus.CANCELLED } as Order;
    jest.spyOn(service, 'findOne').mockResolvedValue(order);

    await expect(service.updateStatus(1, OrderStatus.COMPLETED)).rejects.toThrow(BadRequestException);
  });
});