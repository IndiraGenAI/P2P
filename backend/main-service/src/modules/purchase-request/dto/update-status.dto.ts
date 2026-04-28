import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export const PR_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'CLOSED',
] as const;

export type PrStatus = (typeof PR_STATUSES)[number];

export class UpdatePurchaseRequestStatusDto {
  @ApiProperty({ enum: PR_STATUSES, example: 'SUBMITTED' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @IsIn(PR_STATUSES as unknown as string[])
  status: PrStatus;

  updated_by?: string | null;
}
