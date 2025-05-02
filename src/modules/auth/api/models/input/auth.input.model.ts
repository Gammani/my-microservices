import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';

export class AuthInput {
  @Trim()
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;
}
