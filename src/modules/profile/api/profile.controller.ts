import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RequestWithUserId } from '../../../common/types/index.types';
import { GetUserQuery } from '../application/queries/get-user.query.handler';
import { UpdateProfileDto } from './model/input/update.profile.dto';
import { UpdateProfileCommand } from '../application/commands/update-profile.command';
import { DeleteProfileCommand } from '../application/commands/delete-profile.command';
import { GetMeEndpoint } from '../../../common/decorators/swagger/get-me-endpoint.decorator';
import { SettingsEndpointDecorator } from '../../../common/decorators/swagger/settings-endpoint.decorator';
import { DeleteProfileEndpointDecorator } from '../../../common/decorators/swagger/delete-profile-endpoint.decorator';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GetMeEndpoint()
  @Get('me')
  async me(@Req() req: RequestWithUserId): Promise<any> {
    return await this.queryBus.execute(new GetUserQuery(req.userId));
  }

  @SettingsEndpointDecorator()
  @Patch('settings')
  async updateMyProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req: RequestWithUserId,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateProfileCommand(req.userId, dto));
  }

  @DeleteProfileEndpointDecorator()
  @Delete('delete')
  @HttpCode(204)
  async deleteMyProfile(@Req() req: RequestWithUserId): Promise<void> {
    await this.commandBus.execute(new DeleteProfileCommand(req.userId));
  }
}
