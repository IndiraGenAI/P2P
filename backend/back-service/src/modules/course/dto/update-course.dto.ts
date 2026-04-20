import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateBranchCourseDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;

  updated_by?: string | null;
}
export class UpdateCourseDto {
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  department_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  subdepartment_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @MinLength(3)
  code: string;

  updated_by?: string | null;

  @ApiProperty({ type: [UpdateBranchCourseDto] })
  @Type(() => UpdateBranchCourseDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  branch_courses: UpdateBranchCourseDto[];
}
