import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ContentRepository } from '../../repository/content.repository';
import { IFileService } from '../../../../providers/files/files.adapter';
import { UserEntity } from '../../../user/entity/user.entity';
import { UserRepository } from '../../../user/repositories/user.repository';

export class DeleteAvatarCommand {
  constructor(public accountId: string) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
    private readonly fileService: IFileService,
  ) {}

  async execute(command: DeleteAvatarCommand): Promise<void> {
    // 1. Находим пользователя и аватарку
    const user: UserEntity | null =
      await this.userRepository.foundUserWithAvatar(command.accountId);

    // 2. Если у юзера есть аватар — удаляем старый файл и ContentEntity
    if (user?.avatarContent) {
      // Сначала физически удаляем файл из S3/MinIO
      await this.fileService.removeFile({ path: user.avatarContent.fileKey });

      // Потом удаляем запись ContentEntity из базы
      await this.contentRepository.delete(user.avatarContent.id);
    }

    return;
  }
}
