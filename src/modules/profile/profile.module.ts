import { Module } from '@nestjs/common';
import { SharingModule } from '../../shared/sharing.module';
import { ProfileController } from './api/profile.controller';
import { JwtService } from '../auth/application/jwt.secret';
import { PasswordAdapter } from '../../shared/adapter/password.adapter';
import { DeleteProfileHandler } from './application/commands/delete-profile.handler';
import { UpdateProfileHandler } from './application/commands/update-profile.handler';
import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';

const useCases = [UpdateProfileHandler, DeleteProfileHandler];

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), SharingModule],
  controllers: [ProfileController],
  providers: [JwtService, PasswordAdapter, UserRepository, ...useCases],
})
export class ProfileModule {}
