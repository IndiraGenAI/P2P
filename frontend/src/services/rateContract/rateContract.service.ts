import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IRateContractApprovalDecisionPayload,
  IRateContractApprovalStepRow,
  IRateContractDetail,
  IRateContractListResult,
  IRateContractPayload,
  IRateContractRow,
  IRateContractStatusCounts,
  RateContractStatus,
} from './rateContract.model';

const ENDPOINT = config.baseApiMain + '/rate-contract';

const rateContractService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IRateContractListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then(
      (res) => res.data,
    ),

  getStatusCounts: (): Promise<IApiResponse<IRateContractStatusCounts>> =>
    mainRequest({ url: `${ENDPOINT}/status-counts`, method: 'GET' }).then(
      (res) => res.data,
    ),

  getById: (id: number): Promise<IApiResponse<IRateContractDetail>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'GET' }).then(
      (res) => res.data,
    ),

  getApprovalTrail: (
    id: number,
  ): Promise<
    IApiResponse<{
      id: number;
      status: string;
      approval_steps: IRateContractApprovalStepRow[];
    }>
  > =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-trail`,
      method: 'GET',
    }).then((res) => res.data),

  approvalDecision: (
    id: number,
    data: IRateContractApprovalDecisionPayload,
  ): Promise<IApiResponse<IRateContractDetail>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-decision`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  create: (
    data: IRateContractPayload,
  ): Promise<IApiResponse<IRateContractRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then(
      (res) => res.data,
    ),

  edit: (
    id: number,
    data: Partial<IRateContractPayload>,
  ): Promise<IApiResponse<IRateContractRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'PUT', data }).then(
      (res) => res.data,
    ),

  remove: (id: number): Promise<IApiResponse<unknown>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
      (res) => res.data,
    ),

  updateStatus: (
    id: number,
    status: RateContractStatus | string,
  ): Promise<IApiResponse<IRateContractRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then((res) => res.data),
};

export default rateContractService;
