import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewItemCategory,
  editItemCategoryById,
  removeItemCategoryById,
  searchItemCategoryData,
  updateItemCategoryStatus,
} from './itemCategory.action';
import type { IItemCategoryMasterState } from './itemCategory.model';

export const initialState: IItemCategoryMasterState = {
  itemCategoriesData: {
    loading: false,
    hasErrors: false,
    message: '',
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
  createItemCategory: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const itemCategoryMasterSlice = createSlice({
  name: 'itemCategoryMaster',
  initialState,
  reducers: {
    clearItemCategoryMessage: (state) => {
      state.itemCategoriesData.message = '';
      state.createItemCategory.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItemCategoryData.pending, (state) => {
        state.itemCategoriesData.loading = true;
      })
      .addCase(searchItemCategoryData.fulfilled, (state, action) => {
        state.itemCategoriesData.data = action.payload.data;
        state.itemCategoriesData.message = action.payload.message;
        state.itemCategoriesData.loading = false;
        state.itemCategoriesData.hasErrors = false;
      })
      .addCase(searchItemCategoryData.rejected, (state, action) => {
        state.itemCategoriesData.loading = false;
        state.itemCategoriesData.hasErrors = true;
        state.itemCategoriesData.message = action.error.message ?? '';
      })

      .addCase(createNewItemCategory.pending, (state) => {
        state.createItemCategory.loading = true;
      })
      .addCase(createNewItemCategory.fulfilled, (state, action) => {
        state.createItemCategory.loading = false;
        state.createItemCategory.hasErrors = false;
        state.createItemCategory.message = action.payload.message;
      })
      .addCase(createNewItemCategory.rejected, (state, action) => {
        state.createItemCategory.loading = false;
        state.createItemCategory.hasErrors = true;
        state.createItemCategory.message = action.error.message ?? '';
      })

      .addCase(editItemCategoryById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editItemCategoryById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editItemCategoryById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeItemCategoryById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeItemCategoryById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeItemCategoryById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateItemCategoryStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateItemCategoryStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateItemCategoryStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectItemCategoryMasterRaw = (state: RootState) =>
  state.itemCategoryMaster;

export const itemCategoryMasterSelector = createSelector(
  [selectItemCategoryMasterRaw],
  (s) => ({
    list: s.itemCategoriesData,
    create: s.createItemCategory,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearItemCategoryMessage } = itemCategoryMasterSlice.actions;

export default itemCategoryMasterSlice.reducer;
