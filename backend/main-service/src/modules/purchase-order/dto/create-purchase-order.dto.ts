import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreatePurchaseOrderItemDto } from './purchase-order-item.dto';

export class CreatePurchaseOrderDto {
  @ApiPropertyOptional({
    example: 'PO-0001',
    description: 'Auto-generated when omitted',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  po_number?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entity_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendor_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vendor_site_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  item_type_id?: number | null;

  @ApiPropertyOptional({ example: '2026-04-01' })
  @IsOptional()
  @IsDateString()
  validity_from?: string | null;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  validity_to?: string | null;

  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsOptional()
  @IsDateString()
  required_date?: string | null;

  @ApiPropertyOptional({ example: 'MONTHLY' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  frequency?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  department_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  subdepartment_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  payment_term_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  terms_conditions?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  center_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overall_summary?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  shipping_vendor_site_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  billing_vendor_site_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shipping_address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  billing_address?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  currency_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  terms_condition_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total_base_amount?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oracle_invoice_group?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oracle_invoice_source?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  oracle_invoice_type?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  unbudgeted_expense?: boolean | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  unbudgeted_justification?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  advance_po?: boolean | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  advance_percentage?: number | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'If omitted, computed from sum of items.amount',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  net_amount?: number;

  @ApiPropertyOptional({
    example: 'SUBMITTED',
    description: 'Defaults to SUBMITTED (pending) when omitted',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiProperty({
    type: () => [CreatePurchaseOrderItemDto],
    description: 'PR line items (at least one required)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseOrderItemDto)
  @IsNotEmpty()
  items: CreatePurchaseOrderItemDto[];

  created_by?: string | null;
}
