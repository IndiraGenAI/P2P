import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewItemType,
  editItemTypeById,
  removeItemTypeById,
  searchItemTypeData,
  updateItemTypeStatus,
} from './itemType.action';
import type { IItemTypeMasterState } from './itemType.model';

export const initialState: IItemTypeMasterState = {
  itemTypesData: {
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
  createItemType: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const itemTypeMasterSlice = createSlice({
  name: 'itemTypeMaster',
  initialState,
  reducers: {
    clearItemTypeMessage: (state) => {
      state.itemTypesData.message = '';
      state.createItemType.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItemTypeData.pending, (state) => {
        state.itemTypesData.loading = true;
      })
      .addCase(searchItemTypeData.fulfilled, (state, action) => {
        state.itemTypesData.data = action.payload.data;
        state.itemTypesData.message = action.payload.message;
        state.itemTypesData.loading = false;
        state.itemTypesData.hasErrors = false;
      })
      .addCase(searchItemTypeData.rejected, (state, action) => {
        state.itemTypesData.loading = false;
        state.itemTypesData.hasErrors = true;
        state.itemTypesData.message = action.error.message ?? '';
      })

      .addCase(createNewItemType.pending, (state) => {
        state.createItemType.loading = true;
      })
      .addCase(createNewItemType.fulfilled, (state, action) => {
        state.createItemType.loading = false;
        state.createItemType.hasErrors = false;
        state.createItemType.message = action.payload.message;
      })
      .addCase(createNewItemType.rejected, (state, action) => {
        state.createItemType.loading = false;
        state.createItemType.hasErrors = true;
        state.createItemType.message = action.error.message ?? '';
      })

      .addCase(editItemTypeById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editItemTypeById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editItemTypeById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeItemTypeById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeItemTypeById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeItemTypeById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateItemTypeStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateItemTypeStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateItemTypeStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectItemTypeMasterRaw = (state: RootState) => state.itemTypeMaster;

export const itemTypeMasterSelector = createSelector(
  [selectItemTypeMasterRaw],
  (s) => ({
    list: s.itemTypesData,
    create: s.createItemType,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearItemTypeMessage } = itemTypeMasterSlice.actions;

export default itemTypeMasterSlice.reducer;
