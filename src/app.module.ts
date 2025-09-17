import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';

import { UserModule } from './modules/user/user.module';
import { options } from './config/configuration/options';
import { AuthModule } from './modules/auth/auth.module';
import { configModule } from './config/configuration/configModule';
import { ProfileModule } from './modules/profile/profile.module';
import { CheckAccessToken } from './common/gurad/jwt-accessToken.guard';
import { JwtModule } from './shared/jwt/jwt.module';
import { ContentModule } from './modules/content/content.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ResetBalanceModule } from './modules/reset-balance/reset-balance.module';
import { RedisCacheService } from './config/configuration/redis-cache.provider';

@Module({
  imports: [
    configModule,
    JwtModule,
    TypeOrmModule.forRoot(options),
    CacheModule.registerAsync({
      useClass: RedisCacheService,
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ProfileModule,
    ContentModule,
    WalletModule,
    ResetBalanceModule,
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
