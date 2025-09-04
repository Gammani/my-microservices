import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '../application/queries/get-users.query';
import { UserDto } from '../application/dto/user.dto';
import { GetUsersQueryDto } from './model/input/get.users.dto';
import { GetUsersEndpointDecorator } from '../../../common/decorators/swagger/get-users-endpoint.decorator';
import { PaginatedResponseDto } from '../../../common/types/index.types';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @GetUsersEndpointDecorator()
  async getUsers(
    @Query() query: GetUsersQueryDto,
  ): Promise<PaginatedResponseDto<UserDto>> {
    return this.queryBus.execute(
      new GetUsersQuery(
        query.searchLoginTerm,
        query.sortDirection,
        query.pageNumber,
        query.pageSize,
      ),
    );
  }
}
