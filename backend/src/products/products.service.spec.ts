import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, { provide: getRepositoryToken(Product), useValue: repo }],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('creates a product without an SKU', async () => {
    const result = await service.create({ name: 'Widget', price: 10 } as any, 1);
    expect(result).toMatchObject({ name: 'Widget', price: 10 });
  });

  it('throws a conflict if the SKU already exists in the workspace', async () => {
    repo.findOne.mockResolvedValue({ id: 2, sku: 'ABC-1' });

    await expect(
      service.create({ name: 'Widget', price: 10, sku: 'ABC-1' } as any, 1),
    ).rejects.toThrow(ConflictException);
  });
});