import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateBranchCourseDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;
}
export class CreateCourseDto {
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

  created_by?: string | null;

  @ApiProperty({ type: [CreateBranchCourseDto] })
  @Type(() => CreateBranchCourseDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  branch_courses: CreateBranchCourseDto[];
}
