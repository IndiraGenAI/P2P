import { createAsyncThunk } from '@reduxjs/toolkit';
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
  async (data: IPurchaseRequestPayload) => {
    return purchaseRequestService.create(data);
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
