import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class StatsService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) { }

  async getBusiestHour(path: string) {
    const keys = this.getHourlyKeys(path);
    const values = await this.redis.mget(keys);

    let max = 0;
    let busiestHour = '';
    for (let i = 0; i < values.length; i++) {
      const count = parseInt(values[i] || '0', 10);
      if (count > max) {
        max = count;
        busiestHour = i.toString().padStart(2, '0');
      }
    }

    return { path, busiestHour, requests: max };
  }
  private getHourlyKeys(path: string): string[] {
    const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    return hours.map(h => `stats:${path}:hour:${h}`);
  }

  async getStatsFromAllPaths() {
    const paths = await this.redis.smembers('stats:paths');
    const stats = {};

    for (const path of paths) {
      const totalKey = `stats:${path}:total`;
      const countKey = `stats:${path}:count`;

      const total = parseFloat(await this.redis.get(totalKey) || '0');
      const count = parseInt(await this.redis.get(countKey) || '0', 10);
      const busiestHour = await this.getBusiestHour(path)
      const average = count > 0 ? total / count : 0;

      stats[path] = {
        count,
        busiestHour,
        averageResponseTime: `${average.toFixed(2)}ms`

      };
    }

    return stats;

  }
  async getStatsFrom(path: string) {
    const results = await this.redis
      .multi()
      .get(`stats:${path}:count`)
      .get(`stats:${path}:total`)
      .exec();
    const busiestHour = await this.getBusiestHour(path)

    let count = 0;
    let total = 0;

    if (results) {
      const countResult = results[0]?.[1];
      const totalResult = results[1]?.[1];
      count = typeof countResult === 'string' ? parseInt(countResult) : 0;
      total = typeof totalResult === 'string' ? parseInt(totalResult) : 0;

    }

    return {
      path,
      totalRequests: count,
      averageResponseTime: `${count > 0 ? (total / count).toFixed(2) : 0}ms`,
      busiestHour
    };
  }

}