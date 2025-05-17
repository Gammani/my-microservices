import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from '../local.strategy';
import { UserService } from '../../../user/application/user.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      validateUser: jest.fn(),
    } as any;

    strategy = new LocalStrategy(userService);
  });

  it('should return userId if credentials are valid', async () => {
    userService.validateUser.mockResolvedValue('123');

    const result = await strategy.validate('test@mail.com', 'password');
    expect(result).toBe('123');
  });

  it('should throw UnauthorizedException if credentials are invalid', async () => {
    userService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate('wrong', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
