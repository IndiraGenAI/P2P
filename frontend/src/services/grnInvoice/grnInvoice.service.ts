import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IGrnInvoiceApprovalDecisionPayload,
  IGrnInvoiceApprovalStepRow,
  IGrnInvoiceDetail,
  IGrnInvoiceListResult,
  IGrnInvoicePayload,
  IGrnInvoiceRow,
  IGrnInvoiceStatusCounts,
  GrnInvoiceDocStatus,
} from './grnInvoice.model';

const ENDPOINT = config.baseApiMain + '/grn-invoice';

const grnInvoiceService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IGrnInvoiceListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then(
      (res) => res.data,
    ),

  getStatusCounts: (): Promise<IApiResponse<IGrnInvoiceStatusCounts>> =>
    mainRequest({ url: `${ENDPOINT}/status-counts`, method: 'GET' }).then(
      (res) => res.data,
    ),

  getById: (id: number): Promise<IApiResponse<IGrnInvoiceDetail>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'GET' }).then(
      (res) => res.data,
    ),

  getApprovalTrail: (
    id: number,
  ): Promise<
    IApiResponse<{
      id: number;
      status: string;
      approval_steps: IGrnInvoiceApprovalStepRow[];
    }>
  > =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-trail`,
      method: 'GET',
    }).then((res) => res.data),

  approvalDecision: (
    id: number,
    data: IGrnInvoiceApprovalDecisionPayload,
  ): Promise<IApiResponse<IGrnInvoiceDetail>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-decision`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  create: (
    data: IGrnInvoicePayload,
  ): Promise<IApiResponse<IGrnInvoiceRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then(
      (res) => res.data,
    ),

  edit: (
    id: number,
    data: Partial<IGrnInvoicePayload>,
  ): Promise<IApiResponse<IGrnInvoiceRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'PUT', data }).then(
      (res) => res.data,
    ),

  remove: (id: number): Promise<IApiResponse<unknown>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
      (res) => res.data,
    ),

  updateStatus: (
    id: number,
    status: GrnInvoiceDocStatus | string,
  ): Promise<IApiResponse<IGrnInvoiceRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then((res) => res.data),
};

export default grnInvoiceService;
