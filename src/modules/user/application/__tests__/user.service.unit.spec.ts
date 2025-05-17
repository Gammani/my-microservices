import { UserService } from '../user.service';
import { UserRepository } from '../../repositories/user.repository';
import { PasswordAdapter } from '../../../../shared/adapter/password.adapter';
import { UserEntity } from '../../entity/user.entity';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let passwordAdapter: jest.Mocked<PasswordAdapter>;

  beforeEach(() => {
    // Создаём моки вручную
    userRepository = {
      findUserByLoginOrEmail: jest.fn(),
      loginIsExist: jest.fn(),
      emailIsExist: jest.fn(),
      emailIsValid: jest.fn(),
    } as any;

    passwordAdapter = {
      isPasswordCorrect: jest.fn(),
    } as any;

    userService = new UserService(passwordAdapter, userRepository);
  });

  describe('validateUser', () => {
    it('should return user id if credentials are valid', async () => {
      const mockUser: UserEntity = {
        id: 'user123',
        passwordHash: 'hashedPassword',
      } as UserEntity;

      userRepository.findUserByLoginOrEmail.mockResolvedValue(mockUser);
      passwordAdapter.isPasswordCorrect.mockResolvedValue(true);

      const result = await userService.validateUser(
        'user@example.com',
        'password',
      );

      expect(result).toBe('user123');
      expect(userRepository.findUserByLoginOrEmail).toHaveBeenCalledWith(
        'user@example.com',
      );
      expect(passwordAdapter.isPasswordCorrect).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
    });

    it('should return null if user not found', async () => {
      userRepository.findUserByLoginOrEmail.mockResolvedValue(null);

      const result = await userService.validateUser('notfound', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      userRepository.findUserByLoginOrEmail.mockResolvedValue({
        id: 'user123',
        passwordHash: 'hashedPassword',
      } as UserEntity);

      passwordAdapter.isPasswordCorrect.mockResolvedValue(false);

      const result = await userService.validateUser(
        'user@example.com',
        'wrongpass',
      );
      expect(result).toBeNull();
    });
  });

  describe('loginIsExist', () => {
    it('should return true if login exists', async () => {
      userRepository.loginIsExist.mockResolvedValue(true);
      const result = await userService.loginIsExist('login');
      expect(result).toBe(true);
    });
  });

  describe('emailIsExist', () => {
    it('should return false if email does not exist', async () => {
      userRepository.emailIsExist.mockResolvedValue(false);
      const result = await userService.emailIsExist('mail@mail.com');
      expect(result).toBe(false);
    });
  });
});
