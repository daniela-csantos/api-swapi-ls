import { Injectable } from '@nestjs/common';
import { SwapiApi } from '../swapi/swapi.api';
import { PeopleDto } from './dto/person.dto';
import { plainToInstance } from 'class-transformer';
import { MovieDto } from '../movies/dto/movie.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly swapiApi: SwapiApi) { }

  async getPeopleByQueryString(queryString: string): Promise<Array<PeopleDto>> {
    const response = await this.swapiApi.getSwapiResults(`/people/?name=${queryString}`);
    return response.map(people => plainToInstance(PeopleDto, people))
  }

  async getMoviesByCharacterId(id: string): Promise<Array<MovieDto>> {
    const films = await this.swapiApi.getSwapiResults(`/films`);
    const filmDetails = films.map(film => plainToInstance(MovieDto, film));
    return this.filterFilmsByCharacterId(filmDetails, id);
  }
  async getPerson(id: string): Promise<PeopleDto> {
    const response = await this.swapiApi.getSwapiResults(`/people/${id}`);
    return plainToInstance(PeopleDto, response);
  }
  private filterFilmsByCharacterId(films: MovieDto[], characterId: string): MovieDto[] {
    return films.filter(film =>
      film.properties.characters.some((url: string) => url.endsWith(`/people/${characterId}`))
    );
  }
}
