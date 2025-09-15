import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { UserModule } from '../user/user.module';
import { ResetBalanceJob } from './jobs/reset-balance.job';
import { ResetBalanceController } from './api/reset-balance.controller';
import { ResetBalanceService } from './application/reset-balance.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reset-balance-queue',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    UserModule,
  ],
  controllers: [ResetBalanceController],
  providers: [ResetBalanceService, ResetBalanceJob],
})
export class ResetBalanceModule {}
