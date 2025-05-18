import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'about myself',
    example: 'Hello World!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'age',
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;
}
