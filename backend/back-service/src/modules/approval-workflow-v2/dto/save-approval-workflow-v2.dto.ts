import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApprovalWorkflowStepRole, ApprovalWorkflowV2Scope } from 'erp-db';

export class SaveApprovalWorkflowV2StepDto {
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

export class SaveApprovalWorkflowV2Dto {
  @ApiProperty({
    enum: ApprovalWorkflowV2Scope,
    example: ApprovalWorkflowV2Scope.ITEM,
  })
  @IsEnum(ApprovalWorkflowV2Scope)
  scope: ApprovalWorkflowV2Scope;

  @ApiProperty({ type: [SaveApprovalWorkflowV2StepDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaveApprovalWorkflowV2StepDto)
  steps: SaveApprovalWorkflowV2StepDto[];
}
