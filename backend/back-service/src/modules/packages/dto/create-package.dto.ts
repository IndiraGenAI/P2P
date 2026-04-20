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

export class CraeetPackageConfiguratinDto {
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

  created_by?: string | null;
}

export class CreatePackageFeeDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  fee_type_id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @Min(1)
  amount: number;

  created_by?: string | null;
}

export class CreatePackageSubCourseDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  subcourse_id: number;

  created_by?: string | null;
}

export class CreatePackageBranchesDtoDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;
}
export class CreatePackageDto {
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
  @IsNotEmpty()
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

  created_by?: string | null;

  @ApiProperty({ type: [CreatePackageFeeDto] })
  @Type(() => CreatePackageFeeDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_fees: CreatePackageFeeDto[];

  @ApiProperty({ type: [CreatePackageSubCourseDto] })
  @Type(() => CreatePackageSubCourseDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_subcourses: CreatePackageSubCourseDto[];

  @ApiProperty({ type: [CreatePackageBranchesDtoDto] })
  @Type(() => CreatePackageBranchesDtoDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  package_branches: CreatePackageBranchesDtoDto[];

  @ApiProperty({ type: CraeetPackageConfiguratinDto })
  @Type(() => CraeetPackageConfiguratinDto)
  @ValidateNested({ each: true })
  courseConfig: CraeetPackageConfiguratinDto;
}
