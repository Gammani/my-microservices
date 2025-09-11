import { Secret } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PasswordAdapter } from '../adapter/password.adapter';
import { signAsync } from '../../common/utils/jwt-sign-async';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly passwordAdapter: PasswordAdapter,
  ) {}

  async createAccessJWT(userId: string): Promise<string> {
    return await signAsync(
      { userId },
      this.configService.get('JWT_ACCESS_SECRET') as Secret,
      {
        expiresIn: '50m',
      },
    );
  }

  async createRefreshJWT(userId: string): Promise<string> {
    return await signAsync(
      { userId },
      this.configService.get('JWT_REFRESH_SECRET') as Secret,
      {
        expiresIn: '24h',
      },
    );
  }

  verifyRefreshToken(refreshToken: string) {
    return this.passwordAdapter.jwtRefreshTokenVerify(refreshToken);
  }

  verifyAccessToken(accessToken: string) {
    return this.passwordAdapter.jwtAccessTokenVerify(accessToken);
  }
}
