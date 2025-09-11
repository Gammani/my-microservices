import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteAvatarEndpoint() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete avatar' }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'No Content',
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the password or login is wrong',
    }),
  );
}
