import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import {
  createNewApplicantType,
  editApplicantTypeById,
  removeApplicantTypeById,
  searchApplicantTypeData,
  updateApplicantTypeStatus,
} from './applicantType.action';
import type { IApplicantTypeMasterState } from './applicantType.model';

export const initialState: IApplicantTypeMasterState = {
  applicantTypesData: {
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
  createApplicantType: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const applicantTypeMasterSlice = createSlice({
  name: 'applicantTypeMaster',
  initialState,
  reducers: {
    clearApplicantTypeMessage: (state) => {
      state.applicantTypesData.message = '';
      state.createApplicantType.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchApplicantTypeData.pending, (state) => {
        state.applicantTypesData.loading = true;
      })
      .addCase(searchApplicantTypeData.fulfilled, (state, action) => {
        state.applicantTypesData.data = action.payload.data;
        state.applicantTypesData.message = action.payload.message;
        state.applicantTypesData.loading = false;
        state.applicantTypesData.hasErrors = false;
      })
      .addCase(searchApplicantTypeData.rejected, (state, action) => {
        state.applicantTypesData.loading = false;
        state.applicantTypesData.hasErrors = true;
        state.applicantTypesData.message = action.error.message ?? '';
      })

      .addCase(createNewApplicantType.pending, (state) => {
        state.createApplicantType.loading = true;
      })
      .addCase(createNewApplicantType.fulfilled, (state, action) => {
        state.createApplicantType.loading = false;
        state.createApplicantType.hasErrors = false;
        state.createApplicantType.message = action.payload.message;
      })
      .addCase(createNewApplicantType.rejected, (state, action) => {
        state.createApplicantType.loading = false;
        state.createApplicantType.hasErrors = true;
        state.createApplicantType.message = action.error.message ?? '';
      })

      .addCase(editApplicantTypeById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editApplicantTypeById.fulfilled, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = false;
        state.editById.message = action.payload.message;
      })
      .addCase(editApplicantTypeById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(removeApplicantTypeById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeApplicantTypeById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeApplicantTypeById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      })

      .addCase(updateApplicantTypeStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateApplicantTypeStatus.fulfilled, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
        state.updateById.message = action.payload.message;
      })
      .addCase(updateApplicantTypeStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      });
  },
});

const selectApplicantTypeMasterRaw = (state: RootState) =>
  state.applicantTypeMaster;

export const applicantTypeMasterSelector = createSelector(
  [selectApplicantTypeMasterRaw],
  (s) => ({
    list: s.applicantTypesData,
    create: s.createApplicantType,
    edit: s.editById,
    remove: s.removeById,
    status: s.updateById,
  }),
);

export const { clearApplicantTypeMessage } = applicantTypeMasterSlice.actions;

export default applicantTypeMasterSlice.reducer;
