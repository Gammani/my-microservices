import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CqrsModule, ConfigModule],
  providers: [],
  controllers: [],
  exports: [CqrsModule, ConfigModule],
})
export class SharingModule {}
