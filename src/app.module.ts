import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisProvider } from './common/providers/redis.provider';
import { StatsService } from './stats/stats.service';
import { StatsController } from './stats/stats.controller';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MoviesController } from './movies/movies.controller';
import { PeopleController } from './people/people.controller';
import { MoviesService } from './movies/movies.service';
import { PeopleService } from './people/people.service';
import { SwapiApi } from './swapi/swapi.api';
import { HttpModule } from '@nestjs/axios';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    })],
  controllers: [
    AppController,
    StatsController,
    MoviesController,
    PeopleController,
  ],
  providers: [
    LoggingInterceptor,
    RedisProvider,
    AppService,
    StatsService,
    MoviesService,
    PeopleService,
    SwapiApi,
    AllExceptionsFilter,
  ],
})
export class AppModule { }
