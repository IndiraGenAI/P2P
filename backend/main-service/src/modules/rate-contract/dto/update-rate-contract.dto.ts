import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateRateContractDto } from './create-rate-contract.dto';
import { UpdateRateContractItemDto } from './rate-contract-item.dto';

export class UpdateRateContractDto extends PartialType(
  OmitType(CreateRateContractDto, ['items'] as const),
) {
  @ApiPropertyOptional({
    type: () => [UpdateRateContractItemDto],
    description:
      'If provided, line items are upserted by id; omitted ids are inserted; missing rows are deleted.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRateContractItemDto)
  items?: UpdateRateContractItemDto[];

  updated_by?: string | null;
}
