import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewState,
  editStateById,
  removeStateById,
  searchStateData,
  updateStateStatus,
} from './state.action';
import type { IStateMasterState } from './state.model';

export const initialState: IStateMasterState = {
  statesData: {
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
  createState: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const stateMasterSlice = createSlice({
  name: 'stateMaster',
  initialState,
  reducers: {
    clearStateMessage: (state) => {
      state.statesData.message = '';
      state.createState.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchStateData.pending, (state) => {
        state.statesData.loading = true;
      })
      .addCase(searchStateData.fulfilled, (state, action) => {
        state.statesData.data = action.payload.data;
        state.statesData.message = action.payload.message;
        state.statesData.loading = false;
        state.statesData.hasErrors = false;
      })
      .addCase(searchStateData.rejected, (state, action) => {
        state.statesData.loading = false;
        state.statesData.hasErrors = true;
        state.statesData.message = action.error.message ?? '';
      })

      .addCase(createNewState.pending, (state) => {
        state.createState.loading = true;
      })
      .addCase(createNewState.fulfilled, (state, action) => {
        state.createState.message = action.payload.message;
        state.createState.loading = false;
        state.createState.hasErrors = false;
      })
      .addCase(createNewState.rejected, (state, action) => {
        state.createState.loading = false;
        state.createState.hasErrors = true;
        state.createState.message = action.error.message ?? '';
      })

      .addCase(editStateById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editStateById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editStateById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateStateStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateStateStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateStateStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeStateById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeStateById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeStateById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const stateMasterSelector = (state: RootState) => state.stateMaster;
export const { clearStateMessage } = stateMasterSlice.actions;

export default stateMasterSlice.reducer;
