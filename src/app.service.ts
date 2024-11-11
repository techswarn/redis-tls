import { Injectable } from '@nestjs/common';
import { RedisCache } from './utils/redis-cache.decorator';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // Funstion is async because we are using RedisCache decorator
  @RedisCache({ ttl: 60 })
  async getFibonacci(n: number): Promise<number> {
    if (n <= 0) {
      return 0;
    }
    if (n === 1) {
      return 1;
    }
    return (await this.getFibonacci(n - 1)) + (await this.getFibonacci(n - 2));
  }
}
