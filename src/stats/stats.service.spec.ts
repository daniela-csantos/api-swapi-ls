import { StatsService } from './stats.service';
import { Redis } from 'ioredis';

describe('StatsService', () => {
  let statsService: StatsService;
  let redisMock: Partial<Redis>;

  beforeEach(() => {
    const multiMock = {
      get: jest.fn().mockReturnThis(), 
      exec: jest.fn().mockResolvedValue([
        [null, '5'],
        [null, '50']
      ])
    };
    redisMock = {
      smembers: jest.fn(),
      get: jest.fn(),
      mget: jest.fn(),
      multi: jest.fn().mockReturnValue(multiMock),
      exec: jest.fn()
    };

    statsService = new StatsService(redisMock as Redis);
  });

  describe('getBusiestHour', () => {
    it('should return the hour with most requests', async () => {
      redisMock.mget = jest.fn().mockResolvedValue([
        '1', '3', '0', '7', '10', '5', '20', '0', '0', '0',
        ...Array(14).fill('0')
      ]);
      const result = await statsService.getBusiestHour('people');
      expect(result).toEqual({
        path: 'people',
        busiestHour: '06',
        requests: 20
      });
    });
  });

  describe('getStatsFromAllPaths', () => {
    it('should return stats for all paths', async () => {
      redisMock.smembers = jest.fn().mockResolvedValue(['people']);
      redisMock.get = jest.fn()
        .mockResolvedValueOnce('100') // total
        .mockResolvedValueOnce('10'); // count

      redisMock.mget = jest.fn().mockResolvedValue([
        '1',
        ...Array(23).fill('0')
      ]);

      const result = await statsService.getStatsFromAllPaths();

      expect(result).toEqual({
        people: {
          count: 10,
          busiestHour: {
            path: 'people',
            busiestHour: '00',
            requests: 1
          },
          averageResponseTime: '10.00ms'
        }
      });
    });
  });
  describe('getStatsFrom', () => {
    it('should return stats from a specific path', async () => {
      (redisMock.exec as jest.Mock).mockResolvedValue([
        [null, '5'],
        [null, '50']
      ]);

      (redisMock.mget as jest.Mock).mockResolvedValue([
        '1',
        ...Array(23).fill('0')
      ]);

      const result = await statsService.getStatsFrom('people');

      expect(result).toEqual({
        path: 'people',
        totalRequests: 5,
        averageResponseTime: '10.00ms',
        busiestHour: {
          path: 'people',
          busiestHour: '00',
          requests: 1
        }
      });
    });
  });
});
