import { Logger } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';

import { RedisClientProvider } from './redis-client.provider';

interface RedisCacheOptions {
  /**
   * Time to live in SECONDS
   * @default 10
   */
  ttl?: number;
  /**
   * Function to resolve the cache key
   * @default JSON.stringify
   */
  resolver?: (...args: any[]) => string;
  /**
   * Optional class reference to dehydrate cached objects
   */
  as?: any;
}

type AsyncMethod<T = any> = (...args: any[]) => Promise<T>;

function assertIsAsyncFunction<T>(
  fn: T,
): asserts fn is T & ((...args: any[]) => Promise<any>) {
  if (!(fn instanceof Function) || fn.constructor.name !== 'AsyncFunction') {
    throw new TypeError('Decorated method must be an async function');
  }
}

const defaultKeyResolver = (...args: any[]): string => {
  return JSON.stringify(args);
};

/**
 * Decorator that caches the return value of a method in Redis.
 * @param options Options for the cache
 */
export function RedisCache(options: RedisCacheOptions = {}) {
  const { ttl = 10, resolver = defaultKeyResolver } = options;

  const logger = new Logger('RedisCache');

  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<AsyncMethod>,
  ): TypedPropertyDescriptor<AsyncMethod> | void {
    const originalMethod = descriptor.value as AsyncMethod;

    assertIsAsyncFunction(originalMethod);

    const cachePrefix = `redis_cache:${target.constructor.name}_${propertyKey}`;

    descriptor.value = async function (...args: any[]): Promise<any> {
      let redis;
      try {
        redis = RedisClientProvider.getClient();
      } catch {
        logger.error('Redis client not initialized. Proceeding without cache.');
        return await originalMethod.apply(this, args);
      }

      const key = `${cachePrefix}:${resolver(...args)}`;
      try {
        const cached = await redis.get(key);
        if (cached) {
          logger.debug(
            `Cache hit for key: ${key}, dehydrator: ${options.as?.name}`,
          );
          const cachedObject = JSON.parse(cached);

          return options.as
            ? plainToInstance(options.as, cachedObject)
            : cachedObject;
        }
      } catch (error) {
        logger.error(`Error getting cache: ${error.message}`);
      }

      const result = await originalMethod.apply(this, args);

      try {
        await redis.set(key, JSON.stringify(result), 'EX', ttl);
        logger.debug(`Cache set for key: ${key} with TTL: ${ttl}`);
      } catch (error) {
        logger.error(`Error setting cache: ${error.message}`);
      }

      return result;
    };

    return descriptor;
  };
}
