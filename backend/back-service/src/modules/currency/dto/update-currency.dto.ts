import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCurrencyDto {
  @ApiPropertyOptional({ example: 'INR' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional({ example: 'Indian Rupee' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ example: '₹' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  symbol?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  updated_by?: string | null;
}
