import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { UserModule } from '../user/user.module';
import { SharingModule } from '../../shared/sharing.module';
import { JwtService } from './application/jwt.secret';
import { PasswordAdapter } from '../../shared/adapter/password.adapter';
import { LocalStrategy } from './strategies/local.strategy';
import { GenerateTokensHandler } from './application/commands/generate-tokens.handler';
import { JwtAccessTokenGuard } from '../../common/gurad/jwt-accessToken.guard';
import { ValidationModule } from '../validation/validation.module';
import { ThrottlerModule } from '@nestjs/throttler';

const useCases = [GenerateTokensHandler];

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
    SharingModule,
    UserModule,
    ValidationModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtService,
    PasswordAdapter,
    LocalStrategy,
    JwtAccessTokenGuard,
    ...useCases,
  ],
})
export class AuthModule {}
