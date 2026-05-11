import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({ example: '2025-26' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  financial_year!: string;

  @ApiProperty({ enum: ['OPEX', 'CAPEX'] })
  @IsString()
  @IsIn(['OPEX', 'CAPEX'])
  budget_type!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  coa_id!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  department_id!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  subdepartment_id!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  entity_id!: number;

  @ApiProperty({ description: 'Location / Center (master)' })
  @Type(() => Number)
  @IsInt()
  center_id!: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  cost_center_id!: number;

  @ApiProperty({ example: 100000.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ enum: ['HARD_STOP', 'SOFT_WARNING', 'NONE'] })
  @IsString()
  @IsIn(['HARD_STOP', 'SOFT_WARNING', 'NONE'])
  control_type!: string;
}
