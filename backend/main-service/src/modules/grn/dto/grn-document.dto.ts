import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateGrnDocumentDto {
  @ApiProperty({ example: 'contract.pdf' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name: string;

  @ApiProperty({ example: 'https://.../contract.pdf' })
  @IsNotEmpty()
  @IsString()
  file_path: string;

  @ApiPropertyOptional({ example: 'application/pdf' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  file_type?: string | null;

  @ApiPropertyOptional({ example: 12345 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  file_size?: number | null;
}

export class UpdateGrnDocumentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  file_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  file_type?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  file_size?: number | null;
}
