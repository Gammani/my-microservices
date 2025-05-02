import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '../application/queries/get-users.query';
import { UserDto } from '../application/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getUsers(
    @Query('searchLoginTerm') searchLoginTerm?: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'asc',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<UserDto[]> {
    return await this.queryBus.execute(
      new GetUsersQuery(searchLoginTerm, sortDirection, +pageNumber, +pageSize),
    );
  }
}
