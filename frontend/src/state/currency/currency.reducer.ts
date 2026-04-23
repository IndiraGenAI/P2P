import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app.model";
import {
  createNewCurrency,
  editCurrencyById,
  removeCurrencyById,
  searchCurrencyData,
  updateCurrencyStatus,
} from "./currency.action";
import type { ICurrencyMasterState } from "./currency.model";

export const initialState: ICurrencyMasterState = {
  currenciesData: {
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
  createCurrency: { loading: false, hasErrors: false, message: "" },
  editById: { loading: false, hasErrors: false, message: "" },
  removeById: { loading: false, hasErrors: false, message: "" },
  updateById: { loading: false, hasErrors: false, message: "" },
};

export const currencyMasterSlice = createSlice({
  name: "currencyMaster",
  initialState,
  reducers: {
    clearCurrencyMessage: (state) => {
      state.currenciesData.message = "";
      state.createCurrency.message = "";
      state.editById.message = "";
      state.removeById.message = "";
      state.updateById.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCurrencyData.pending, (state) => {
        state.currenciesData.loading = true;
      })
      .addCase(searchCurrencyData.fulfilled, (state, action) => {
        state.currenciesData.data = action.payload.data;
        state.currenciesData.message = action.payload.message;
        state.currenciesData.loading = false;
        state.currenciesData.hasErrors = false;
      })
      .addCase(searchCurrencyData.rejected, (state, action) => {
        state.currenciesData.loading = false;
        state.currenciesData.hasErrors = true;
        state.currenciesData.message = action.error.message ?? "";
      })

      .addCase(createNewCurrency.pending, (state) => {
        state.createCurrency.loading = true;
      })
      .addCase(createNewCurrency.fulfilled, (state, action) => {
        state.createCurrency.message = action.payload.message;
        state.createCurrency.loading = false;
        state.createCurrency.hasErrors = false;
      })
      .addCase(createNewCurrency.rejected, (state, action) => {
        state.createCurrency.loading = false;
        state.createCurrency.hasErrors = true;
        state.createCurrency.message = action.error.message ?? "";
      })

      .addCase(editCurrencyById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editCurrencyById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editCurrencyById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? "";
      })

      .addCase(updateCurrencyStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateCurrencyStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateCurrencyStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? "";
      })

      .addCase(removeCurrencyById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeCurrencyById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeCurrencyById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? "";
      });
  },
});

export const currencyMasterSelector = (state: RootState) => state.currencyMaster;
export const { clearCurrencyMessage } = currencyMasterSlice.actions;

export default currencyMasterSlice.reducer;
