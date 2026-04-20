import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class GetDepartmentFilterDto extends PageOptionsDto {
  isZoneOnly: string;

  branchIds: string[] | string;

  @ApiPropertyOptional()
  status?: boolean;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional({
    type: [Number],
  })
  branch_ids: number[];

  @ApiPropertyOptional({ default: false })
  noLimit?: boolean;
}
