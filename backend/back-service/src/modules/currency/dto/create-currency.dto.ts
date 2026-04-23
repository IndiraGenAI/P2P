import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'INR' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  code: string;

  @ApiProperty({ example: 'Indian Rupee' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: '₹' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  symbol?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  created_by?: string | null;
}
