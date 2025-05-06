import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { SwapiApi } from '../swapi/swapi.api';
import { of } from 'rxjs';
import { PeopleDto } from './dto/person.dto';
import { MovieDto } from '../movies/dto/movie.dto';
import { AppModule } from '../app.module';

describe('PeopleService', () => {
  let service: PeopleService;
  let swapiApi: SwapiApi;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PeopleService,
        {
          provide: SwapiApi,
          useValue: {
            getSwapiResults: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    swapiApi = module.get<SwapiApi>(SwapiApi);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPeopleByQueryString', () => {
    it('should return a list of people', async () => {
      const mockPeople = [{ properties: { name: 'Luke Skywalker' } }];
      jest.spyOn(swapiApi, 'getSwapiResults').mockResolvedValue(mockPeople);

      const result = await service.getPeopleByQueryString('Luke');
      expect(result).toHaveLength(1);
      expect(result[0].properties.name).toBe('Luke Skywalker');
    });
  });

  describe('getMoviesByCharacterId', () => {
    it('should return a list of movies for a given character', async () => {
      const mockMovies = [{ uid: 1, properties: { title: 'Test Movie', characters: ['https://swapi.dev/api/people/1'] } }];
      const mockFilm = [{ properties: { title: 'Test Movie' } }];
      jest.spyOn(swapiApi, 'getSwapiResults').mockResolvedValue(mockMovies);

      const result = await service.getMoviesByCharacterId('1');
      expect(result).toHaveLength(1);
      expect(result[0].properties.title).toBe('Test Movie');
    });
  });

  describe('getPerson', () => {
    it('should return a person by ID', async () => {
      const mockPerson = { properties: { name: 'Luke Skywalker' } };
      jest.spyOn(swapiApi, 'getSwapiResults').mockResolvedValue(mockPerson);

      const result = await service.getPerson('1');
      expect(result.properties.name).toBe('Luke Skywalker');
    });
  });
});
