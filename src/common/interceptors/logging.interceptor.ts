import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import Redis from "ioredis";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const path = request.url;

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                this.logStats(path, duration);
            }),
        );
    }

    private buildKeys(path: string) {
        const currentHour = new Date().getHours().toString().padStart(2, '0');
        return {
            timeKey: `stats:${path}`,
            hourlyKey: `stats:${path}:hour:${currentHour}`,
        };
    }

    private async logStats(path: string, duration: number) {
        const { timeKey, hourlyKey } = this.buildKeys(path);
        try {
            await Promise.all([
                this.redis.incr(hourlyKey),
                this.redis.sadd('stats:paths', path),
                this.redis.incr(`${timeKey}:count`),
                this.redis.incrby(`${timeKey}:total`, duration),
            ]);
        } catch (err) {
            Logger.warn(`Redis logging failed for ${path}: ${err}`, 'LoggingInterceptor');
        }
    }
}
