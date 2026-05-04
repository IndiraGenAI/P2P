import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  ApprovalWorkflowStepRole,
  ApprovalWorkflowTransactionType,
} from 'erp-db';

export class SaveApprovalWorkflowStepDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty({ enum: ApprovalWorkflowStepRole })
  @IsEnum(ApprovalWorkflowStepRole)
  role: ApprovalWorkflowStepRole;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  user_ids: number[];
}

export class SaveApprovalWorkflowLimitDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  min: number;

  @ApiPropertyOptional({ nullable: true, description: 'Null = no upper limit' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  max?: number | null;

  @ApiProperty({ type: [SaveApprovalWorkflowStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaveApprovalWorkflowStepDto)
  steps: SaveApprovalWorkflowStepDto[];
}

export class SaveApprovalWorkflowDto {
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

  @ApiPropertyOptional({ description: 'Omit for all centers' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  center_id?: number;

  @ApiProperty({ type: [SaveApprovalWorkflowLimitDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaveApprovalWorkflowLimitDto)
  limits: SaveApprovalWorkflowLimitDto[];
}
