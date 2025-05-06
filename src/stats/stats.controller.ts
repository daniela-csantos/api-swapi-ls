import { Controller, Get, Inject, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Redis } from 'ioredis';
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stats')
@UseGuards(ApiKeyGuard)
@Controller()
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) { }

  @ApiOperation({ summary: 'Get previous queries stats' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('stats')
  async getStats(): Promise<Object> {
    return await this.statsService.getAllCachedStats()
  }

}
