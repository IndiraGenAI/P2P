import paymentTermService, {
  type IPaymentTermRow,
} from '@/services/paymentTerm/paymentTerm.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const paymentTerm = createMasterSlice<
  IPaymentTermRow,
  Partial<IPaymentTermRow>,
  Partial<IPaymentTermRow> & { id: number }
>('paymentTermMaster', paymentTermService);

export const {
  search: searchPaymentTermData,
  create: createNewPaymentTerm,
  edit: editPaymentTermById,
  remove: removePaymentTermById,
  updateStatus: updatePaymentTermStatus,
} = paymentTerm.actions;

export const clearPaymentTermMessage = paymentTerm.clearMessage;
export const paymentTermMasterSelector = (state: RootState) =>
  state.paymentTermMaster;
export default paymentTerm.reducer;
