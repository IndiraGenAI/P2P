import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type {
  IPurchaseOrderApprovalDecisionPayload,
  IPurchaseOrderApprovalStepRow,
  IPurchaseOrderDocumentRow,
  IPurchaseOrderItemPayload,
  IPurchaseOrderItemRow,
  IPurchaseOrderListResult,
  IPurchaseOrderPayload,
  IPurchaseOrderRow,
  IPurchaseOrderStatusCounts,
  PurchaseOrderStatus,
} from './purchaseOrder.model';

const ENDPOINT = config.baseApiMain + '/purchase-order';

const purchaseOrderService = {
  ENDPOINT,

  search: (
    params: unknown,
  ): Promise<IApiResponse<IPurchaseOrderListResult>> =>
    mainRequest({ url: ENDPOINT, method: 'GET', params }).then(
      (res) => res.data,
    ),

  getById: (id: number): Promise<IApiResponse<IPurchaseOrderRow>> =>
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
      approval_steps: IPurchaseOrderApprovalStepRow[];
    }>
  > =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-trail`,
      method: 'GET',
    }).then((res) => res.data),

  getStatusCounts: (): Promise<IApiResponse<IPurchaseOrderStatusCounts>> =>
    mainRequest({
      url: `${ENDPOINT}/status-counts`,
      method: 'GET',
    }).then((res) => res.data),

  create: (
    data: IPurchaseOrderPayload,
  ): Promise<IApiResponse<IPurchaseOrderRow>> =>
    mainRequest({ url: ENDPOINT, method: 'POST', data }).then(
      (res) => res.data,
    ),

  edit: (
    id: number,
    data: Partial<IPurchaseOrderPayload> & {
      items?: IPurchaseOrderItemPayload[];
    },
  ): Promise<IApiResponse<IPurchaseOrderRow>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'PUT', data }).then(
      (res) => res.data,
    ),

  remove: (id: number): Promise<IApiResponse<unknown>> =>
    mainRequest({ url: `${ENDPOINT}/${id}`, method: 'DELETE' }).then(
      (res) => res.data,
    ),

  updateStatus: (
    id: number,
    status: PurchaseOrderStatus | string,
  ): Promise<IApiResponse<IPurchaseOrderRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then((res) => res.data),

  approvalDecision: (
    id: number,
    data: IPurchaseOrderApprovalDecisionPayload,
  ): Promise<IApiResponse<IPurchaseOrderRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${id}/approval-decision`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  // ---- single-item endpoints ----
  addItem: (
    purchaseOrderId: number,
    data: IPurchaseOrderItemPayload,
  ): Promise<IApiResponse<IPurchaseOrderItemRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/items`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  editItem: (
    purchaseOrderId: number,
    itemId: number,
    data: Partial<IPurchaseOrderItemPayload>,
  ): Promise<IApiResponse<IPurchaseOrderItemRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/items/${itemId}`,
      method: 'PUT',
      data,
    }).then((res) => res.data),

  removeItem: (
    purchaseOrderId: number,
    itemId: number,
  ): Promise<IApiResponse<unknown>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/items/${itemId}`,
      method: 'DELETE',
    }).then((res) => res.data),

  // ---- documents ----
  listDocuments: (
    purchaseOrderId: number,
  ): Promise<IApiResponse<IPurchaseOrderDocumentRow[]>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/documents`,
      method: 'GET',
    }).then((res) => res.data),

  addDocument: (
    purchaseOrderId: number,
    data: {
      file_name: string;
      file_path: string;
      file_type?: string | null;
      file_size?: number | null;
    },
  ): Promise<IApiResponse<IPurchaseOrderDocumentRow>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/documents`,
      method: 'POST',
      data,
    }).then((res) => res.data),

  removeDocument: (
    purchaseOrderId: number,
    documentId: number,
  ): Promise<IApiResponse<unknown>> =>
    mainRequest({
      url: `${ENDPOINT}/${purchaseOrderId}/documents/${documentId}`,
      method: 'DELETE',
    }).then((res) => res.data),
};

export default purchaseOrderService;
