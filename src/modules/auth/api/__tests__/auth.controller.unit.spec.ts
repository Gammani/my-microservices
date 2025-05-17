import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { AuthController } from '../auth.controller';
import { CreateUserModel } from '../models/input/create.user.model';

// Мокаем типы (эмуляторы)
const mockCommandBus = {
  execute: jest.fn(), // Это подмена реального метода CommandBus.execute
};

describe('AuthController (unit)', () => {
  let authController: AuthController;

  beforeEach(async () => {
    // Создаём тестовый модуль
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: mockCommandBus, // Подменяем CommandBus на мок
        },
      ],
    }).compile();

    // Извлекаем контроллер из модуля
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Сбросить вызовы после каждого теста
  });

  it('should call commandBus.execute with CreateUserCommand on registration', async () => {
    const dto: CreateUserModel = {
      login: 'testUser',
      email: 'test@example.com',
      password: '123456',
      age: 25,
      description: 'test desc',
    };

    await authController.registration(dto);

    expect(mockCommandBus.execute).toHaveBeenCalledTimes(1);
    expect(mockCommandBus.execute).toHaveBeenCalledWith(expect.any(Object)); // Можно уточнить тип
  });

  it('should return accessToken and set cookie on login', async () => {
    const mockTokens = {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };

    // Эмуляция возвращаемого значения от команды
    mockCommandBus.execute.mockResolvedValueOnce(mockTokens);

    // Подделываем Express response
    const res: Partial<Response> = {
      cookie: jest.fn(),
    };

    const req = {
      user: 'user-id',
    } as any;

    const result = await authController.login(req, res as Response);

    // Проверки:
    expect(mockCommandBus.execute).toHaveBeenCalledWith(expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', {
      httpOnly: false,
      secure: false,
    });
    expect(result).toEqual({ accessToken: 'access-token' });
  });
});
