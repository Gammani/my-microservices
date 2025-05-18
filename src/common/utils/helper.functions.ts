import { PaginatedResponseDto } from '../types/index.types';

export function paginate<T>(
  items: T[],
  totalCount: number,
  pageSize: number,
  pageNumber: number,
): PaginatedResponseDto<T> {
  return new PaginatedResponseDto(totalCount, pageSize, items, pageNumber);
}
