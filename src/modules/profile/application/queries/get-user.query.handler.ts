import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserProfileDto } from '../../api/model/output/profile.response';
import { UnauthorizedException } from '@nestjs/common';

export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  constructor(private readonly usersRepository: UserRepository) {}

  async execute(query: GetUserQuery): Promise<any> {
    const user = await this.usersRepository.findById(query.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return new UserProfileDto(user); // Можно тут замапить на DTO, если нужно
  }
}
