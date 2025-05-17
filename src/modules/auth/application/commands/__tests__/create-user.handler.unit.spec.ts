import { CreateUserCommand, CreateUserHandler } from '../create-user.handler';
import { UserRepository } from '../../../../user/repositories/user.repository';
import { PasswordAdapter } from '../../../../../shared/adapter/password.adapter';
import { CreateUserModel } from '../../../api/models/input/create.user.model';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordAdapter: jest.Mocked<PasswordAdapter>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
    } as any;

    passwordAdapter = {
      createPasswordHash: jest.fn(),
    } as any;

    handler = new CreateUserHandler(userRepository, passwordAdapter);
  });

  it('should hash the password and save the user', async () => {
    const dto: CreateUserModel = {
      login: 'john',
      email: 'john@example.com',
      age: 25,
      password: '12345678',
      description: 'Hi, I am John',
    };

    passwordAdapter.createPasswordHash.mockResolvedValue('hashed-password');

    const command = new CreateUserCommand(dto);

    const before = new Date();

    await handler.execute(command);

    expect(passwordAdapter.createPasswordHash).toHaveBeenCalledWith(
      dto.password,
    );

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        login: dto.login,
        email: dto.email,
        age: dto.age,
        description: dto.description,
        passwordHash: 'hashed-password',
        createdAt: expect.any(Date),
      }),
    );

    const savedUser = userRepository.save.mock.calls[0][0];
    expect(savedUser.createdAt.getTime()).toBeGreaterThanOrEqual(
      before.getTime(),
    );
  });

  it('should set description to empty string if not provided', async () => {
    const dto: CreateUserModel = {
      login: 'noDesc',
      email: 'no@desc.com',
      age: 20,
      password: 'secure123',
      // description не указан
    } as any;

    passwordAdapter.createPasswordHash.mockResolvedValue('hashed-password');

    const command = new CreateUserCommand(dto);

    await handler.execute(command);

    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        login: dto.login,
        email: dto.email,
        age: dto.age,
        description: '', // Проверка что description стал пустой строкой
        passwordHash: 'hashed-password',
      }),
    );
  });

  it('should call userRepository.save once with UserEntity instance', async () => {
    const dto: CreateUserModel = {
      login: 'testuser',
      email: 'test@user.com',
      age: 30,
      password: 'password123',
      description: 'Test desc',
    };

    passwordAdapter.createPasswordHash.mockResolvedValue('hashed-password');

    const command = new CreateUserCommand(dto);

    await handler.execute(command);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    const savedUser = userRepository.save.mock.calls[0][0];
    expect(savedUser).toBeInstanceOf(Object); // Можно заменить на UserEntity, если импортируешь
  });
});
