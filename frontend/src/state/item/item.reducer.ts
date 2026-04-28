import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewItem,
  editItemById,
  removeItemById,
  searchItemData,
  updateItemStatus,
} from './item.action';
import type { IItemMasterState } from './item.model';

export const initialState: IItemMasterState = {
  itemsData: {
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
  createItem: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const itemMasterSlice = createSlice({
  name: 'itemMaster',
  initialState,
  reducers: {
    clearItemMessage: (state) => {
      state.itemsData.message = '';
      state.createItem.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItemData.pending, (state) => {
        state.itemsData.loading = true;
      })
      .addCase(searchItemData.fulfilled, (state, action) => {
        state.itemsData.data = action.payload.data;
        state.itemsData.message = action.payload.message;
        state.itemsData.loading = false;
        state.itemsData.hasErrors = false;
      })
      .addCase(searchItemData.rejected, (state, action) => {
        state.itemsData.loading = false;
        state.itemsData.hasErrors = true;
        state.itemsData.message = action.error.message ?? '';
      })

      .addCase(createNewItem.pending, (state) => {
        state.createItem.loading = true;
      })
      .addCase(createNewItem.fulfilled, (state, action) => {
        state.createItem.loading = false;
        state.createItem.hasErrors = false;
        state.createItem.message = action.payload.message;
      })
      .addCase(createNewItem.rejected, (state, action) => {
        state.createItem.loading = false;
        state.createItem.hasErrors = true;
        state.createItem.message = action.error.message ?? '';
      })

      .addCase(editItemById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editItemById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editItemById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeItemById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeItemById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeItemById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateItemStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateItemStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateItemStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectItemMasterRaw = (state: RootState) => state.itemMaster;

export const itemMasterSelector = createSelector(
  [selectItemMasterRaw],
  (s) => ({
    list: s.itemsData,
    create: s.createItem,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearItemMessage } = itemMasterSlice.actions;

export default itemMasterSlice.reducer;
