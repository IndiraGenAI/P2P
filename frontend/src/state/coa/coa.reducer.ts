import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewCoa,
  editCoaById,
  removeCoaById,
  searchCoaData,
  updateCoaStatus,
} from "./coa.action";
import type { ICoaMasterState } from "./coa.model";

export const initialState: ICoaMasterState = {
  coasData: {
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
  createCoa: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const coaMasterSlice = createSlice({
  name: "coaMaster",
  initialState,
  reducers: {
    clearCoaMessage: (state) => {
      state.coasData.message = "";
      state.createCoa.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCoaData.pending, (state) => {
        state.coasData.loading = true;
      })
      .addCase(searchCoaData.fulfilled, (state, action) => {
        state.coasData.data = action.payload.data;
        state.coasData.message = action.payload.message;
        state.coasData.loading = false;
        state.coasData.hasErrors = false;
      })
      .addCase(searchCoaData.rejected, (state, action) => {
        state.coasData.loading = false;
        state.coasData.hasErrors = true;
        state.coasData.message = action.error.message ?? "";
      })

      .addCase(createNewCoa.pending, (state) => {
        state.createCoa.loading = true;
      })
      .addCase(createNewCoa.fulfilled, (state, action) => {
        state.createCoa.message = action.payload.message;
        state.createCoa.loading = false;
        state.createCoa.hasErrors = false;
      })
      .addCase(createNewCoa.rejected, (state, action) => {
        state.createCoa.loading = false;
        state.createCoa.hasErrors = true;
        state.createCoa.message = action.error.message ?? "";
      })

      .addCase(editCoaById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCoaById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCoaById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateCoaStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCoaStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCoaStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeCoaById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCoaById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCoaById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const coaMasterSelector = (state: RootState) => state.coaMaster;
export const { clearCoaMessage } = coaMasterSlice.actions;

export default coaMasterSlice.reducer;
