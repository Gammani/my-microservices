import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserRepository } from '../../user/repositories/user.repository';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Processor('reset-balance-queue')
export class ResetBalanceJob {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  @Process('reset-balances')
  async handleResetBalances(job: Job) {
    // Транзакция на случай ошибок
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(UserEntity).update({}, { balance: '0.00' });
    });
  }
}
