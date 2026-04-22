import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleType } from 'erp-db';

export class CreateRoleDto {
  @ApiProperty({ example: 'Finance Manager' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Approves invoices and budgets' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: RoleType, example: RoleType.MANAGER })
  @IsOptional()
  @IsEnum(RoleType)
  type?: RoleType;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  created_by?: string | null;
}
