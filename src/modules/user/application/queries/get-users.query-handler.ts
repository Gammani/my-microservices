import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { GetUsersQuery } from './get-users.query';
import { UserRepository } from '../../repositories/user.repository';
import { UserDto } from '../dto/user.dto';
import { paginate } from '../../../../common/utils/helper.functions';
import { PaginatedResponseDto } from '../../../../common/types/index.types';

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
  private readonly logger = new Logger(GetUsersQueryHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetUsersQuery): Promise<PaginatedResponseDto<UserDto>> {
    const { searchLoginTerm, sortDirection, pageNumber, pageSize } = query;
    const cacheKey = `users:all:${searchLoginTerm || ''}:${sortDirection}:${pageNumber}:${pageSize}`;

    this.logger.debug(`[CACHE] Looking for cache key: ${cacheKey}`);

    // Читаем как строку и распарсим вручную
    const cachedRaw = await this.cacheManager.get<string>(cacheKey);
    if (cachedRaw) {
      this.logger.log(`[CACHE HIT] Data for ${cacheKey} returned from Redis`);
      const parsed = JSON.parse(cachedRaw) as PaginatedResponseDto<UserDto>;
      // Возвращаем объект PaginatedResponseDto с теми же полями
      return new PaginatedResponseDto<UserDto>(
        parsed.totalCount,
        parsed.pageSize,
        parsed.items,
        parsed.page,
      );
    } else {
      this.logger.warn(
        `[CACHE MISS] Data for ${cacheKey} not found. Querying database.`,
      );
    }

    // Достаём данные из БД
    const [users, totalCount] = await this.userRepository.findWithPagination({
      searchLoginTerm,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const items: UserDto[] = users.map((user) => new UserDto(user));

    const result = paginate<UserDto>(items, totalCount, pageSize, pageNumber);

    try {
      // Кладём как строку; TTL 30 секунд (30000 мс)
      await this.cacheManager.set(cacheKey, JSON.stringify(result), 30000);
      this.logger.debug(`[CACHE SET] Cached key ${cacheKey} for 30s`);
    } catch (err) {
      this.logger.error(`[CACHE SET ERROR] ${err}`);
    }

    return result;
  }
}
