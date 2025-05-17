import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../user.controller';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '../../application/queries/get-users.query';
import { UserDto } from '../../application/dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockQueryBus: { execute: jest.Mock };

  beforeEach(async () => {
    mockQueryBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: QueryBus, useValue: mockQueryBus }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call queryBus with default values', async () => {
    const mockResult: UserDto[] = [];
    mockQueryBus.execute.mockResolvedValueOnce(mockResult);

    await controller.getUsers();

    expect(mockQueryBus.execute).toHaveBeenCalledWith(
      new GetUsersQuery(undefined, 'asc', 1, 10),
    );
  });

  it('should call queryBus with provided query params', async () => {
    const mockResult: UserDto[] = [];
    mockQueryBus.execute.mockResolvedValueOnce(mockResult);

    await controller.getUsers('alex', 'desc', '2', '5');

    expect(mockQueryBus.execute).toHaveBeenCalledWith(
      new GetUsersQuery('alex', 'desc', 2, 5),
    );
  });

  it('should return data from queryBus', async () => {
    const mockUsers: UserDto[] = [{ id: '1', login: 'alex' } as UserDto];
    mockQueryBus.execute.mockResolvedValueOnce(mockUsers);

    const result = await controller.getUsers('alex', 'desc', '1', '10');

    expect(result).toBe(mockUsers);
  });

  it('should throw if queryBus throws', async () => {
    mockQueryBus.execute.mockRejectedValueOnce(
      new Error('Something went wrong'),
    );

    await expect(controller.getUsers()).rejects.toThrow('Something went wrong');
  });
});
