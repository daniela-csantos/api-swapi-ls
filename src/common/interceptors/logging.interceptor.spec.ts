import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';
import { StatsService } from '../../stats/stats.service';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let statsService: StatsService;

  beforeEach(() => {
    statsService = {
      recordRequestStats: jest.fn(),
    } as any;

    interceptor = new LoggingInterceptor(statsService);
  });

  it('should call recordRequestStats with path and duration', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/test' }),
      }),
    } as unknown as ExecutionContext;

    const mockNext: CallHandler = {
      handle: () => of(null), 
    };

    await interceptor.intercept(mockContext, mockNext).toPromise();

    expect(statsService.recordRequestStats).toHaveBeenCalledWith('/test', expect.any(Number));
  });
});
