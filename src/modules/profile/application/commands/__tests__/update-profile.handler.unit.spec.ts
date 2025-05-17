import { UpdateProfileHandler } from '../update-profile.handler';
import { UpdateProfileCommand } from '../update-profile.command';
import { UserRepository } from '../../../../user/repositories/user.repository';
import { UserEntity } from '../../../../user/entity/user.entity';

describe('UpdateProfileHandler', () => {
  let handler: UpdateProfileHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Создаём мок репозитория
    userRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    handler = new UpdateProfileHandler(userRepository);
  });

  it('должен обновить возраст и описание пользователя, если найден', async () => {
    const mockUser = new UserEntity();
    mockUser.id = 'user-123';
    mockUser.age = 20;
    mockUser.description = 'Old description';

    userRepository.findById.mockResolvedValue(mockUser);

    const command = new UpdateProfileCommand('user-123', {
      age: 30,
      description: 'New description',
    });

    await handler.execute(command);

    // Проверяем, что поля изменились
    expect(mockUser.age).toBe(30);
    expect(mockUser.description).toBe('New description');

    // Проверяем, что save вызван с обновлённым пользователем
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('должен обновить только возраст, если описание не передано', async () => {
    const mockUser = new UserEntity();
    mockUser.id = 'user-123';
    mockUser.age = 20;
    mockUser.description = 'Some description';

    userRepository.findById.mockResolvedValue(mockUser);

    const command = new UpdateProfileCommand('user-123', {
      age: 25,
    });

    await handler.execute(command);

    expect(mockUser.age).toBe(25);
    expect(mockUser.description).toBe('Some description'); // Не изменилось
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('должен обновить только описание, если возраст не передан', async () => {
    const mockUser = new UserEntity();
    mockUser.id = 'user-123';
    mockUser.age = 22;
    mockUser.description = 'Old';

    userRepository.findById.mockResolvedValue(mockUser);

    const command = new UpdateProfileCommand('user-123', {
      description: 'Updated description',
    });

    await handler.execute(command);

    expect(mockUser.age).toBe(22); // Не изменился
    expect(mockUser.description).toBe('Updated description');
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
  });

  it('должен выбросить ошибку, если пользователь не найден', async () => {
    userRepository.findById.mockResolvedValue(null);

    const command = new UpdateProfileCommand('user-123', {
      age: 30,
      description: 'desc',
    });

    await expect(handler.execute(command)).rejects.toThrow('User not found');
    expect(userRepository.save).not.toHaveBeenCalled();
  });
});
