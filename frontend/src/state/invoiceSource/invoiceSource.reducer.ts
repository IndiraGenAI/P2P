import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewInvoiceSource,
  editInvoiceSourceById,
  removeInvoiceSourceById,
  searchInvoiceSourceData,
  updateInvoiceSourceStatus,
} from "./invoiceSource.action";
import type { IInvoiceSourceMasterState } from "./invoiceSource.model";

export const initialState: IInvoiceSourceMasterState = {
  invoiceSourcesData: {
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
  createInvoiceSource: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const invoiceSourceMasterSlice = createSlice({
  name: "invoiceSourceMaster",
  initialState,
  reducers: {
    clearInvoiceSourceMessage: (state) => {
      state.invoiceSourcesData.message = "";
      state.createInvoiceSource.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchInvoiceSourceData.pending, (state) => {
        state.invoiceSourcesData.loading = true;
      })
      .addCase(searchInvoiceSourceData.fulfilled, (state, action) => {
        state.invoiceSourcesData.data = action.payload.data;
        state.invoiceSourcesData.message = action.payload.message;
        state.invoiceSourcesData.loading = false;
        state.invoiceSourcesData.hasErrors = false;
      })
      .addCase(searchInvoiceSourceData.rejected, (state, action) => {
        state.invoiceSourcesData.loading = false;
        state.invoiceSourcesData.hasErrors = true;
        state.invoiceSourcesData.message = action.error.message ?? "";
      })

      .addCase(createNewInvoiceSource.pending, (state) => {
        state.createInvoiceSource.loading = true;
      })
      .addCase(createNewInvoiceSource.fulfilled, (state, action) => {
        state.createInvoiceSource.message = action.payload.message;
        state.createInvoiceSource.loading = false;
        state.createInvoiceSource.hasErrors = false;
      })
      .addCase(createNewInvoiceSource.rejected, (state, action) => {
        state.createInvoiceSource.loading = false;
        state.createInvoiceSource.hasErrors = true;
        state.createInvoiceSource.message = action.error.message ?? "";
      })

      .addCase(editInvoiceSourceById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editInvoiceSourceById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editInvoiceSourceById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateInvoiceSourceStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateInvoiceSourceStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateInvoiceSourceStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeInvoiceSourceById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeInvoiceSourceById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeInvoiceSourceById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const invoiceSourceMasterSelector = (state: RootState) =>
  state.invoiceSourceMaster;
export const { clearInvoiceSourceMessage } = invoiceSourceMasterSlice.actions;

export default invoiceSourceMasterSlice.reducer;
