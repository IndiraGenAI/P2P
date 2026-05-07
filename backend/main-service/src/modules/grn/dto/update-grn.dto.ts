import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateGrnDto } from './create-grn.dto';
import { UpdateGrnItemDto } from './grn-item.dto';

export class UpdateGrnDto extends PartialType(
  OmitType(CreateGrnDto, ['items'] as const),
) {
  @ApiPropertyOptional({
    type: () => [UpdateGrnItemDto],
    description:
      'If provided, line items are upserted by id; omitted ids are inserted; missing rows are deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGrnItemDto)
  items?: UpdateGrnItemDto[];

  updated_by?: string | null;
}
