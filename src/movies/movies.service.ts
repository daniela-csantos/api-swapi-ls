import { Injectable } from '@nestjs/common';
import { SwapiApi } from '../swapi/swapi.api';
import { plainToInstance } from 'class-transformer';
import { MovieDto } from './dto/movie.dto';
import { PeopleDto } from '../people/dto/person.dto';

@Injectable()
export class MoviesService {

  constructor(private readonly swapiApi: SwapiApi) { }

  async getMovieByQueryString(queryString: string): Promise<Array<MovieDto>> {
    const response = await this.swapiApi.getSwapiResults(`/films/?title=${queryString}`);
    return response.map(movies => plainToInstance(MovieDto, movies))
  }
  async getCharactersByMovieId(id: string): Promise<Array<PeopleDto>> {
    const film = await this.getMovie(id);
    const peopleUrls = film.properties.characters;
    const peopleResponses = await this.swapiApi.getPeopleByCharactersUrls(peopleUrls)
    const people = peopleResponses.map(res => {
      return plainToInstance(PeopleDto, res);
    });

    return people;
  }

  async getMovie(id: string): Promise<MovieDto> {
    const response = await this.swapiApi.getSwapiResults(`/films/${id}`);
    return plainToInstance(MovieDto, response);
  }
}
