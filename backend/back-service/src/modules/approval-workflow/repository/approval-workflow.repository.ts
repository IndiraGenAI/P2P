import { dataSource } from '@core/data-source';
import { ApprovalWorkflow } from 'erp-db';

export const approvalWorkflowRepository = dataSource
  .getRepository(ApprovalWorkflow)
  .extend({});
