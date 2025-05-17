import { UserRepository } from '../../../../user/repositories/user.repository';
import { UserEntity } from '../../../../user/entity/user.entity';
import { UserProfileDto } from '../../../api/model/output/profile.response';
import { GetUserQuery, GetUserQueryHandler } from '../get-user.query.handler';

describe('GetUserHandler', () => {
  let handler: GetUserQueryHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as any;

    handler = new GetUserQueryHandler(userRepository);
  });

  it('должен вернуть профиль пользователя, если он найден', async () => {
    const mockUser = new UserEntity();
    mockUser.id = 'user-123';
    mockUser.login = 'testLogin';
    mockUser.email = 'test@example.com';
    mockUser.age = 25;
    mockUser.description = 'Description';
    mockUser.createdAt = new Date();
    mockUser.passwordHash = 'hashed';

    userRepository.findById.mockResolvedValue(mockUser);

    const result = await handler.execute(new GetUserQuery('user-123'));

    expect(result).toBeInstanceOf(UserProfileDto);
    expect(result.login).toBe(mockUser.login);
    expect(result.email).toBe(mockUser.email);
    expect(userRepository.findById).toHaveBeenCalledWith('user-123');
  });

  it('должен выбросить ошибку, если пользователь не найден', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(new GetUserQuery('not-exist-id')),
    ).rejects.toThrow('User not found');
  });
});
