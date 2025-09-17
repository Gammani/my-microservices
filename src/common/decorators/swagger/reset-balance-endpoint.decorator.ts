import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ResetBalanceEndpointDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reset balance for all users',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.ACCEPTED, // 202
      description: 'Reset scheduled',
      schema: {
        example: {
          status: 'reset scheduled',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
