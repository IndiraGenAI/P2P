import config from '@/utils/config';
import request from '@/axios/request';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IApprovalWorkflowDetails,
  ISaveApprovalWorkflowPayload,
} from './approvalWorkflow.model';
import type { ApprovalWorkflowTransactionType } from '@/common/enums';

export interface IApprovalWorkflowScopeQuery {
  entity_id: number;
  transaction_type: ApprovalWorkflowTransactionType;
  subdepartment_id: number;
  center_id?: number;
}

class ApprovalWorkflowService {
  ENDPOINT = `${config.baseApiMasters}/approval-workflow`;

  public getByScope = async (
    params: IApprovalWorkflowScopeQuery,
  ): Promise<IApiResponse<IApprovalWorkflowDetails | null>> => {
    const url = this.ENDPOINT;
    return request({ url, method: 'GET', params }).then((res) => res.data);
  };

  public save = async (
    data: ISaveApprovalWorkflowPayload,
  ): Promise<IApiResponse<IApprovalWorkflowDetails>> => {
    const url = this.ENDPOINT;
    return request({ url, method: 'POST', data }).then((res) => res.data);
  };
}

export default new ApprovalWorkflowService();
