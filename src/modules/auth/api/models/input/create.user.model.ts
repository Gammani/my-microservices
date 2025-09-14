import { Trim } from '../../../../validation/decorators/transform/trim';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LoginIsExist } from '../../../../validation/decorators/validate/login.isExist.decorator';
import { EmailIsExist } from '../../../../validation/decorators/validate/email.isExist.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserModel {
  @ApiProperty({
    description: 'Unique login for the user',
    example: 'HZTfbj1p0A',
  })
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  @IsNotEmpty()
  @LoginIsExist()
  login: string;

  @ApiProperty({
    description: 'password',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'email',
    example: 'example@example.com',
  })
  @Trim()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  @EmailIsExist()
  email: string;

  @ApiProperty({
    description: 'age',
    example: '25',
  })
  @Type(() => Number) // <--- это преобразует строку в число
  @IsNumber()
  @Min(18)
  age: number;

  @ApiProperty({
    description: 'about myself',
    example: 'Hello World!',
  })
  @Trim()
  @IsString()
  @Length(25, 5000)
  description: string;
}
