import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { PasswordAdapter } from './adapter/password.adapter';

@Module({
  imports: [CqrsModule, ConfigModule],
  providers: [PasswordAdapter],
  controllers: [],
  exports: [CqrsModule, ConfigModule, PasswordAdapter],
})
export class SharingModule {}
