import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Secret } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadType } from '../../common/types/index.types';

@Injectable()
export class PasswordAdapter {
  constructor(private configService: ConfigService) {}
  async createPasswordHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this._generateHash(password, passwordSalt);
  }
  private _generateHash(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
  async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }
  jwtRefreshTokenVerify(refreshToken: string): TokenPayloadType | null {
    try {
      return jwt.verify(
        refreshToken,
        this.configService.get('JWT_REFRESH_SECRET') as Secret,
      ) as TokenPayloadType;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
  jwtAccessTokenVerify(accessToken: string): TokenPayloadType | null {
    try {
      return jwt.verify(
        accessToken,
        this.configService.get('JWT_ACCESS_SECRET') as Secret,
      ) as TokenPayloadType;
    } catch (error: any) {
      console.log(error);
      return null;
    }
  }
}
