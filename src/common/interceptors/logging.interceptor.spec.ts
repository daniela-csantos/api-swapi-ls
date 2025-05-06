import { LoggingInterceptor } from './logging.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      incr: jest.fn().mockResolvedValue(1),
      sadd: jest.fn().mockResolvedValue(1),
      incrby: jest.fn().mockResolvedValue(1),
    };

    interceptor = new LoggingInterceptor(redisMock);
  });

  function createMockContext(path = '/test'): ExecutionContext {
    const mockRequest = {
      url: path,
    };

    const mockHttpArgumentsHost = {
      getRequest: () => mockRequest,
      getResponse: () => ({}),
      getNext: () => undefined,
    };

    return {
      switchToHttp: () => mockHttpArgumentsHost,
    } as unknown as ExecutionContext;
  }

  it('should log stats to Redis on successful request', async () => {
    const context = createMockContext('/test');
    const callHandler: CallHandler = {
      handle: () => of('response'),
    };

    const result = await interceptor.intercept(context, callHandler).toPromise();

    expect(result).toBe('response');
    expect(redisMock.incr).toHaveBeenCalled();
    expect(redisMock.sadd).toHaveBeenCalledWith('stats:paths', '/test');
    expect(redisMock.incrby).toHaveBeenCalled();
  });

});
