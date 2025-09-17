import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

const client = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

@Injectable()
export class RedisCacheService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      store: {
        get: async (key: string) => {
          const val = await client.get(key);
          if (val === null) return null;
          try {
            return JSON.parse(val);
          } catch {
            return val;
          }
        },
        set: async (key: string, value: any, ttl?: number) => {
          await client.set(key, JSON.stringify(value), 'EX', ttl || 30);
        },
        del: async (key: string) => {
          await client.del(key);
        },
      },
      ttl: 30,
      isCacheableValue: () => true,
    };
  }
}
