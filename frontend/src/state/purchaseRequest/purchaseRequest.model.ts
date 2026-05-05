import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type {
  IPurchaseRequestRow,
  PurchaseRequestStatus,
} from '@/services/purchaseRequest/purchaseRequest.model';

export type {
  IPurchaseRequestRow,
  IPurchaseRequestItemRow,
  IPurchaseRequestDocumentRow,
  IPurchaseRequestPayload,
  IPurchaseRequestItemPayload,
  PurchaseRequestStatus,
} from '@/services/purchaseRequest/purchaseRequest.model';

export interface IPurchaseRequestListData {
  rows: IPurchaseRequestRow[];
  meta: IMetaProps;
}

export interface IPurchaseRequestStateBlock {
  loading: boolean;
  hasErrors: boolean;
  message: string;
}

export interface IPurchaseRequestState {
  list: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IPurchaseRequestListData;
  };
  current: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IPurchaseRequestRow | null;
  };
  create: IPurchaseRequestStateBlock;
  editById: IPurchaseRequestStateBlock;
  removeById: IPurchaseRequestStateBlock;
  updateById: IPurchaseRequestStateBlock & {
    nextStatus?: PurchaseRequestStatus | string;
  };
  approvalDecision: IPurchaseRequestStateBlock;
}
