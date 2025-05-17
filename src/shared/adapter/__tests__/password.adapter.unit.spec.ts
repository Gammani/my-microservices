import { PasswordAdapter } from '../password.adapter';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('PasswordAdapter', () => {
  let adapter: PasswordAdapter;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
        if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
        return null;
      }),
    } as unknown as ConfigService;

    adapter = new PasswordAdapter(configService);
  });

  describe('jwtRefreshTokenVerify', () => {
    it('should return payload if token is valid', () => {
      const mockPayload = { userId: '123' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload); // Мокаем возвращаемое значение для валидного токена

      const result = adapter.jwtRefreshTokenVerify('valid-token');

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'refresh-secret');
    });

    it('should return null if token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token'); // Симулируем выброс ошибки для невалидного токена
      });

      const result = adapter.jwtRefreshTokenVerify('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('jwtAccessTokenVerify', () => {
    it('should return payload if token is valid', () => {
      const mockPayload = { userId: 'abc' };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = adapter.jwtAccessTokenVerify('valid-access-token');

      expect(result).toEqual(mockPayload);
      expect(jwt.verify).toHaveBeenCalledWith(
        'valid-access-token',
        'access-secret',
      );
    });

    it('should return null if token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = adapter.jwtAccessTokenVerify('invalid-access-token');
      expect(result).toBeNull();
    });
  });
});
