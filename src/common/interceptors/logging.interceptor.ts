import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { StatsService } from "../../stats/stats.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly statsService: StatsService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const path = request.url;

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - now;
                this.statsService.recordRequestStats(path, duration);
            }),
        );
    }
}
