import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { TransferDto } from './models/input/transfer.input.model';
import { AccountId } from '../../validation/decorators/validate/accountId.decorator';
import { TransferMoneyCommand } from '../application/commands/transfer-money.command';

@Controller('wallet')
export class WalletController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('transfer')
  async transfer(@AccountId() accountId: string, @Body() dto: TransferDto) {
    await this.commandBus.execute(new TransferMoneyCommand(accountId, dto));
    return { status: 'ok' };
  }
}
