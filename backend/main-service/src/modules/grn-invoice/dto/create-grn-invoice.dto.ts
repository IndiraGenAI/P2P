import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
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
import { CreateGrnInvoiceItemDto } from './grn-invoice-item.dto';

export class CreateGrnInvoiceDto {
  @ApiProperty({
    description: 'Approved source GRN this invoice is raised against',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  grn_id: number;

  @ApiPropertyOptional({
    example: 'INV-0001',
    description: 'Auto-generated when omitted',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  grn_invoice_number?: string | null;

  @ApiPropertyOptional({
    description: 'Optional override; defaults from source GRN',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rate_contract_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  invoice_no?: string | null;

  @ApiPropertyOptional({ example: '2026-05-15' })
  @IsOptional()
  @IsDateString()
  invoice_date?: string | null;

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
  shipping_vendor_site_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  billing_vendor_site_id?: number | null;

  @ApiPropertyOptional({
    description:
      'Shipping address text from the selected entity (entities.shipping_addresses). When set, shipping_vendor_site_id is cleared.',
  })
  @IsOptional()
  @IsString()
  shipping_address?: string | null;

  @ApiPropertyOptional({
    description:
      'Billing address text from the selected entity (entities.billing_addresses). When set, billing_vendor_site_id is cleared.',
  })
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
  @Type(() => Number)
  @IsInt()
  @Min(1)
  terms_condition_id?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  overall_summary?: string | null;

  @ApiPropertyOptional({
    example: 0,
    description: 'If omitted, computed from line items',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  net_amount?: number;

  @ApiPropertyOptional({
    example: 'SUBMITTED',
    description: 'Defaults to SUBMITTED when omitted',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiProperty({
    type: () => [CreateGrnInvoiceItemDto],
    description: 'Contract lines (at least one required)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateGrnInvoiceItemDto)
  @IsNotEmpty()
  items: CreateGrnInvoiceItemDto[];

  created_by?: string | null;
}
