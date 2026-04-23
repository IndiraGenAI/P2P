import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class CreateCoaDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  coa_category_id: number;

  @ApiProperty({ example: 'GL-1001' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  gl_code: string;

  @ApiProperty({ example: 'Cash in Hand' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  gl_name: string;

  @ApiProperty({ example: '01-100-200-3000' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  distribution_combination: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  created_by?: string | null;
}
