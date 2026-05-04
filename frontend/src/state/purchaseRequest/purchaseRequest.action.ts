import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import purchaseRequestService from '@/services/purchaseRequest/purchaseRequest.service';
import type {
  IPurchaseRequestPayload,
  PurchaseRequestStatus,
} from './purchaseRequest.model';

export const searchPurchaseRequestData = createAsyncThunk(
  'purchaseRequest/searchPurchaseRequestData',
  async (params: any) => {
    return purchaseRequestService.search(params);
  },
);

export const fetchPurchaseRequestById = createAsyncThunk(
  'purchaseRequest/fetchPurchaseRequestById',
  async (id: number) => {
    return purchaseRequestService.getById(id);
  },
);

export const createNewPurchaseRequest = createAsyncThunk(
  'purchaseRequest/createNewPurchaseRequest',
  async (data: IPurchaseRequestPayload, { rejectWithValue }) => {
    try {
      return await purchaseRequestService.create(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data as
          | { message?: string | string[] }
          | undefined;
        const m = body?.message;
        const text = Array.isArray(m)
          ? m.join(' ')
          : (m ?? err.message ?? 'Could not create purchase request.');
        return rejectWithValue(text);
      }
      return rejectWithValue('Could not create purchase request.');
    }
  },
);

export const editPurchaseRequestById = createAsyncThunk(
  'purchaseRequest/editPurchaseRequestById',
  async (
    payload: { id: number } & Partial<IPurchaseRequestPayload>,
  ) => {
    const { id, ...data } = payload;
    return purchaseRequestService.edit(id, data);
  },
);

export const removePurchaseRequestById = createAsyncThunk(
  'purchaseRequest/removePurchaseRequestById',
  async (id: number) => {
    return purchaseRequestService.remove(id);
  },
);

export const updatePurchaseRequestStatus = createAsyncThunk(
  'purchaseRequest/updatePurchaseRequestStatus',
  async (data: { id: number; status: PurchaseRequestStatus | string }) => {
    return purchaseRequestService.updateStatus(data.id, data.status);
  },
);

export const submitPurchaseRequestApprovalDecision = createAsyncThunk(
  'purchaseRequest/submitPurchaseRequestApprovalDecision',
  async (
    data: {
      id: number;
      decision: 'APPROVE' | 'REJECT';
      remarks?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      return await purchaseRequestService.approvalDecision(data.id, {
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
