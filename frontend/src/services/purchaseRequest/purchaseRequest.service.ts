import config from '@/utils/config';
import mainRequest from '@/axios/mainRequest';
import type { IApiResponse } from '@/utils/models/common';
import type { IMetaProps } from '@/components/Pagination/Pagination.model';

export type PurchaseRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'CLOSED';

export interface IPurchaseRequestItemRow {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number | string;
  estimated_rate: number | string;
  amount: number | string;
  remarks?: string | null;
  item?: { id: number; code: string; name: string } | null;
}

export interface IPurchaseRequestDocumentRow {
  id: number;
  purchase_request_id: number;
  file_name: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: string | null;
  uploaded_by: string | null;
  uploaded_date: string | Date | null;
}

export interface IPurchaseRequestRow {
  id: number;
  pr_number: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | Date | null;
  validity_to?: string | Date | null;
  required_date?: string | Date | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_conditions?: string | null;
  center_id?: number | null;
  remarks?: string | null;
  overall_summary?: string | null;
  net_amount?: string | number | null;
  status: PurchaseRequestStatus | string;

  vendor?: { id: number; code?: string | null; name: string } | null;
  vendor_site?: {
    id: number;
    site_code?: string | null;
    site_name?: string | null;
  } | null;
  entity?: { id: number; code?: string | null; name: string } | null;
  department?: { id: number; code?: string | null; name: string } | null;
  subdepartment?: { id: number; code?: string | null; name: string } | null;
  payment_term?: { id: number; code?: string | null; name: string } | null;
  center?: { id: number; code?: string | null; name: string } | null;
  item_type?: { id: number; code?: string | null; name: string } | null;

  items?: IPurchaseRequestItemRow[];
  documents?: IPurchaseRequestDocumentRow[];

  created_by?: string | null;
  created_date?: string | Date | null;
  updated_by?: string | null;
  updated_date?: string | Date | null;
}

export interface IPurchaseRequestListResult {
  rows: IPurchaseRequestRow[];
  meta: IMetaProps;
}

/** Tab badges only: All + pending queue + approved + rejected. */
export interface IPurchaseRequestStatusCounts {
  ALL: number;
  /** Rows in DB as `SUBMITTED` or `PENDING` (awaiting decision). */
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
}

export interface IPurchaseRequestPayload {
  pr_number?: string | null;
  entity_id?: number | null;
  vendor_id?: number | null;
  vendor_site_id?: number | null;
  item_type_id?: number | null;
  validity_from?: string | null;
  validity_to?: string | null;
  required_date?: string | null;
  frequency?: string | null;
  department_id?: number | null;
  subdepartment_id?: number | null;
  payment_term_id?: number | null;
  terms_conditions?: string | null;
  center_id?: number | null;
  remarks?: string | null;
  overall_summary?: string | null;
  net_amount?: number;
  status?: PurchaseRequestStatus | string;
  items: IPurchaseRequestItemPayload[];
}

export interface IPurchaseRequestItemPayload {
  id?: number;
  item_id?: number | null;
  description?: string | null;
  quantity: number;
  estimated_rate: number;
  amount?: number;
  remarks?: string | null;
}

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
