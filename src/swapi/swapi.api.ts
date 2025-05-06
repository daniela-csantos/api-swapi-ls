import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';

@Injectable()
export class SwapiApi {
  private readonly baseUrl: string;

  constructor(
    private http: HttpService,
    private configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('SWAPI_BASE_URL') || '';
  }

  async getSwapiResults(path) {
    return this.handleSwapiErrors(`${this.baseUrl}${path}`);
  }

  async getPeopleByCharactersUrls(peopleUrls) {
    const peopleRequests = peopleUrls.map(url => this.handleSwapiErrors(url));
    return await Promise.all(peopleRequests);
  }

  async handleSwapiErrors(path) {
    try {
      Logger.log(`Calling SWAPI GET ${path}...`)
      const response = await firstValueFrom(
        this.http.get(`${path}`)
      );
      if (!response.data?.result) {
        throw new NotFoundException('Unable to retrieve data');
      }
      Logger.log(`Calling SWAPI GET | Data successfully retrieved`)

      return response.data.result || response.data.results;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        const status = axiosError.response.status;
        const responseData = axiosError.response.data as { message?: string };
        const message = responseData?.message ? `SWAPI message: ${responseData?.message}` : 'Error on SWAPI';

        if (status > 500)
          throw new HttpException('SWAPI is unavailable', HttpStatus.BAD_GATEWAY);

        switch (status) {
          case 404:
            throw new NotFoundException(message);
          default:
            throw new HttpException(message, status);
        }
      }

      throw new InternalServerErrorException('Error on SWAPI: Internal server error from SW API');
    }
  }

}
