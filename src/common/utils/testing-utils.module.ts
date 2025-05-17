import { Module } from '@nestjs/common';
import { TestingUtilsService } from './testing-utils.service';

@Module({
  providers: [TestingUtilsService],
  exports: [TestingUtilsService],
})
export class TestingUtilsModule {}
