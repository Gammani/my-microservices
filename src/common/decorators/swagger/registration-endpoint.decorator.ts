import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function SwaggerRegistrationEndpoint() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Registration in the system',
    }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Input data is accepted',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
      schema: {
        example: {
          errorsMessages: [
            {
              message: 'string',
              field: 'string',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
  );
}
