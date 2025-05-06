import { Exclude, Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
class PeoplePropertiesDto {

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  gender: string;

  @Expose()
  @IsString()
  skin_color: string;

  @Expose()
  @IsString()
  hair_color: string;

  @Expose()
  @IsString()
  height: string;

  @Expose()
  @IsString()
  eye_color: string;

  @Expose()
  @IsString()
  mass: string;

  @Expose()
  @IsString()
  birth_year: string;
}

@Exclude()
export class PeopleDto {

  @Expose()
  @IsString()
  uid: string;

  @Expose()
  @Type(() => PeoplePropertiesDto)
  properties: PeoplePropertiesDto;
}
