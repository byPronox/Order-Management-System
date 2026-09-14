import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole } from '../users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'login'>>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('delegates login to AuthService with the provided credentials', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'fake-token',
      user: { id: 1, name: 'Admin', email: 'admin@orderly.com', role: UserRole.ADMIN },
    });

    const result = await controller.login({ email: 'admin@orderly.com', password: 'secret' });

    expect(authService.login).toHaveBeenCalledWith('admin@orderly.com', 'secret');
    expect(result).toMatchObject({ accessToken: 'fake-token' });
  });
});