import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { SharingModule } from '../../shared/sharing.module';
import { UserRepository } from './repositories/user.repository';
import { CreateUserHandler } from '../auth/application/commands/create-user.handler';
import { PasswordAdapter } from '../../shared/adapter/password.adapter';
import { GetUsersQueryHandler } from './application/queries/get-users.query-handler';
import { UsersController } from './api/user.controller';
import { UserService } from './application/user.service';
import { GetUserQueryHandler } from '../profile/application/queries/get-user.query.handler';

const useCases = [GetUsersQueryHandler, CreateUserHandler, GetUserQueryHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharingModule],
  controllers: [UsersController],
  providers: [UserService, UserRepository, PasswordAdapter, ...useCases],
  exports: [UserService, UserRepository],
})
export class UserModule {}
