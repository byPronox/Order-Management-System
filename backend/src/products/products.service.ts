import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { paginate } from '../common/utils/paginate.util';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(params: { workspaceId?: number; search?: string; page?: number; limit?: number }) {
    const qb = this.productsRepository.createQueryBuilder('product');
    if (params.workspaceId) qb.andWhere('product.workspace_id = :workspaceId', { workspaceId: params.workspaceId });
    if (params.search) {
      qb.andWhere('(product.name LIKE :search OR product.sku LIKE :search)', {
        search: `%${params.search}%`,
      });
    }
    qb.orderBy('product.createdAt', 'DESC');
    return paginate(qb, params.page, params.limit);
  }

  async findOne(id: number, workspaceId?: number) {
    const product = await this.productsRepository.findOne({
      where: workspaceId ? { id, workspaceId } : { id },
    });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto, workspaceId: number) {
    if (dto.sku) {
      const existing = await this.productsRepository.findOne({
        where: { sku: dto.sku, workspaceId },
      });
      if (existing) {
        throw new ConflictException('A product with this SKU already exists in this workspace');
      }
    }

    const product = this.productsRepository.create({ ...dto, workspaceId });
    return this.productsRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto, workspaceId?: number) {
    const product = await this.findOne(id, workspaceId);

    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productsRepository.findOne({
        where: { sku: dto.sku, workspaceId: product.workspaceId },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('A product with this SKU already exists in this workspace');
      }
    }

    Object.assign(product, dto);
    return this.productsRepository.save(product);
  }

  async remove(id: number, workspaceId?: number) {
    const product = await this.findOne(id, workspaceId);
    await this.productsRepository.softRemove(product);
    return { success: true };
  }
}