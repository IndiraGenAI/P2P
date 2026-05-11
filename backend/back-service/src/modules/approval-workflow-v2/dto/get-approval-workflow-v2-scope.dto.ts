import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ApprovalWorkflowV2Scope } from 'erp-db';

export class GetApprovalWorkflowV2ScopeDto {
  @ApiProperty({
    enum: ApprovalWorkflowV2Scope,
    example: ApprovalWorkflowV2Scope.ITEM,
  })
  @IsEnum(ApprovalWorkflowV2Scope)
  scope: ApprovalWorkflowV2Scope;
}
