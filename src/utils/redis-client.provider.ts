import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Redis } from 'ioredis';

@Injectable()
export class RedisClientProvider implements OnModuleInit, OnModuleDestroy {
  private static client: Redis;
  private readonly logger = new Logger(RedisClientProvider.name);

  constructor(private readonly configService: ConfigService) {}

  static getClient(): Redis {
    if (!RedisClientProvider.client) {
      throw new Error('Redis client has not been initialized');
    }
    return RedisClientProvider.client;
  }

  onModuleInit() {
    if (!RedisClientProvider.client) {
      RedisClientProvider.client = new Redis(this.configService.get('redis'));

      RedisClientProvider.client.on('error', (err) => {
        this.logger.error(`Redis Client Error: ${err.message}`);
      });

      this.logger.log('Redis client initialized');
    }
  }

  onModuleDestroy() {
    if (RedisClientProvider.client) {
      RedisClientProvider.client.quit();
      this.logger.log('Redis client disconnected');
    }
  }
}
