import { Controller, Get, Param } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleDto } from './dto/person.dto';
import { MovieDto } from '../movies/dto/movie.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly swapiService: PeopleService) { }

  @ApiOperation({ summary: 'Get array of characters by name' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('/search/:queryString')
  getPeopleByQueryString(@Param('queryString') queryString: string): Promise<Array<PeopleDto>> {
    return this.swapiService.getPeopleByQueryString(queryString);
  }

  @ApiOperation({ summary: 'Get specific character by id' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  getPersonById(@Param('id') id: string): Promise<PeopleDto> {
    return this.swapiService.getPerson(id);
  }

  @ApiOperation({ summary: 'Get array of movies by character id' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id/movies')
  getMoviesByCharacterId(@Param('id') id: string): Promise<Array<MovieDto>> {
    return this.swapiService.getMoviesByCharacterId(id);
  }
}
