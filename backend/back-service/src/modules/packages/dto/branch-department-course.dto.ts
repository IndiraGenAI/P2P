import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BranchCourse, BranchDepartments } from 'erp-db';
import { PageOptionsDto } from 'src/general-dto/-option.dto';

export class GetMultipleBranchWiseCommonCourse {
  @ApiProperty({ type: [Number] })
  branch_ids: number[];
}
export class GetMultipleBranchAndCommonDepartmentWiseCourse {
  @ApiProperty({ type: [Number] })
  branch_ids: number[];

  @ApiPropertyOptional()
  department_id: number;
}

export class BranchDepartmentCourseResponse {
  rows: BranchDepartments[];
  count: number;
}

export class BranchCourseResponse {
  rows: BranchCourse[];
  count: number;
}
