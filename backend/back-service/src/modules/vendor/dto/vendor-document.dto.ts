import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVendorDocumentDto {
  @ApiProperty({ example: 'pan-card.pdf' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name: string;

  @ApiProperty({ example: 'https://s3.amazonaws.com/.../pan-card.pdf' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  file_url: string;

  @ApiPropertyOptional({ example: 12345 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  file_size?: number | null;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mime_type?: string | null;

  @ApiPropertyOptional({ example: 'PAN proof' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateVendorDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  file_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  file_size?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mime_type?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateVendorDocumentStatusDto {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
