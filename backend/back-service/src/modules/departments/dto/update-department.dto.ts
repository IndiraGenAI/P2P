import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateBranchDepartmentDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;

  updated_by?: string | null;
}
export class UpdateDepartmentDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  code: string;

  updated_by?: string | null;

  @ApiProperty({ type: [UpdateBranchDepartmentDto] })
  @Type(() => UpdateBranchDepartmentDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  branch_departments: UpdateBranchDepartmentDto[];
}
