import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewEntity,
  editEntityById,
  removeEntityById,
  searchEntityData,
  updateEntityStatus,
} from './entity.action';
import type { IEntityMasterState } from './entity.model';

export const initialState: IEntityMasterState = {
  entitiesData: {
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
  createEntity: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const entityMasterSlice = createSlice({
  name: 'entityMaster',
  initialState,
  reducers: {
    clearEntityMessage: (state) => {
      state.entitiesData.message = '';
      state.createEntity.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchEntityData.pending, (state) => {
        state.entitiesData.loading = true;
      })
      .addCase(searchEntityData.fulfilled, (state, action) => {
        state.entitiesData.data = action.payload.data;
        state.entitiesData.message = action.payload.message;
        state.entitiesData.loading = false;
        state.entitiesData.hasErrors = false;
      })
      .addCase(searchEntityData.rejected, (state, action) => {
        state.entitiesData.loading = false;
        state.entitiesData.hasErrors = true;
        state.entitiesData.message = action.error.message ?? '';
      })

      .addCase(createNewEntity.pending, (state) => {
        state.createEntity.loading = true;
      })
      .addCase(createNewEntity.fulfilled, (state, action) => {
        state.createEntity.message = action.payload.message;
        state.createEntity.loading = false;
        state.createEntity.hasErrors = false;
      })
      .addCase(createNewEntity.rejected, (state, action) => {
        state.createEntity.loading = false;
        state.createEntity.hasErrors = true;
        state.createEntity.message = action.error.message ?? '';
      })

      .addCase(editEntityById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editEntityById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editEntityById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateEntityStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateEntityStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateEntityStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeEntityById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeEntityById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeEntityById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const entityMasterSelector = (state: RootState) => state.entityMaster;
export const { clearEntityMessage } = entityMasterSlice.actions;

export default entityMasterSlice.reducer;
