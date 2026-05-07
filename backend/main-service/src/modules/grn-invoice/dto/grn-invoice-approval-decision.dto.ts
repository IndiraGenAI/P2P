import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PurchaseRequestApprovalDecision } from 'src/commons/enum';

/** Same decision payload as purchase request (`APPROVE` / `REJECT`). */
export class GrnInvoiceApprovalDecisionDto {
  @ApiProperty({ enum: PurchaseRequestApprovalDecision })
  @IsEnum(PurchaseRequestApprovalDecision)
  decision!: PurchaseRequestApprovalDecision;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string | null;
}
