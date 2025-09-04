import {
  GenerateTokensCommand,
  GenerateTokensHandler,
} from '../generate-tokens.handler';
import { JwtService } from '../../../../../shared/jwt/jwt.service';

describe('GenerateTokensHandler', () => {
  let handler: GenerateTokensHandler;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      createAccessJWT: jest.fn(),
      createRefreshJWT: jest.fn(),
    } as any;

    handler = new GenerateTokensHandler(jwtService);
  });

  it('should return access and refresh tokens', async () => {
    const userId = 'user-123';
    const mockAccessToken = 'access-token';
    const mockRefreshToken = 'refresh-token';

    (jwtService.createAccessJWT as jest.Mock).mockResolvedValue(
      mockAccessToken,
    );
    (jwtService.createRefreshJWT as jest.Mock).mockResolvedValue(
      mockRefreshToken,
    );

    const command = new GenerateTokensCommand(userId);
    const result = await handler.execute(command);

    expect(jwtService.createAccessJWT).toHaveBeenCalledWith(userId);
    expect(jwtService.createRefreshJWT).toHaveBeenCalledWith(userId);

    expect(result).toEqual({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  });
});
