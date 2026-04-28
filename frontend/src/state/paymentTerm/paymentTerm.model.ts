import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IPaymentTermRow } from '@/services/paymentTerm/paymentTerm.service';

export type { IPaymentTermRow } from '@/services/paymentTerm/paymentTerm.service';

export interface IPaymentTermListData {
  rows: IPaymentTermRow[];
  meta: IMetaProps;
}

export interface IPaymentTermMasterState {
  paymentTermsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IPaymentTermListData;
  };
  createPaymentTerm: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
