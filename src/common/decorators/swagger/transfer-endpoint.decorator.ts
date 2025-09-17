import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function TransferEndpointDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Transfer money between users',
    }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.CREATED, // 201
      description: 'Transfer successful',
      schema: {
        example: {
          status: 'ok',
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Unauthorized',
    }),
  );
}
