import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class GetCourseFilterDto extends PageOptionsDto {
  branchIds: string | string[];

  isZoneOnly: string;

  @ApiPropertyOptional()
  department_id?: number;

  @ApiPropertyOptional()
  subdepartment_id?: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional()
  status?: boolean;

  @ApiPropertyOptional({
    type: [Number],
  })
  branch_ids: number[];

  @ApiPropertyOptional({ default: false })
  noLimit?: boolean;
}
