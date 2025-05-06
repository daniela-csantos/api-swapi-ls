import { Test, TestingModule } from '@nestjs/testing';
import { SwapiApi } from './swapi.api';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { HttpException, NotFoundException } from '@nestjs/common';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AppModule } from '../app.module';

describe('SwapiApi', () => {
  let service: SwapiApi;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        SwapiApi,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SwapiApi>(SwapiApi);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleSwapiErrors', () => {
    it('should return data from the SWAPI successfully', async () => {
      const mockResponse: AxiosResponse = {
        data: { result: 'test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: {},
          method: 'GET',
        } as InternalAxiosRequestConfig,
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      const result = await service['handleSwapiErrors']('/films/1');
      expect(result).toEqual('test');
    });

    it('should throw HttpException if SWAPI response is missing result', async () => {
      const mockResponse: AxiosResponse = {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: {},
          method: 'GET',
        } as InternalAxiosRequestConfig,
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

      await expect(service['handleSwapiErrors']('/films/1')).rejects.toThrow(HttpException);
    });

    it('should throw HttpException if an error occurs in the request', async () => {
      jest.spyOn(httpService, 'get').mockReturnValue(throwError(() => new Error('Test Error')));

      await expect(service['handleSwapiErrors']('/films/1')).rejects.toThrow(HttpException);
    });
  });
});
