import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { UserRepository } from '../../../user/repositories/user.repository';
import { UserProfileDto } from '../../api/model/output/profile.response';

export class GetUserQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
  private readonly logger = new Logger(GetUserQueryHandler.name);

  constructor(
    private readonly usersRepository: UserRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetUserQuery): Promise<UserProfileDto> {
    const { userId } = query;
    const cacheKey = `profile:${userId}`;

    // 1) Попытка отдать из кэша
    try {
      const cached = await this.cacheManager.get<UserProfileDto>(cacheKey);
      if (cached) {
        this.logger.log(`[CACHE HIT] ${cacheKey}`);
        return cached;
      } else {
        this.logger.debug(`[CACHE MISS] ${cacheKey}`);
      }
    } catch (e) {
      this.logger.warn(`[CACHE READ ERROR] ${e}`);
    }

    // 2) Запрос в БД
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }
    const dto = new UserProfileDto(user);

    // 3) Сохранение в кэш (TTL в миллисекундах для cache-manager v7)
    try {
      await this.cacheManager.set(cacheKey, dto, 30000); // 30s
      this.logger.debug(`[CACHE SET] ${cacheKey} for 30s`);
    } catch (e) {
      this.logger.error(`[CACHE SET ERROR] ${e}`);
    }

    return dto;
  }
}
