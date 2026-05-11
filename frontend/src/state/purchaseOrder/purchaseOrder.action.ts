import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PurchaseRequestApprovalDecision } from '@/commons/enum';
import purchaseOrderService from '@/services/purchaseOrder/purchaseOrder.service';
import type {
  IPurchaseOrderPayload,
  PurchaseOrderStatus,
} from './purchaseOrder.model';

export const searchPurchaseOrderData = createAsyncThunk(
  'purchaseOrder/searchPurchaseOrderData',
  async (params: any) => {
    return purchaseOrderService.search(params);
  },
);

export const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrder/fetchPurchaseOrderById',
  async (id: number) => {
    return purchaseOrderService.getById(id);
  },
);

export const createNewPurchaseOrder = createAsyncThunk(
  'purchaseOrder/createNewPurchaseOrder',
  async (data: IPurchaseOrderPayload, { rejectWithValue }) => {
    try {
      return await purchaseOrderService.create(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data as
          | { message?: string | string[] }
          | undefined;
        const m = body?.message;
        const text = Array.isArray(m)
          ? m.join(' ')
          : (m ?? err.message ?? 'Could not create purchase order.');
        return rejectWithValue(text);
      }
      return rejectWithValue('Could not create purchase order.');
    }
  },
);

export const editPurchaseOrderById = createAsyncThunk(
  'purchaseOrder/editPurchaseOrderById',
  async (
    payload: { id: number } & Partial<IPurchaseOrderPayload>,
  ) => {
    const { id, ...data } = payload;
    return purchaseOrderService.edit(id, data);
  },
);

export const removePurchaseOrderById = createAsyncThunk(
  'purchaseOrder/removePurchaseOrderById',
  async (id: number) => {
    return purchaseOrderService.remove(id);
  },
);

export const updatePurchaseOrderStatus = createAsyncThunk(
  'purchaseOrder/updatePurchaseOrderStatus',
  async (data: { id: number; status: PurchaseOrderStatus | string }) => {
    return purchaseOrderService.updateStatus(data.id, data.status);
  },
);

export const submitPurchaseOrderApprovalDecision = createAsyncThunk(
  'purchaseOrder/submitPurchaseOrderApprovalDecision',
  async (
    data: {
      id: number;
      decision: PurchaseRequestApprovalDecision;
      remarks?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      return await purchaseOrderService.approvalDecision(data.id, {
        decision: data.decision,
        remarks: data.remarks ?? null,
      });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data as
          | { message?: string | string[] }
          | undefined;
        const m = body?.message;
        const text = Array.isArray(m)
          ? m.join(' ')
          : (m ?? err.message ?? 'Could not record approval decision.');
        return rejectWithValue(text);
      }
      return rejectWithValue('Could not record approval decision.');
    }
  },
);
