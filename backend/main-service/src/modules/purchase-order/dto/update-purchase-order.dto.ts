import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
import { UpdatePurchaseOrderItemDto } from './purchase-order-item.dto';

export class UpdatePurchaseOrderDto extends PartialType(
  OmitType(CreatePurchaseOrderDto, ['items'] as const),
) {
  @ApiPropertyOptional({
    type: () => [UpdatePurchaseOrderItemDto],
    description:
      'Optional. If provided, the whole items list is replaced atomically. ' +
      'Items containing `id` are updated, those without are inserted, ' +
      'existing items not present in the array are deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseOrderItemDto)
  items?: UpdatePurchaseOrderItemDto[];

  updated_by?: string | null;
}
