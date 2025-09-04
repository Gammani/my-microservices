import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../../../shared/jwt/jwt.service';
import { TokenPayloadType } from '../../types/index.types';
import { CheckAccessToken } from '../jwt-accessToken.guard';

describe('CheckAccessToken Guard', () => {
  let guard: CheckAccessToken;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(() => {
    jwtServiceMock = {
      verifyAccessToken: jest.fn(),
    };
    guard = new CheckAccessToken(jwtServiceMock as JwtService);
  });

  const createMockContext = (authHeader: string) => {
    const req: any = { headers: { authorization: authHeader } };

    const mockHttpArgumentsHost = {
      getRequest: () => req,
      getResponse: jest.fn(),
      getNext: jest.fn(),
    };

    const context: ExecutionContext = {
      switchToHttp: () => mockHttpArgumentsHost,
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;

    return { context, req };
  };

  it('✅ should return true and attach userId if token is valid', () => {
    const payload: TokenPayloadType = { userId: '123' };
    (jwtServiceMock.verifyAccessToken as jest.Mock).mockReturnValue(payload);

    const { context, req } = createMockContext('Bearer valid.token');

    const result = guard.canActivate(context);
    expect(result).toBe(true);
    expect(req.userId).toBe('123');
  });

  it('❌ should throw if authorization header is missing', () => {
    const { context } = createMockContext(undefined as unknown as string);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('❌ should throw if token is invalid (null payload)', () => {
    (jwtServiceMock.verifyAccessToken as jest.Mock).mockReturnValue(null);

    const { context } = createMockContext('Bearer invalid.token');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('❌ should throw if token is missing after Bearer', () => {
    const { context } = createMockContext('Bearer ');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
