import type { IVoucherList } from "src/services/voucher/voucher.model";

export interface IVoucherMasterState {
  vouchersData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IVoucherList;
  };
  createVoucher: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
