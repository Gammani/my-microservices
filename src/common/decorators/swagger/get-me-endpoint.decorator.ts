import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserViewModel } from './types/dto.types';

export function GetMeEndpoint() {
  return applyDecorators(
    ApiTags('Profile'),
    ApiOperation({ summary: 'Get my profile' }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success',
      type: UserViewModel,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'login or password is incorrect',
    }),
  );
}
