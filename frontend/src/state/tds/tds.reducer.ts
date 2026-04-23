import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewTds,
  editTdsById,
  removeTdsById,
  searchTdsData,
  updateTdsStatus,
} from "./tds.action";
import type { ITdsMasterState } from "./tds.model";

export const initialState: ITdsMasterState = {
  tdsData: {
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
  createTds: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const tdsMasterSlice = createSlice({
  name: "tdsMaster",
  initialState,
  reducers: {
    clearTdsMessage: (state) => {
      state.tdsData.message = "";
      state.createTds.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTdsData.pending, (state) => {
        state.tdsData.loading = true;
      })
      .addCase(searchTdsData.fulfilled, (state, action) => {
        state.tdsData.data = action.payload.data;
        state.tdsData.message = action.payload.message;
        state.tdsData.loading = false;
        state.tdsData.hasErrors = false;
      })
      .addCase(searchTdsData.rejected, (state, action) => {
        state.tdsData.loading = false;
        state.tdsData.hasErrors = true;
        state.tdsData.message = action.error.message ?? "";
      })

      .addCase(createNewTds.pending, (state) => {
        state.createTds.loading = true;
      })
      .addCase(createNewTds.fulfilled, (state, action) => {
        state.createTds.message = action.payload.message;
        state.createTds.loading = false;
        state.createTds.hasErrors = false;
      })
      .addCase(createNewTds.rejected, (state, action) => {
        state.createTds.loading = false;
        state.createTds.hasErrors = true;
        state.createTds.message = action.error.message ?? "";
      })

      .addCase(editTdsById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editTdsById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editTdsById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateTdsStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateTdsStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateTdsStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeTdsById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeTdsById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeTdsById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const tdsMasterSelector = (state: RootState) => state.tdsMaster;
export const { clearTdsMessage } = tdsMasterSlice.actions;

export default tdsMasterSlice.reducer;
