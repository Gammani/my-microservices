import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { options } from './config/configuration/options';
import { AuthModule } from './modules/auth/auth.module';
import { configModule } from './config/configuration/configModule';
import { ProfileModule } from './modules/profile/profile.module';
import { APP_GUARD } from '@nestjs/core';
import { CheckAccessToken } from './common/gurad/jwt-accessToken.guard';
import { JwtModule } from './shared/jwt/jwt.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    configModule,
    JwtModule,
    TypeOrmModule.forRoot(options),
    UserModule,
    AuthModule,
    ProfileModule,
    ContentModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAccessToken,
    },
  ],
})
export class AppModule {}
