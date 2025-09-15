import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ResetBalanceService {
  constructor(@InjectQueue('reset-balance-queue') private queue: Queue) {}

  async enqueueResetJob() {
    await this.queue.add('reset-balances', {});
  }
}
