import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CreateContentPayloadDto } from './models/input/createUpdateDto';
import { IUploadedMulterFile } from '../../../providers/files/s3/interfaces/upload-file.interface';
import { AccountId } from '../../validation/decorators/validate/accountId.decorator';
import { CreateAvatarCommand } from '../application/commands/create-avatar.handler';
import { UploadFileResultDto } from './models/output/upload-file-result.dto';
import { GetAvatarQuery } from '../application/queries/get-avatar.query';
import { DeleteAvatarCommand } from '../application/commands/delete-avatar.handler';
import { CreateAvatarEndpointDecorator } from '../../../common/decorators/swagger/create-avatar-endpoint.decorator';
import { GetAvatarEndpoint } from '../../../common/decorators/swagger/get-avatar-edpoint.decorator';
import { DeleteAvatarEndpoint } from '../../../common/decorators/swagger/delete-avatar-edpoint.decorator';

@ApiTags('Avatar')
@Controller('avatar')
export class ContentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @GetAvatarEndpoint()
  async getAvatar(
    @AccountId() accountId: string,
  ): Promise<UploadFileResultDto> {
    return this.queryBus.execute(new GetAvatarQuery(accountId));
  }

  @Post()
  @CreateAvatarEndpointDecorator()
  @UseInterceptors(FileInterceptor('file')) // поле 'file' в multipart
  async createAvatar(
    @Body() dto: CreateContentPayloadDto,
    @UploadedFile() file: IUploadedMulterFile,
    @AccountId() accountId: string,
  ): Promise<UploadFileResultDto> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.commandBus.execute(
      new CreateAvatarCommand(dto, file, accountId),
    );
  }

  @Delete()
  @DeleteAvatarEndpoint()
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAvatar(@AccountId() accountId: string): Promise<void> {
    return await this.commandBus.execute(new DeleteAvatarCommand(accountId));
  }
}
