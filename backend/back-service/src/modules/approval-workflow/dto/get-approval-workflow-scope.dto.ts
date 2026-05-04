import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { ApprovalWorkflowTransactionType } from 'erp-db';

export class GetApprovalWorkflowScopeDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entity_id: number;

  @ApiProperty({
    enum: ApprovalWorkflowTransactionType,
    example: ApprovalWorkflowTransactionType.PURCHASE_REQUEST,
  })
  @IsEnum(ApprovalWorkflowTransactionType)
  transaction_type: ApprovalWorkflowTransactionType;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  subdepartment_id: number;

  /** Omit or empty for “all centers” (center_id null on the row). */
  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  center_id?: number;
}
