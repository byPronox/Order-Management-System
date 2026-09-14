import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('delegates login to AuthService with the provided credentials', async () => {
    authService.login.mockResolvedValue({ accessToken: 'fake-token', user: { id: 1 } });

    const result = await controller.login({ email: 'admin@orderly.com', password: 'secret' });

    expect(authService.login).toHaveBeenCalledWith('admin@orderly.com', 'secret');
    expect(result).toMatchObject({ accessToken: 'fake-token' });
  });
});