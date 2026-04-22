import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewZone,
  editZoneById,
  removeZoneById,
  searchZoneData,
  updateZoneStatus,
} from './zone.action';
import type { IZoneMasterState } from './zone.model';

export const initialState: IZoneMasterState = {
  zonesData: {
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
  createZone: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const zoneMasterSlice = createSlice({
  name: 'zoneMaster',
  initialState,
  reducers: {
    clearZoneMessage: (state) => {
      state.zonesData.message = '';
      state.createZone.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchZoneData.pending, (state) => {
        state.zonesData.loading = true;
      })
      .addCase(searchZoneData.fulfilled, (state, action) => {
        state.zonesData.data = action.payload.data;
        state.zonesData.message = action.payload.message;
        state.zonesData.loading = false;
        state.zonesData.hasErrors = false;
      })
      .addCase(searchZoneData.rejected, (state, action) => {
        state.zonesData.loading = false;
        state.zonesData.hasErrors = true;
        state.zonesData.message = action.error.message ?? '';
      })

      .addCase(createNewZone.pending, (state) => {
        state.createZone.loading = true;
      })
      .addCase(createNewZone.fulfilled, (state, action) => {
        state.createZone.message = action.payload.message;
        state.createZone.loading = false;
        state.createZone.hasErrors = false;
      })
      .addCase(createNewZone.rejected, (state, action) => {
        state.createZone.loading = false;
        state.createZone.hasErrors = true;
        state.createZone.message = action.error.message ?? '';
      })

      .addCase(editZoneById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editZoneById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editZoneById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateZoneStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateZoneStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateZoneStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeZoneById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeZoneById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeZoneById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const zoneMasterSelector = (state: RootState) => state.zoneMaster;
export const { clearZoneMessage } = zoneMasterSlice.actions;

export default zoneMasterSlice.reducer;
