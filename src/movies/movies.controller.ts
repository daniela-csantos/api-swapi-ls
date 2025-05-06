import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movie.dto';
import { PeopleDto } from '../people/dto/person.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly swapiService: MoviesService) { }

  @ApiOperation({ summary: 'Get array of movies by name' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('/search/:queryString')
  getPersonByQueryString(@Param('queryString') queryString: string): Promise<Array<MovieDto>> {
    return this.swapiService.getMovieByQueryString(queryString);
  }

  @ApiOperation({ summary: 'Get specific movie by id' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  getMovieById(@Param('id') id: string): Promise<MovieDto> {
    return this.swapiService.getMovie(id);
  }

  @ApiOperation({ summary: 'Get array of character by movies id' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id/people')
  getMovieCharactersByMovieId(@Param('id') id: string): Promise<Array<PeopleDto>> {
    return this.swapiService.getCharactersByMovieId(id);
  }
}
