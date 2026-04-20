import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class GetAreasFilterDto extends PageOptionsDto {
  @ApiPropertyOptional()
  state_id?: number;

  @ApiPropertyOptional()
  city_id?: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  pincode?: number;

  @ApiPropertyOptional()
  status?: number;

  @ApiPropertyOptional()
  noLimit?: boolean;
}
