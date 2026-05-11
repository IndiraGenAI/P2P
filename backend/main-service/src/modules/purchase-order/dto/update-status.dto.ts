import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { PrStatus } from 'src/commons/enum';

export class UpdatePurchaseOrderStatusDto {
  @ApiProperty({ enum: PrStatus, example: PrStatus.SUBMITTED })
  @IsNotEmpty()
  @MaxLength(50)
  @IsEnum(PrStatus)
  status: PrStatus;

  updated_by?: string | null;
}
