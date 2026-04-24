import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEntityDto {
  @ApiPropertyOptional({ example: 'ENT-001' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name?: string;

  @ApiPropertyOptional({ example: 'Finance BU' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  business_unit?: string | null;

  @ApiPropertyOptional({ example: 'Acme Corporation Pvt Ltd' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  legal_entity?: string | null;

  @ApiPropertyOptional({ example: '01-2000-0000-000-000' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  liability_distribution?: string | null;

  @ApiPropertyOptional({ example: '01-1500-0000-000-000' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  prepayment_distribution?: string | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  shipping_addresses?: string[] | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  billing_addresses?: string[] | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  updated_by?: string | null;
}
