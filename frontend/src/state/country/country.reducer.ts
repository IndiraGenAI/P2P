import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewCountry,
  editCountryById,
  removeCountryById,
  searchCountryData,
  updateCountryStatus,
} from './country.action';
import type { ICountryState } from './country.model';

export const initialState: ICountryState = {
  countriesData: {
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
  createCountry: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    clearCountryMessage: (state) => {
      state.countriesData.message = '';
      state.createCountry.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCountryData.pending, (state) => {
        state.countriesData.loading = true;
      })
      .addCase(searchCountryData.fulfilled, (state, action) => {
        state.countriesData.data = action.payload.data;
        state.countriesData.message = action.payload.message;
        state.countriesData.loading = false;
        state.countriesData.hasErrors = false;
      })
      .addCase(searchCountryData.rejected, (state, action) => {
        state.countriesData.loading = false;
        state.countriesData.hasErrors = true;
        state.countriesData.message = action.error.message ?? '';
      })

      .addCase(createNewCountry.pending, (state) => {
        state.createCountry.loading = true;
      })
      .addCase(createNewCountry.fulfilled, (state, action) => {
        state.createCountry.message = action.payload.message;
        state.createCountry.loading = false;
        state.createCountry.hasErrors = false;
      })
      .addCase(createNewCountry.rejected, (state, action) => {
        state.createCountry.loading = false;
        state.createCountry.hasErrors = true;
        state.createCountry.message = action.error.message ?? '';
      })

      .addCase(editCountryById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCountryById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCountryById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateCountryStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCountryStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCountryStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeCountryById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCountryById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCountryById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const countrySelector = (state: RootState) => state.country;
export const { clearCountryMessage } = countrySlice.actions;

export default countrySlice.reducer;
