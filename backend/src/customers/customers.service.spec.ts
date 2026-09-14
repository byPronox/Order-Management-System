import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 1, ...entity })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, { provide: getRepositoryToken(Customer), useValue: repo }],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  it('creates a customer when the email is not taken', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.create(
      { name: 'Jane Doe', email: 'jane@example.com' } as any,
      1,
    );

    expect(result).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('throws a conflict if the email already exists in the workspace', async () => {
    repo.findOne.mockResolvedValue({ id: 5, email: 'jane@example.com' });

    await expect(
      service.create({ name: 'Jane Doe', email: 'jane@example.com' } as any, 1),
    ).rejects.toThrow(ConflictException);
  });
});