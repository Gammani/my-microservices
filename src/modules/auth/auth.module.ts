import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { UserModule } from '../user/user.module';
import { SharingModule } from '../../shared/sharing.module';
import { JwtService } from './application/jwt.secret';
import { PasswordAdapter } from '../../shared/adapter/password.adapter';
import { LocalStrategy } from './strategies/local.strategy';
import { GenerateTokensHandler } from './application/commands/generate-tokens.handler';
import { LoginIsExistConstraint } from '../../common/decorators/validate/login.isExist.decorator';
import { EmailIsExistConstraint } from '../../common/decorators/validate/email.isExist.decorator';
import { JwtAccessTokenGuard } from '../../common/gurad/jwt-accessToken.guard';

const useCases = [GenerateTokensHandler];

@Module({
  imports: [SharingModule, UserModule],
  controllers: [AuthController],
  providers: [
    LoginIsExistConstraint,
    EmailIsExistConstraint,
    JwtService,
    PasswordAdapter,
    LocalStrategy,
    JwtAccessTokenGuard,
    ...useCases,
  ],
})
export class AuthModule {}
