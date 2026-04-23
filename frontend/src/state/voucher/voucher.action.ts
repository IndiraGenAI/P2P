import { createAsyncThunk } from "@reduxjs/toolkit";
import voucherService, {
  type IVoucherRecord,
} from "src/services/voucher/voucher.service";
import type {
  IVoucherDetails,
  IVoucherStatus,
} from "src/services/voucher/voucher.model";

export const searchVoucherData = createAsyncThunk(
  "voucherMaster/searchVoucherData",
  async (data: any) => {
    return voucherService.searchVoucherData(data);
  },
);

export const createNewVoucher = createAsyncThunk(
  "voucherMaster/createNewVoucher",
  async (data: IVoucherDetails) => {
    return voucherService.createNewVoucher(data);
  },
);

export const editVoucherById = createAsyncThunk(
  "voucherMaster/editVoucherById",
  async (data: IVoucherRecord) => {
    return voucherService.editVoucherById(data);
  },
);

export const removeVoucherById = createAsyncThunk(
  "voucherMaster/removeVoucherById",
  async (id: number) => {
    return voucherService.removeVoucherById(id);
  },
);

export const updateVoucherStatus = createAsyncThunk(
  "voucherMaster/updateVoucherStatus",
  async (data: IVoucherStatus) => {
    return voucherService.updateVoucherStatus(data);
  },
);
