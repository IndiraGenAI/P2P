import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewVoucher,
  editVoucherById,
  removeVoucherById,
  searchVoucherData,
  updateVoucherStatus,
} from "./voucher.action";
import type { IVoucherMasterState } from "./voucher.model";

export const initialState: IVoucherMasterState = {
  vouchersData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      rows: [],
      meta: {
        take: 0,
        itemCount: 0,
        pageCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  },
  createVoucher: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const voucherMasterSlice = createSlice({
  name: "voucherMaster",
  initialState,
  reducers: {
    clearVoucherMessage: (state) => {
      state.vouchersData.message = "";
      state.createVoucher.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVoucherData.pending, (state) => {
        state.vouchersData.loading = true;
      })
      .addCase(searchVoucherData.fulfilled, (state, action) => {
        state.vouchersData.data = action.payload.data;
        state.vouchersData.message = action.payload.message;
        state.vouchersData.loading = false;
        state.vouchersData.hasErrors = false;
      })
      .addCase(searchVoucherData.rejected, (state, action) => {
        state.vouchersData.loading = false;
        state.vouchersData.hasErrors = true;
        state.vouchersData.message = action.error.message ?? "";
      })

      .addCase(createNewVoucher.pending, (state) => {
        state.createVoucher.loading = true;
      })
      .addCase(createNewVoucher.fulfilled, (state, action) => {
        state.createVoucher.message = action.payload.message;
        state.createVoucher.loading = false;
        state.createVoucher.hasErrors = false;
      })
      .addCase(createNewVoucher.rejected, (state, action) => {
        state.createVoucher.loading = false;
        state.createVoucher.hasErrors = true;
        state.createVoucher.message = action.error.message ?? "";
      })

      .addCase(editVoucherById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editVoucherById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editVoucherById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateVoucherStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateVoucherStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateVoucherStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeVoucherById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeVoucherById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeVoucherById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const voucherMasterSelector = (state: RootState) => state.voucherMaster;
export const { clearVoucherMessage } = voucherMasterSlice.actions;

export default voucherMasterSlice.reducer;
