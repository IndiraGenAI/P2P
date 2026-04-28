import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreatePurchaseRequestDto } from './create-purchase-request.dto';
import { UpdatePurchaseRequestItemDto } from './purchase-request-item.dto';

export class UpdatePurchaseRequestDto extends PartialType(
  OmitType(CreatePurchaseRequestDto, ['items'] as const),
) {
  @ApiPropertyOptional({
    type: () => [UpdatePurchaseRequestItemDto],
    description:
      'Optional. If provided, the whole items list is replaced atomically. ' +
      'Items containing `id` are updated, those without are inserted, ' +
      'existing items not present in the array are deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePurchaseRequestItemDto)
  items?: UpdatePurchaseRequestItemDto[];

  updated_by?: string | null;
}
