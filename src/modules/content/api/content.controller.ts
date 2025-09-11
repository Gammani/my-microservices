import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateContentPayloadDto } from './models/input/createUpdateDto';
import { IUploadedMulterFile } from '../../../providers/files/s3/interfaces/upload-file.interface';
import { AccountId } from '../../validation/decorators/validate/accountId.decorator';
import { CreateAvatarCommand } from '../application/commands/create-avatar.handler';
import { UploadFileResultDto } from './models/output/upload-file-result.dto';
import { GetAvatarQuery } from '../application/queries/get-avatar.query';
import { DeleteAvatarCommand } from '../application/commands/delete-avatar.handler';

@Controller('avatar')
export class ContentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  async getAvatar(
    @AccountId() accountId: string,
  ): Promise<UploadFileResultDto> {
    return this.queryBus.execute(new GetAvatarQuery(accountId));
  }

  @Post()
  @UseInterceptors(FileInterceptor('file')) // поле 'file' в multipart
  async createAvatar(
    @Body() dto: CreateContentPayloadDto,
    @UploadedFile() file: IUploadedMulterFile,
    @AccountId() accountId: string,
  ): Promise<UploadFileResultDto> {
    return this.commandBus.execute(
      new CreateAvatarCommand(dto, file, accountId),
    );
  }

  @Delete()
  async removeAvatar(@AccountId() accountId: string): Promise<void> {
    return await this.commandBus.execute(new DeleteAvatarCommand(accountId));
  }
}
