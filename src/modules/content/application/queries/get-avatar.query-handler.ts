import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAvatarQuery } from './get-avatar.query';
import { UploadFileResultDto } from '../../api/models/output/upload-file-result.dto';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserEntity } from '../../../user/entity/user.entity';
import { getPublicUrl } from '../../../../common/utils/get-url';

@QueryHandler(GetAvatarQuery)
export class GetAvatarQueryHandler implements IQueryHandler<GetAvatarQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetAvatarQuery): Promise<UploadFileResultDto> {
    // Находим пользователя и сразу подгружаем его аватарку (ContentEntity)
    const user: UserEntity | null =
      await this.userRepository.foundUserWithAvatar(query.accountId);

    if (!user?.avatarContent) {
      return {
        path: null,
      };
    }

    return { path: getPublicUrl(user.avatarContent) };
  }
}
