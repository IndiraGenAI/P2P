import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewCity,
  editCityById,
  removeCityById,
  searchCityData,
  updateCityStatus,
} from './city.action';
import type { ICityMasterState } from './city.model';

export const initialState: ICityMasterState = {
  citiesData: {
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
  createCity: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const cityMasterSlice = createSlice({
  name: 'cityMaster',
  initialState,
  reducers: {
    clearCityMessage: (state) => {
      state.citiesData.message = '';
      state.createCity.message = '';
      state.editById.message = '';
      state.removeById.message = '';
      state.updateById.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCityData.pending, (state) => {
        state.citiesData.loading = true;
      })
      .addCase(searchCityData.fulfilled, (state, action) => {
        state.citiesData.data = action.payload.data;
        state.citiesData.message = action.payload.message;
        state.citiesData.loading = false;
        state.citiesData.hasErrors = false;
      })
      .addCase(searchCityData.rejected, (state, action) => {
        state.citiesData.loading = false;
        state.citiesData.hasErrors = true;
        state.citiesData.message = action.error.message ?? '';
      })

      .addCase(createNewCity.pending, (state) => {
        state.createCity.loading = true;
      })
      .addCase(createNewCity.fulfilled, (state, action) => {
        state.createCity.message = action.payload.message;
        state.createCity.loading = false;
        state.createCity.hasErrors = false;
      })
      .addCase(createNewCity.rejected, (state, action) => {
        state.createCity.loading = false;
        state.createCity.hasErrors = true;
        state.createCity.message = action.error.message ?? '';
      })

      .addCase(editCityById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCityById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCityById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })

      .addCase(updateCityStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCityStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCityStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })

      .addCase(removeCityById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCityById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCityById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const cityMasterSelector = (state: RootState) => state.cityMaster;
export const { clearCityMessage } = cityMasterSlice.actions;

export default cityMasterSlice.reducer;
