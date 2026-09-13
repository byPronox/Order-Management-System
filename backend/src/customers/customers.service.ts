import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

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

  async create(dto: CreateCustomerDto, workspaceId: number) {
    const existing = await this.customersRepository.findOne({
      where: { email: dto.email, workspaceId },
    });
    if (existing) {
      throw new ConflictException('A customer with this email already exists in this workspace');
    }

    const customer = this.customersRepository.create({ ...dto, workspaceId });
    return this.customersRepository.save(customer);
  }

  async update(id: number, dto: UpdateCustomerDto, workspaceId?: number) {
    const customer = await this.findOne(id, workspaceId);

    if (dto.email && dto.email !== customer.email) {
      const existing = await this.customersRepository.findOne({
        where: { email: dto.email, workspaceId: customer.workspaceId },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A customer with this email already exists in this workspace');
      }
    }

    Object.assign(customer, dto);
    return this.customersRepository.save(customer);
  }

  async remove(id: number, workspaceId?: number) {
    const customer = await this.findOne(id, workspaceId);
    // Soft delete: preserves order history (customer.deletedAt gets set)
    await this.customersRepository.softRemove(customer);
    return { success: true };
  }
}