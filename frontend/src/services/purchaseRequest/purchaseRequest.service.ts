import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IPurchaseRequestApprovalDecisionPayload,
  IPurchaseRequestApprovalStepRow,
  IPurchaseRequestDocumentRow,
  IPurchaseRequestItemPayload,
  IPurchaseRequestItemRow,
  IPurchaseRequestListResult,
  IPurchaseRequestPayload,
  IPurchaseRequestRow,
  IPurchaseRequestStatusCounts,
  PurchaseRequestStatus,
} from './purchaseRequest.model';

const ENDPOINT = config.baseApiMain + '/purchase-request';

const purchaseRequestService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IPurchaseRequestListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then(
      (res) => res.data,
    ),

  getById: (id: number): Promise<IApiResponse<IPurchaseRequestRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'GET' }).then(
      (res) => res.data,
    ),

  /** Selected fields only: `id`, `status`, `approval_steps` — for workflow popover. */
  getApprovalTrail: (
    id: number,
  ): Promise<
    IApiResponse<{
      id: number;
      status: string;
      approval_steps: IPurchaseRequestApprovalStepRow[];
    }>
  > =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-trail`,
      method: 'GET',
    }).then((res) => res.data),

  getStatusCounts: (): Promise<IApiResponse<IPurchaseRequestStatusCounts>> =>
    mainRequest({
      url: `${ENDPOINT}/status-counts`,
      method: 'GET',
    }).then((res) => res.data),

  create: (
    data: IPurchaseRequestPayload,
  ): Promise<IApiResponse<IPurchaseRequestRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then(
      (res) => res.data,
    ),

  edit: (
    id: number,
    data: Partial<IPurchaseRequestPayload> & {
      items?: IPurchaseRequestItemPayload[];
    },
  ): Promise<IApiResponse<IPurchaseRequestRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'PUT', data }).then(
      (res) => res.data,
    ),

  remove: (id: number): Promise<IApiResponse<unknown>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
      (res) => res.data,
    ),

  updateStatus: (
    id: number,
    status: PurchaseRequestStatus | string,
  ): Promise<IApiResponse<IPurchaseRequestRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then((res) => res.data),

  approvalDecision: (
    id: number,
    data: IPurchaseRequestApprovalDecisionPayload,
  ): Promise<IApiResponse<IPurchaseRequestRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-decision`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  // ---- single-item endpoints ----
  addItem: (
    purchaseRequestId: number,
    data: IPurchaseRequestItemPayload,
  ): Promise<IApiResponse<IPurchaseRequestItemRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/items`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  editItem: (
    purchaseRequestId: number,
    itemId: number,
    data: Partial<IPurchaseRequestItemPayload>,
  ): Promise<IApiResponse<IPurchaseRequestItemRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/items/${itemId}`,
      method: 'PUT',
      data,
    }).then((res) => res.data),

  removeItem: (
    purchaseRequestId: number,
    itemId: number,
  ): Promise<IApiResponse<unknown>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/items/${itemId}`,
      method: 'DELETE',
    }).then((res) => res.data),

  // ---- documents ----
  listDocuments: (
    purchaseRequestId: number,
  ): Promise<IApiResponse<IPurchaseRequestDocumentRow[]>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/documents`,
      method: 'GET',
    }).then((res) => res.data),

  addDocument: (
    purchaseRequestId: number,
    data: {
      file_name: string;
      file_path: string;
      file_type?: string | null;
      file_size?: number | null;
    },
  ): Promise<IApiResponse<IPurchaseRequestDocumentRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/documents`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  removeDocument: (
    purchaseRequestId: number,
    documentId: number,
  ): Promise<IApiResponse<unknown>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseRequestId}/documents/${documentId}`,
      method: 'DELETE',
    }).then((res) => res.data),
};

export default purchaseRequestService;
