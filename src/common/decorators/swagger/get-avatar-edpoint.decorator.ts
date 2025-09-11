import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadFileResultDto } from '../../../modules/content/api/models/output/upload-file-result.dto';

export function GetAvatarEndpoint() {
  return applyDecorators(
    ApiOperation({ summary: 'Get avatar by userId' }),
    ApiBearerAuth('JWT-auth'),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'success updated avatar',
      type: UploadFileResultDto,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'If the password or login is wrong',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Not Found',
    }),
  );
}
