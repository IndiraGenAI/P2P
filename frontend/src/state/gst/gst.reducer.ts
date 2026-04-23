import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewGst,
  editGstById,
  removeGstById,
  searchGstData,
  updateGstStatus,
} from "./gst.action";
import type { IGstMasterState } from "./gst.model";

export const initialState: IGstMasterState = {
  gstsData: {
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
  createGst: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const gstMasterSlice = createSlice({
  name: "gstMaster",
  initialState,
  reducers: {
    clearGstMessage: (state) => {
      state.gstsData.message = "";
      state.createGst.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchGstData.pending, (state) => {
        state.gstsData.loading = true;
      })
      .addCase(searchGstData.fulfilled, (state, action) => {
        state.gstsData.data = action.payload.data;
        state.gstsData.message = action.payload.message;
        state.gstsData.loading = false;
        state.gstsData.hasErrors = false;
      })
      .addCase(searchGstData.rejected, (state, action) => {
        state.gstsData.loading = false;
        state.gstsData.hasErrors = true;
        state.gstsData.message = action.error.message ?? "";
      })

      .addCase(createNewGst.pending, (state) => {
        state.createGst.loading = true;
      })
      .addCase(createNewGst.fulfilled, (state, action) => {
        state.createGst.message = action.payload.message;
        state.createGst.loading = false;
        state.createGst.hasErrors = false;
      })
      .addCase(createNewGst.rejected, (state, action) => {
        state.createGst.loading = false;
        state.createGst.hasErrors = true;
        state.createGst.message = action.error.message ?? "";
      })

      .addCase(editGstById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editGstById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editGstById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateGstStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateGstStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateGstStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeGstById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeGstById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeGstById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const gstMasterSelector = (state: RootState) => state.gstMaster;
export const { clearGstMessage } = gstMasterSlice.actions;

export default gstMasterSlice.reducer;
