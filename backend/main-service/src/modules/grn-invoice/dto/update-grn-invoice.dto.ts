import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateGrnInvoiceDto } from './create-grn-invoice.dto';
import { UpdateGrnInvoiceItemDto } from './grn-invoice-item.dto';

export class UpdateGrnInvoiceDto extends PartialType(
  OmitType(CreateGrnInvoiceDto, ['items'] as const),
) {
  @ApiPropertyOptional({
    type: () => [UpdateGrnInvoiceItemDto],
    description:
      'If provided, line items are upserted by id; omitted ids are inserted; missing rows are deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGrnInvoiceItemDto)
  items?: UpdateGrnInvoiceItemDto[];

  updated_by?: string | null;
}
