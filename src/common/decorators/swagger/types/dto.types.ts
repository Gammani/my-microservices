import { ApiProperty } from '@nestjs/swagger';

export class UserViewModel {
  @ApiProperty({
    example: '72de1ea6-db61-4e82-a4f1-f7b1fc9c845a',
    description: 'Unique identifier of the user (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Login name of the user',
  })
  login: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 30,
    description: 'Age of the user',
  })
  age: number;

  @ApiProperty({
    example: 'Software developer and open-source contributor',
    description: 'Short description or bio of the user',
  })
  description: string;

  @ApiProperty({
    example: '2025-05-18T03:56:50.992Z',
    description: 'Date and time when the user was created',
  })
  createdAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({
    example: 100,
    description: 'Total number of users found by the search query',
  })
  totalCount: number;

  @ApiProperty({
    example: 10,
    description: 'Total number of pages available',
  })
  pageCount: number;

  @ApiProperty({
    example: 10,
    description: 'Number of users per page',
  })
  pageSize: number;

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  page: number;

  @ApiProperty({
    type: [UserViewModel],
    description: 'List of users for the current page',
  })
  items: UserViewModel[];
}
