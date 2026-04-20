import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateBranchDepartmentDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  branch_id: number;

  created_by?: string | null;
}
export class CreateDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  code: string;

  created_by?: string | null;

  @ApiProperty({ type: [CreateBranchDepartmentDto] })
  @Type(() => CreateBranchDepartmentDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  branch_departments: CreateBranchDepartmentDto[];
}
