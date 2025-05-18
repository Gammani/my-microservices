import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UserRepository } from '../../repositories/user.repository';
import { UserDto } from '../dto/user.dto';
import { paginate } from '../../../../common/utils/helper.functions';
import { PaginatedResponseDto } from '../../../../common/types/index.types';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResponseDto<UserDto>> {
    const { searchLoginTerm, sortDirection, pageNumber, pageSize } = query;

    const [users, totalCount] = await this.userRepository.findWithPagination({
      searchLoginTerm,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const items: UserDto[] = users.map((user) => new UserDto(user));

    return paginate(items, totalCount, pageSize, pageNumber);
  }
}
