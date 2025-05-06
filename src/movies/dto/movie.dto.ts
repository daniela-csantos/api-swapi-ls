import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsArray, IsUrl } from 'class-validator';

@Exclude()
class MoviePropertiesDto {
    
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    opening_crawl: string;

    @Expose()
    @IsArray()
    @IsUrl({}, { each: true })
    characters: string[];
}

@Exclude()
export class MovieDto {
    @Expose()
    @IsString()
    uid: string;

    @Expose()
    @Type(() => MoviePropertiesDto)
    properties: MoviePropertiesDto;
}
