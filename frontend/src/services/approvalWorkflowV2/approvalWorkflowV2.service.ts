import config from '@/utils/config';
import request from '@/axios/request';
import type { IApiResponse } from '@/utils/models/common';
import type { ApprovalWorkflowV2Scope } from '@/common/enums';
import type {
  IApprovalWorkflowV2Details,
  ISaveApprovalWorkflowV2Payload,
} from './approvalWorkflowV2.model';

class ApprovalWorkflowV2Service {
  ENDPOINT = `${config.baseApiMasters}/approval-workflow-v2`;

  public getByScope = async (
    scope: ApprovalWorkflowV2Scope,
  ): Promise<IApiResponse<IApprovalWorkflowV2Details | null>> => {
    return request({
      url: this.ENDPOINT,
      method: 'GET',
      params: { scope },
    }).then((res) => res.data);
  };

  public save = async (
    data: ISaveApprovalWorkflowV2Payload,
  ): Promise<IApiResponse<IApprovalWorkflowV2Details>> => {
    return request({
      url: this.ENDPOINT,
      method: 'POST',
      data,
    }).then((res) => res.data);
  };
}

export default new ApprovalWorkflowV2Service();
