import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdatePackageConfiguratinDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  ptm_day: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  ptm_grace_after: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  ptm_grace_before: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  cv_day: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  cv_grace_after: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  cv_grace_before: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  es_day: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  es_grace_after: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(0)
  @Max(999)
  es_grace_before: number;

  updated_by?: string | null;
}

export class UpdatePackageFeeDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  fee_type_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  created_by?: string | null;

  updated_by?: string | null;
}

export class UpdatePackageSubCourseDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  subcourse_id: number;

  created_by?: string | null;

  updated_by?: string | null;
}

export class UpdatePackageBranchesDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;

  updated_by?: string | null;
}
export class UpdatePackageDto {
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

  @ApiPropertyOptional()
  @IsBoolean()
  is_job_guarantee: boolean;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(1)
  total: number;

  @ApiPropertyOptional()
  @Max(999.99)
  @IsNotEmpty()
  @Min(1)
  duration: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(1)
  installment: number;

  updated_by?: string | null;

  @ApiProperty({ type: [UpdatePackageFeeDto] })
  @Type(() => UpdatePackageFeeDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_fees: UpdatePackageFeeDto[];

  @ApiProperty({ type: [UpdatePackageSubCourseDto] })
  @Type(() => UpdatePackageSubCourseDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_subcourses: UpdatePackageSubCourseDto[];

  @ApiProperty({ type: [UpdatePackageBranchesDto] })
  @Type(() => UpdatePackageBranchesDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_branches: UpdatePackageBranchesDto[];

  @ApiProperty({ type: UpdatePackageConfiguratinDto })
  @Type(() => UpdatePackageConfiguratinDto)
  @ValidateNested({ each: true })
  courseConfig: UpdatePackageConfiguratinDto;
}
