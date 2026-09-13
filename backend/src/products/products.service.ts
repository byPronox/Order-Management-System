import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(workspaceId?: number, search?: string) {
    const qb = this.productsRepository.createQueryBuilder('product');
    if (workspaceId) qb.andWhere('product.workspace_id = :workspaceId', { workspaceId });
    if (search) {
      qb.andWhere('(product.name LIKE :search OR product.sku LIKE :search)', {
        search: `%${search}%`,
      });
    }
    qb.orderBy('product.createdAt', 'DESC');
    return qb.getMany();
  }

  async findOne(id: number, workspaceId?: number) {
    const product = await this.productsRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }
}