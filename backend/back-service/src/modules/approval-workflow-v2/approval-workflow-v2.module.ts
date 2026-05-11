import { Module } from '@nestjs/common';
import { ApprovalWorkflowV2Controller } from './approval-workflow-v2.controller';
import { ApprovalWorkflowV2Service } from './approval-workflow-v2.service';

@Module({
  controllers: [ApprovalWorkflowV2Controller],
  providers: [ApprovalWorkflowV2Service],
  exports: [ApprovalWorkflowV2Service],
})
export class ApprovalWorkflowV2Module {}
