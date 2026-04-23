import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateCoaDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  coa_category_id?: number;

  @ApiPropertyOptional({ example: 'GL-1001' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  gl_code?: string;

  @ApiPropertyOptional({ example: 'Cash in Hand' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  gl_name?: string;

  @ApiPropertyOptional({ example: '01-100-200-3000' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  distribution_combination?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  updated_by?: string | null;
}
