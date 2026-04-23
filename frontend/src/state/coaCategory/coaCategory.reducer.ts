import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewCoaCategory,
  editCoaCategoryById,
  removeCoaCategoryById,
  searchCoaCategoryData,
  updateCoaCategoryStatus,
} from "./coaCategory.action";
import type { ICoaCategoryMasterState } from "./coaCategory.model";

export const initialState: ICoaCategoryMasterState = {
  coaCategoriesData: {
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
  createCoaCategory: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const coaCategoryMasterSlice = createSlice({
  name: "coaCategoryMaster",
  initialState,
  reducers: {
    clearCoaCategoryMessage: (state) => {
      state.coaCategoriesData.message = "";
      state.createCoaCategory.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCoaCategoryData.pending, (state) => {
        state.coaCategoriesData.loading = true;
      })
      .addCase(searchCoaCategoryData.fulfilled, (state, action) => {
        state.coaCategoriesData.data = action.payload.data;
        state.coaCategoriesData.message = action.payload.message;
        state.coaCategoriesData.loading = false;
        state.coaCategoriesData.hasErrors = false;
      })
      .addCase(searchCoaCategoryData.rejected, (state, action) => {
        state.coaCategoriesData.loading = false;
        state.coaCategoriesData.hasErrors = true;
        state.coaCategoriesData.message = action.error.message ?? "";
      })

      .addCase(createNewCoaCategory.pending, (state) => {
        state.createCoaCategory.loading = true;
      })
      .addCase(createNewCoaCategory.fulfilled, (state, action) => {
        state.createCoaCategory.message = action.payload.message;
        state.createCoaCategory.loading = false;
        state.createCoaCategory.hasErrors = false;
      })
      .addCase(createNewCoaCategory.rejected, (state, action) => {
        state.createCoaCategory.loading = false;
        state.createCoaCategory.hasErrors = true;
        state.createCoaCategory.message = action.error.message ?? "";
      })

      .addCase(editCoaCategoryById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCoaCategoryById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCoaCategoryById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateCoaCategoryStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCoaCategoryStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCoaCategoryStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeCoaCategoryById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCoaCategoryById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCoaCategoryById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const coaCategoryMasterSelector = (state: RootState) =>
  state.coaCategoryMaster;
export const { clearCoaCategoryMessage } = coaCategoryMasterSlice.actions;

export default coaCategoryMasterSlice.reducer;
