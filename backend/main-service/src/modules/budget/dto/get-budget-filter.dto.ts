import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';

export class GetBudgetFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Search COA gl_code / gl_name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  financial_year?: string;

  @ApiPropertyOptional({ enum: ['OPEX', 'CAPEX'] })
  @IsOptional()
  @IsString()
  budget_type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  department_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entity_id?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsBoolean()
  noLimit?: boolean;
}
