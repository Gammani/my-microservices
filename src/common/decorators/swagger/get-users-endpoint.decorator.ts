import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../types/index.types';
import { PaginatedUsersResponseDto } from './types/dto.types';

export function GetUsersEndpointDecorator() {
  return applyDecorators(
    ApiTags('Users'),
    ApiOperation({
      summary: 'Return all users',
    }),
    ApiBearerAuth('JWT-auth'),

    ApiQuery({
      name: 'searchLoginTerm',
      required: false,
      type: String,
      description:
        'Search term for user login. Login should contain this term in any position.',
      example: 'john',
    }),
    ApiQuery({
      name: 'sortDirection',
      required: false,
      type: String,
      enum: ['asc', 'desc'],
      example: 'desc',
      description: 'Sorting direction by created date: asc or desc',
    }),
    ApiQuery({
      name: 'pageNumber',
      required: false,
      type: Number,
      example: 1,
      description: 'Page number (portion of results to return)',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: 10,
      description: 'Page size (number of users per page)',
    }),

    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: PaginatedUsersResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
