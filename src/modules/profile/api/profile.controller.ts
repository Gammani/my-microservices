import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckAccessToken } from '../../../common/gurad/jwt-accessToken.guard';
import { RequestWithUserId } from '../../../common/types/index.d.types';
import { GetUserQuery } from '../application/queries/get-user.query.handler';
import { UpdateProfileDto } from './model/input/update.profile.dto';
import { UpdateProfileCommand } from '../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../application/commands/delete-profile.command';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(CheckAccessToken)
  @Get('me')
  async me(@Req() req: RequestWithUserId): Promise<any> {
    return await this.queryBus.execute(new GetUserQuery(req.userId));
  }

  @UseGuards(CheckAccessToken)
  @Patch('settings')
  async updateMyProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req: RequestWithUserId,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateProfileCommand(req.userId, dto));
  }

  @UseGuards(CheckAccessToken)
  @Delete('delete')
  @HttpCode(204)
  async deleteMyProfile(@Req() req: RequestWithUserId): Promise<void> {
    await this.commandBus.execute(new DeleteProfileCommand(req.userId));
  }
}
