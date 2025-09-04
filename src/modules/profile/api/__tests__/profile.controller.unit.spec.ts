import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateProfileDto } from '../model/input/update.profile.dto';
import { GetUserQuery } from '../../application/queries/get-user.query.handler';
import { UpdateProfileCommand } from '../../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../../application/commands/delete-profile.command';
import { JwtService } from '../../../../shared/jwt/jwt.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let mockJwtService;

  const mockCommandBus = {
    execute: jest.fn(),
  };

  const mockQueryBus = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    // Создаем мок JwtService
    mockJwtService = {
      verify: jest.fn(),
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: CommandBus, useValue: mockCommandBus },
        { provide: QueryBus, useValue: mockQueryBus },
        { provide: JwtService, useValue: mockJwtService }, // Добавляем мок
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('me', () => {
    it('should return user data from queryBus', async () => {
      const mockUser = { id: '123', login: 'test', email: 'test@mail.com' };
      const req = { userId: '123' } as any;

      mockQueryBus.execute.mockResolvedValueOnce(mockUser);

      const result = await controller.me(req);

      expect(mockQueryBus.execute).toHaveBeenCalledWith(
        new GetUserQuery('123'),
      );
      expect(result).toBe(mockUser);
    });
  });

  describe('updateMyProfile', () => {
    it('should call commandBus.execute with UpdateProfileCommand', async () => {
      const dto: UpdateProfileDto = { age: 30, description: 'New desc' };
      const req = { userId: '456' } as any;

      await controller.updateMyProfile(dto, req);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        new UpdateProfileCommand(req.userId, dto),
      );
    });
  });

  describe('deleteMyProfile', () => {
    it('should call commandBus.execute with DeleteProfileCommand', async () => {
      const req = { userId: '789' } as any;

      await controller.deleteMyProfile(req);

      expect(mockCommandBus.execute).toHaveBeenCalledWith(
        new DeleteProfileCommand(req.userId),
      );
    });
  });
});
