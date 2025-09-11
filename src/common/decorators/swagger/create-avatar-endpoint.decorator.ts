import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators, HttpStatus } from '@nestjs/common';

export function CreateAvatarEndpointDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Load image' }),
    ApiBearerAuth('JWT-auth'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary', // Описание файла для загрузки
            description: 'Image file (jpg, jpeg, png, webp, gif, bmp, etc.)',
          },
        },
        required: ['file'], // Указание, что файл обязателен
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the password or login is wrong',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'success updated avatar',
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'error on update avatar',
    }),
  );
}
