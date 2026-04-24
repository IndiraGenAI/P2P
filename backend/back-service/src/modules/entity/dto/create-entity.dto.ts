import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEntityDto {
  @ApiProperty({ example: 'ENT-001' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Acme Corporation' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

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

  created_by?: string | null;
}
