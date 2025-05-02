import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserProfileDto } from '../../api/model/output/profile.response';

export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<any> {
    const user = await this.usersRepository.findById(query.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return new UserProfileDto(user); // Можно тут замапить на DTO, если нужно
  }
}
