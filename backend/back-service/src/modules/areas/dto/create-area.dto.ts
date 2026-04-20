import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

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

export class CreateAreaDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  city_id: number;

  country_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  state_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @MaxLength(6)
  pincode: string;

  created_by?: string | null;
}
