// user-query.dto.ts

import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetUsersQueryDto {
  @IsOptional()
  @IsString()
  searchLoginTerm?: string;

  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return 'asc';
    const val = value.toLowerCase();
    return val === 'desc' ? 'desc' : 'asc';
  })
  @IsIn(['asc', 'desc'])
  sortDirection: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @Transform(({ value }) => +value || 1)
  pageNumber: number = 1;

  @IsOptional()
  @Transform(({ value }) => +value || 10)
  pageSize: number = 10;
}
