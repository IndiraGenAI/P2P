import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type {
  IPurchaseOrderRow,
  PurchaseOrderStatus,
} from '@/services/purchaseOrder/purchaseOrder.model';

export type {
  IPurchaseOrderRow,
  IPurchaseOrderItemRow,
  IPurchaseOrderDocumentRow,
  IPurchaseOrderPayload,
  IPurchaseOrderItemPayload,
  PurchaseOrderStatus,
} from '@/services/purchaseOrder/purchaseOrder.model';

export interface IPurchaseOrderListData {
  rows: IPurchaseOrderRow[];
  meta: IMetaProps;
}

export interface IPurchaseOrderStateBlock {
  loading: boolean;
  hasErrors: boolean;
  message: string;
}

export interface IPurchaseOrderState {
  list: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IPurchaseOrderListData;
  };
  current: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IPurchaseOrderRow | null;
  };
  create: IPurchaseOrderStateBlock;
  editById: IPurchaseOrderStateBlock;
  removeById: IPurchaseOrderStateBlock;
  updateById: IPurchaseOrderStateBlock & {
    nextStatus?: PurchaseOrderStatus | string;
  };
  approvalDecision: IPurchaseOrderStateBlock;
}
