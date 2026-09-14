import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: repo }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('finds a user by email', async () => {
    repo.findOne.mockResolvedValue({ id: 1, email: 'admin@orderly.com' });

    const result = await service.findByEmail('admin@orderly.com');

    expect(result).toMatchObject({ email: 'admin@orderly.com' });
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'admin@orderly.com' } });
  });

  it('returns null when the user does not exist', async () => {
    repo.findOne.mockResolvedValue(null);

    const result = await service.findByEmail('nobody@example.com');

    expect(result).toBeNull();
  });
});