import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class GetPackageFilterDto extends PageOptionsDto {
  branchIds: string[] | string;

  @ApiPropertyOptional({
    type: [Number],
  })
  branch_ids: number[];

  @ApiPropertyOptional()
  department_id: number;

  @ApiPropertyOptional()
  subdepartment_id: number;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  code?: string;

  @ApiPropertyOptional()
  is_job_guarantee: boolean;

  @ApiPropertyOptional()
  total: number;

  @ApiPropertyOptional()
  duration: number;

  @ApiPropertyOptional()
  installment: number;

  @ApiPropertyOptional()
  status?: boolean;

  @ApiPropertyOptional({ default: false })
  noLimit?: boolean;

  @ApiPropertyOptional()
  isZoneOnly: boolean;
}
