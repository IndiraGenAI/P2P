import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IGrnApprovalDecisionPayload,
  IGrnApprovalStepRow,
  IGrnDetail,
  IGrnListResult,
  IGrnPayload,
  IGrnRow,
  IGrnStatusCounts,
  GrnStatus,
} from './grn.model';

const ENDPOINT = config.baseApiMain + '/grn';

const grnService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IGrnListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then(
      (res) => res.data,
    ),

  getStatusCounts: (params?: {
    source?: 'po' | 'contract';
  }): Promise<IApiResponse<IGrnStatusCounts>> =>
    mainRequest({
      url: `${ENDPOINT}/status-counts`,
      method: 'GET',
      params: params ?? {},
    }).then((res) => res.data),

  getById: (id: number): Promise<IApiResponse<IGrnDetail>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'GET' }).then(
      (res) => res.data,
    ),

  getApprovalTrail: (
    id: number,
  ): Promise<
    IApiResponse<{
      id: number;
      status: string;
      approval_steps: IGrnApprovalStepRow[];
    }>
  > =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-trail`,
      method: 'GET',
    }).then((res) => res.data),

  approvalDecision: (
    id: number,
    data: IGrnApprovalDecisionPayload,
  ): Promise<IApiResponse<IGrnDetail>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-decision`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  create: (
    data: IGrnPayload,
  ): Promise<IApiResponse<IGrnRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then(
      (res) => res.data,
    ),

  edit: (
    id: number,
    data: Partial<IGrnPayload>,
  ): Promise<IApiResponse<IGrnRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'PUT', data }).then(
      (res) => res.data,
    ),

  remove: (id: number): Promise<IApiResponse<unknown>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
      (res) => res.data,
    ),

  updateStatus: (
    id: number,
    status: GrnStatus | string,
  ): Promise<IApiResponse<IGrnRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then((res) => res.data),
};

export default grnService;
