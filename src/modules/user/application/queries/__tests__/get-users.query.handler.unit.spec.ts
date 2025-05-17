import { GetUsersQueryHandler } from '../get-users.query-handler';
import { GetUsersQuery } from '../get-users.query';
import { UserDto } from '../../dto/user.dto';
import { UserRepository } from '../../../repositories/user.repository';
import { UserEntity } from '../../../entity/user.entity';

describe('GetUsersQueryHandler', () => {
  let handler: GetUsersQueryHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findWithPagination: jest.fn(),
    } as any;

    handler = new GetUsersQueryHandler(userRepository);
  });

  it('должен вернуть массив UserDto на основе результата из репозитория', async () => {
    const mockUser1 = new UserEntity();
    mockUser1.id = '1';
    mockUser1.login = 'alice';
    mockUser1.email = 'alice@example.com';
    mockUser1.age = 30;
    mockUser1.description = 'dev';
    mockUser1.createdAt = new Date();
    mockUser1.passwordHash = 'hash';

    const mockUser2 = new UserEntity();
    mockUser2.id = '2';
    mockUser2.login = 'bob';
    mockUser2.email = 'bob@example.com';
    mockUser2.age = 28;
    mockUser2.description = 'admin';
    mockUser2.createdAt = new Date();
    mockUser2.passwordHash = 'hash';

    userRepository.findWithPagination.mockResolvedValue([
      [mockUser1, mockUser2],
      2,
    ]);

    const query = new GetUsersQuery('a', 'desc', 1, 10);
    const result = await handler.execute(query);

    expect(userRepository.findWithPagination).toHaveBeenCalledWith({
      searchLoginTerm: 'a',
      sortDirection: 'desc',
      pageNumber: 1,
      pageSize: 10,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(UserDto);
    expect(result[1].login).toBe('bob');
  });
});
