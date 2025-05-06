import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { SwapiApi } from '../swapi/swapi.api';
import { of } from 'rxjs';
import { MovieDto } from './dto/movie.dto';
import { PeopleDto } from '../people/dto/person.dto';
import { AppModule } from '../app.module';

describe('MoviesService', () => {
  let service: MoviesService;
  let swapiApi: SwapiApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        MoviesService,
        {
          provide: SwapiApi,
          useValue: {
            getSwapiResults: jest.fn(),
            getPeopleByCharactersUrls: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    swapiApi = module.get<SwapiApi>(SwapiApi);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMovieByQueryString', () => {
    it('should return a list of movies', async () => {
      const mockMovies = [{ uid: 1, properties: { title: 'Test Movie' } }];
      jest.spyOn(swapiApi, 'getSwapiResults').mockResolvedValue(mockMovies);

      const result = await service.getMovieByQueryString('Test Movie');
      expect(result).toHaveLength(1);
      expect(result[0].properties.title).toBe('Test Movie');
    });
  });

  describe('getCharactersByMovieId', () => {
    it('should return a list of characters from the movie', async () => {
      const mockMovie = { properties: { characters: ['https://swapi.dev/api/people/1/'] } };
      const mockPeople = [{ properties: { name: 'Luke Skywalker' } }];
      jest.spyOn(swapiApi, 'getSwapiResults').mockResolvedValue(mockMovie);
      jest.spyOn(swapiApi, 'getPeopleByCharactersUrls').mockResolvedValue(mockPeople);

      const result = await service.getCharactersByMovieId('1');
      expect(result).toHaveLength(1);
      expect(result[0].properties.name).toBe('Luke Skywalker');
    });
  });
});
