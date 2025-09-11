import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ContentRepository } from '../../repository/content.repository';
import { IFileService } from '../../../../providers/files/files.adapter';
import { ContentEntity } from '../../entity/content.entity';
import { IUploadedMulterFile } from '../../../../providers/files/s3/interfaces/upload-file.interface';
import { generateFileName } from '../../../../common/utils/generate-file-name';
import { UploadFileResultDto } from '../../api/models/output/upload-file-result.dto';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserEntity } from '../../../user/entity/user.entity';

type CreateContentPayloadDto = { folder?: string };

export class CreateAvatarCommand {
  constructor(
    public dto: CreateContentPayloadDto,
    public file: IUploadedMulterFile,
    public accountId: string,
  ) {}
}

@CommandHandler(CreateAvatarCommand)
export class CreateAvatarHandler
  implements ICommandHandler<CreateAvatarCommand>
{
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly userRepository: UserRepository,
    private readonly fileService: IFileService,
  ) {}

  async execute(command: CreateAvatarCommand): Promise<UploadFileResultDto> {
    const { dto, file, accountId } = command;

    // 1. Находим пользователя и аватарку
    const user: UserEntity | null =
      await this.userRepository.foundUserWithAvatar(accountId);

    // 2. Если у юзера есть аватар — удаляем старый файл и ContentEntity
    if (user?.avatarContent) {
      // Сначала физически удаляем файл из S3/MinIO
      await this.fileService.removeFile({ path: user.avatarContent.fileKey });

      // Потом удаляем запись ContentEntity из базы
      await this.contentRepository.delete(user.avatarContent.id);
    }

    // 3. Генерируем новое имя, загружаем новый файл
    const folder = dto?.folder ?? 'avatars';
    const uploadResult = await this.fileService.uploadFile({
      folder,
      file,
      name: generateFileName(file.originalname),
    });

    const url = uploadResult.path;

    // 4. Создаём новую запись ContentEntity
    const content = await this.contentRepository.createAndSave({
      fileKey: url,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    } as Partial<ContentEntity>);

    // 5. Привязываем новую аватарку к пользователю
    if (!user) throw new Error('User not found');
    await this.userRepository.attachAvatar(user, content);

    return { path: url };
  }
}
