import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repo: jest.Mocked<Repository<Customer>>;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn(),
      create: jest.fn((dto: Partial<Customer>) => dto as Customer),
      save: jest.fn((entity: Partial<Customer>) => Promise.resolve({ id: 1, ...entity } as Customer)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: getRepositoryToken(Customer), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repo = module.get(getRepositoryToken(Customer));
  });

  it('creates a customer when the email is not taken', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.create(
      { name: 'Jane Doe', email: 'jane@example.com' } as Parameters<CustomersService['create']>[0],
      1,
    );

    expect(result).toMatchObject({ name: 'Jane Doe', email: 'jane@example.com' });
    expect(repo.save).toHaveBeenCalled();
  });

  it('throws a conflict if the email already exists in the workspace', async () => {
    repo.findOne.mockResolvedValue({ id: 5, email: 'jane@example.com' } as Customer);

    await expect(
      service.create(
        { name: 'Jane Doe', email: 'jane@example.com' } as Parameters<CustomersService['create']>[0],
        1,
      ),
    ).rejects.toThrow(ConflictException);
  });
});