import { ApiKeyGuard } from './api-key.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;

  beforeEach(() => {
    guard = new ApiKeyGuard();
    process.env.API_KEY = 'valid-api-key';
  });

  function createMockContext(apiKeyHeader?: string): ExecutionContext {
    const mockRequest = {
      headers: {
        'x-api-key': apiKeyHeader,
      },
    } as Partial<Request>;

    const mockHttpArgumentsHost = {
      getRequest: () => mockRequest,
      getResponse: () => ({}),
      getNext: () => undefined,
    };

    return {
      switchToHttp: () => mockHttpArgumentsHost,
    } as unknown as ExecutionContext;
  }

  it('should allow access when API key is valid', () => {
    const context = createMockContext('valid-api-key');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should deny access when API key is invalid', () => {
    const context = createMockContext('invalid-api-key');
    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid API key'),
    );
  });

  it('should deny access when API key is missing', () => {
    const context = createMockContext(undefined);
    expect(() => guard.canActivate(context)).toThrow(
      new UnauthorizedException('Invalid API key'),
    );
  });
});
