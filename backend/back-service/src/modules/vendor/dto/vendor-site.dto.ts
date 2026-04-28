import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PageOptionsDto } from 'src/general-dto/page-option.dto';

export class CreateVendorSiteDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendor_id: number;

  @ApiProperty({ example: 'SITE-MUM-01' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  site_code: string;

  @ApiPropertyOptional({ example: 'Mumbai HQ' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  site_name?: string | null;

  @ApiPropertyOptional({ example: '123 MG Road, Mumbai' })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contact_person?: string | null;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_phone?: string | null;

  @ApiPropertyOptional({ example: 'jane@acme.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  contact_email?: string | null;

  @ApiPropertyOptional({ example: 'Acme Mumbai' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  supplier_site_name?: string | null;

  @ApiPropertyOptional({ example: 'Acme HQ' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  oracle_address_name?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  created_by?: string | null;
}

export class UpdateVendorSiteDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendor_id?: number;

  @ApiPropertyOptional({ example: 'SITE-MUM-01' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  site_code?: string;

  @ApiPropertyOptional({ example: 'Mumbai HQ' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  site_name?: string | null;

  @ApiPropertyOptional({ example: '123 MG Road, Mumbai' })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contact_person?: string | null;

  @ApiPropertyOptional({ example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_phone?: string | null;

  @ApiPropertyOptional({ example: 'jane@acme.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  contact_email?: string | null;

  @ApiPropertyOptional({ example: 'Acme Mumbai' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  supplier_site_name?: string | null;

  @ApiPropertyOptional({ example: 'Acme HQ' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  oracle_address_name?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  updated_by?: string | null;
}

export class UpdateVendorSiteStatusDto {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  updated_by?: string | null;
}

export class GetVendorSiteFilterDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  vendor_id?: number;

  @ApiPropertyOptional({ default: undefined })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    return String(value).toLowerCase() === 'true';
  })
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsBoolean()
  noLimit?: boolean;
}
