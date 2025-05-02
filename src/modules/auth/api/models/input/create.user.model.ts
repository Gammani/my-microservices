import { Trim } from '../../../../../common/decorators/transform/trim';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LoginIsExist } from '../../../../../common/decorators/validate/login.isExist.decorator';
import { EmailIsExist } from '../../../../../common/decorators/validate/email.isExist.decorator';

export class CreateUserModel {
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  @IsNotEmpty()
  @LoginIsExist()
  login: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;

  @Trim()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  @EmailIsExist()
  email: string;

  @Type(() => Number) // <--- это преобразует строку в число
  @IsNumber()
  @Min(1)
  age: number;

  @Trim()
  @IsString()
  @IsOptional()
  description: string;
}
