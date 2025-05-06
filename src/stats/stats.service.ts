import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Redis } from 'ioredis';

@Injectable()
export class StatsService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) { }

  @Cron('*/5 * * * *')
  async handleCron() {
    Logger.log('Recomputing stats from raw data...', 'StatsService');
    await this.calculateAndCacheStats();
  }

  async recordRequestStats(path: string, duration: number): Promise<void> {
    console.log(path)
    const currentHour = new Date().getHours().toString().padStart(2, '0');
    const hourlyKey = `stats:${path}:hour:${currentHour}`;
    console.log(hourlyKey)
    console.log(currentHour)

    try {
      await Promise.all([
        this.redis.incr(hourlyKey),
        this.redis.incr(`stats:${path}:count`),
        this.redis.incrby(`stats:${path}:total_time`, duration),
        this.redis.sadd('stats:paths', path),
      ]);
    } catch (err) {
      Logger.warn(`Failed to record stats for ${path}: ${err.message}`, 'StatsService');
    }
  }

  async calculateAndCacheStats(): Promise<void> {
    const paths = await this.redis.smembers('stats:paths');

    for (const path of paths) {
      const count = parseInt(await this.redis.get(`stats:${path}:count`) || '0', 10);
      const totalTime = parseInt(await this.redis.get(`stats:${path}:total_time`) || '0', 10);
      const average = count > 0 ? totalTime / count : 0;

      const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
      const hourlyKeys = hours.map(hour => `stats:${path}:hour:${hour}`);
      const hourlyCounts = await this.redis.mget(...hourlyKeys);

      let busiestHour;
      let maxRequests = 0;
      hourlyCounts.forEach((value, index) => {
        const count = parseInt(value || '0', 10);
        if (count > maxRequests) {
          maxRequests = count;
          busiestHour = hours[index];
        }
      });

      const cached = {
        path,
        count,
        totalTime,
        averageDuration: average,
        busiestHour,
        lastUpdated: new Date().toISOString(),
      };

      await this.redis.set(`stats:cached:${path}`, JSON.stringify(cached));
    }
  }

  async getAllCachedStats(): Promise<any[]> {
    const paths = await this.redis.smembers('stats:paths');
    const stats = await Promise.all(
      paths.map(async (path) => {
        const raw = await this.redis.get(`stats:cached:${path}`);
        return raw ? JSON.parse(raw) : null;
      }),
    );

    return stats.filter((item) => item !== null);
  }

}