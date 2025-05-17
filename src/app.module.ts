import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { options } from './config/configuration/options';
import { AuthModule } from './modules/auth/auth.module';
import { configModule } from './config/configuration/configModule';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    configModule,
    TypeOrmModule.forRoot(options),
    UserModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
