import { CreateAvatarHandler } from './application/commands/create-avatar.handler';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { SharingModule } from '../../shared/sharing.module';
import { ContentEntity } from './entity/content.entity';
import { ContentController } from './api/content.controller';
import { ContentRepository } from './repository/content.repository';
import { FilesModule } from '../../providers/files/files.module';
import { GetAvatarQueryHandler } from './application/queries/get-avatar.query-handler';
import { DeleteAvatarHandler } from './application/commands/delete-avatar.handler';
import { UserRepository } from '../user/repositories/user.repository';

const useCases = [
  GetAvatarQueryHandler,
  CreateAvatarHandler,
  DeleteAvatarHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ContentEntity]),
    SharingModule,
    FilesModule,
  ],
  controllers: [ContentController],
  providers: [ContentRepository, UserRepository, ...useCases],
})
export class ContentModule {}
