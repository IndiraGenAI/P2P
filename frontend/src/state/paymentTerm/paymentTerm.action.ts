import { createAsyncThunk } from '@reduxjs/toolkit';
import paymentTermService from '@/services/paymentTerm/paymentTerm.service';
import type { IPaymentTermRow } from './paymentTerm.model';

export const searchPaymentTermData = createAsyncThunk(
  'paymentTermMaster/searchPaymentTermData',
  async (data: any) => {
    return paymentTermService.search(data);
  },
);

export const createNewPaymentTerm = createAsyncThunk(
  'paymentTermMaster/createNewPaymentTerm',
  async (data: Partial<IPaymentTermRow>) => {
    return paymentTermService.create(data);
  },
);

export const editPaymentTermById = createAsyncThunk(
  'paymentTermMaster/editPaymentTermById',
  async (data: Partial<IPaymentTermRow> & { id: number }) => {
    return paymentTermService.edit(data);
  },
);

export const removePaymentTermById = createAsyncThunk(
  'paymentTermMaster/removePaymentTermById',
  async (id: number) => {
    return paymentTermService.remove(id);
  },
);

export const updatePaymentTermStatus = createAsyncThunk(
  'paymentTermMaster/updatePaymentTermStatus',
  async (data: { id: number; status?: boolean }) => {
    return paymentTermService.updateStatus(data);
  },
);
