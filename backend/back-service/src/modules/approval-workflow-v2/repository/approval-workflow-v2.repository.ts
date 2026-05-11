import { dataSource } from '@core/data-source';
import { ApprovalWorkflowV2 } from 'erp-db';

export const approvalWorkflowV2Repository = dataSource
  .getRepository(ApprovalWorkflowV2)
  .extend({});
