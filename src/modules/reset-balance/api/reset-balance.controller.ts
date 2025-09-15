import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ResetBalanceService } from '../application/reset-balance.service';

@Controller('reset-balance')
export class ResetBalanceController {
  constructor(private readonly resetBalanceService: ResetBalanceService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerReset() {
    await this.resetBalanceService.enqueueResetJob();
    return { status: 'reset scheduled' };
  }
}
