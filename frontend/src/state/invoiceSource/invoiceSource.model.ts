import type { IInvoiceSourceList } from "src/services/invoiceSource/invoiceSource.model";

export interface IInvoiceSourceMasterState {
  invoiceSourcesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IInvoiceSourceList;
  };
  createInvoiceSource: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
