import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  findAll(workspaceId?: number, search?: string) {
    const qb = this.customersRepository.createQueryBuilder('customer');
    if (workspaceId) qb.andWhere('customer.workspace_id = :workspaceId', { workspaceId });
    if (search) {
      qb.andWhere('(customer.name LIKE :search OR customer.email LIKE :search)', {
        search: `%${search}%`,
      });
    }
    qb.orderBy('customer.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(id: number, workspaceId?: number) {
    const customer = await this.customersRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
    });
    if (!customer) throw new NotFoundException(`Customer #${id} not found`);
    return customer;
  }
}