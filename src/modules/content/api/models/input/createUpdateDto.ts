// create-content-payload.dto.ts
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateContentPayloadDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  // безопасно ограничим допустимые символы в названии папки
  @Matches(/^[a-z0-9/_-]+$/i, {
    message: 'folder: only letters, numbers, / _ -',
  })
  folder?: string; // напр. 'avatars'
}
