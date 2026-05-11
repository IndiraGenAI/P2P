import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';

export class GetGrnFilterDto extends PageOptionsDto {
  @ApiPropertyOptional({
    enum: ['po', 'contract'],
    description:
      'Restrict rows: `po` = GRNs linked to a purchase order; `contract` = linked to a rate contract.',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value == null || value === undefined) return undefined;
    const s = String(value).toLowerCase();
    return s === 'po' || s === 'contract' ? s : value;
  })
  @IsString()
  @IsIn(['po', 'contract'])
  source?: 'po' | 'contract';

  @ApiPropertyOptional({ description: 'Search in grn_number / vendor name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vendor_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entity_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  department_id?: number;

  @ApiPropertyOptional({ example: '2026-04-01' })
  @IsOptional()
  @IsDateString()
  from_date?: string;

  @ApiPropertyOptional({ example: '2026-04-30' })
  @IsOptional()
  @IsDateString()
  to_date?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsBoolean()
  noLimit?: boolean;
}
