import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UserRepository } from '../../repositories/user.repository';
import { UserDto } from '../dto/user.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<UserDto[]> {
    const { searchLoginTerm, sortDirection, pageNumber, pageSize } = query;

    const [users] = await this.userRepository.findWithPagination({
      searchLoginTerm,
      sortDirection,
      pageNumber,
      pageSize,
    });

    return users.map((user) => new UserDto(user));
  }
}
