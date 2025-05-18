import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../validation/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class AuthInputModel {
  @ApiProperty({
    description: 'loginOrEmail',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @ApiProperty({
    description: 'password',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;
}
