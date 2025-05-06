import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from './stats.service';
import { Redis } from 'ioredis';

describe('StatsService', () => {
  let service: StatsService;
  let redisMock: Partial<Redis>;

  beforeEach(async () => {
    redisMock = {
      incr: jest.fn(),
      incrby: jest.fn(),
      sadd: jest.fn(),
      smembers: jest.fn(),
      get: jest.fn(),
      mget: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        { provide: 'REDIS_CLIENT', useValue: redisMock },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  it('should record request stats', async () => {
    await service.recordRequestStats('/people', 120);

    expect(redisMock.incr).toHaveBeenCalledWith('stats:/people:hour:' + new Date().getHours().toString().padStart(2, '0'));
    expect(redisMock.incr).toHaveBeenCalledWith('stats:/people:count');
    expect(redisMock.incrby).toHaveBeenCalledWith('stats:/people:total_time', 120);
    expect(redisMock.sadd).toHaveBeenCalledWith('stats:paths', '/people');
  });

  it('should calculate and cache stats', async () => {
    redisMock.smembers = jest.fn().mockResolvedValue(['/people']);
    redisMock.get = jest.fn()
      .mockImplementation((key) => {
        if (key === 'stats:/people:count') return Promise.resolve('10');
        if (key === 'stats:/people:total_time') return Promise.resolve('1000');
        if (key.startsWith('stats:/people:hour:')) return Promise.resolve('5');
        return Promise.resolve(null);
      });
    redisMock.mget = jest.fn().mockResolvedValue(Array(24).fill('5'));

    await service.calculateAndCacheStats();

    expect(redisMock.set).toHaveBeenCalledWith(
      'stats:cached:/people',
      expect.stringContaining('"path":"/people"')
    );
  });

  it('should get all cached stats', async () => {
    redisMock.smembers = jest.fn().mockResolvedValue(['/people']);
    redisMock.get = jest.fn().mockResolvedValue(JSON.stringify({
      path: '/people',
      count: 10,
      averageDuration: 100,
    }));

    const result = await service.getAllCachedStats();

    expect(result).toEqual([
      expect.objectContaining({ path: '/people' }),
    ]);
  });
  
  it('should trigger calculateAndCacheStats on cron', async () => {
    const spy = jest.spyOn(service, 'calculateAndCacheStats').mockResolvedValue();

    await service.handleCron();

    expect(spy).toHaveBeenCalled();
  });
});
