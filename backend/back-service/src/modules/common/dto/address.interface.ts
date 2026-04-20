import { ApiPropertyOptional } from '@nestjs/swagger';
import { Area, City, Country, State } from 'erp-db';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class AddressResponse {
  data: Country[] | State[] | City[] | Area[];
}

export class AddressPinCode extends PageOptionsDto {
  @ApiPropertyOptional()
  pincode: string;

  @ApiPropertyOptional()
  area_name: string;

  @ApiPropertyOptional()
  city_name: string;

  @ApiPropertyOptional()
  state_name: string;

  @ApiPropertyOptional()
  country_name: string;

  @ApiPropertyOptional({ default: false })
  noLimit?: boolean;
}

export class AddArea {
  @ApiPropertyOptional()
  country_id: number;

  @ApiPropertyOptional()
  state_id: number;

  @ApiPropertyOptional()
  city_id: number;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  pincode: string;

  @ApiPropertyOptional()
  status: boolean;

  created_by?: string | null;
}
