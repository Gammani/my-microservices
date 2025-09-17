import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ResetBalanceService } from '../application/reset-balance.service';
import { ResetBalanceEndpointDecorator } from '../../../common/decorators/swagger/reset-balance-endpoint.decorator';

@Controller('reset-balance')
export class ResetBalanceController {
  constructor(private readonly resetBalanceService: ResetBalanceService) {}

  @Post()
  @ResetBalanceEndpointDecorator()
  @HttpCode(HttpStatus.ACCEPTED)
  async triggerReset() {
    await this.resetBalanceService.enqueueResetJob();
    return { status: 'reset scheduled' };
  }
}
