import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { SharingModule } from '../../shared/sharing.module';
import { WalletController } from './api/wallet.controller';
import { TransferMoneyHandler } from './application/commands/transfer-money.command';

@Module({
  imports: [UserModule, SharingModule],
  controllers: [WalletController],
  providers: [TransferMoneyHandler],
})
export class WalletModule {}
