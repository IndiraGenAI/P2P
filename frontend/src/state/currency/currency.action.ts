import { createAsyncThunk } from "@reduxjs/toolkit";
import currencyService, {
  type ICurrencyRecord,
} from "src/services/currency/currency.service";
import type {
  ICurrencyDetails,
  ICurrencyStatus,
} from "src/services/currency/currency.model";

export const searchCurrencyData = createAsyncThunk(
  "currencyMaster/searchCurrencyData",
  async (data: any) => {
    return currencyService.searchCurrencyData(data);
  },
);

export const createNewCurrency = createAsyncThunk(
  "currencyMaster/createNewCurrency",
  async (data: ICurrencyDetails) => {
    return currencyService.createNewCurrency(data);
  },
);

export const editCurrencyById = createAsyncThunk(
  "currencyMaster/editCurrencyById",
  async (data: ICurrencyRecord) => {
    return currencyService.editCurrencyById(data);
  },
);

export const removeCurrencyById = createAsyncThunk(
  "currencyMaster/removeCurrencyById",
  async (id: number) => {
    return currencyService.removeCurrencyById(id);
  },
);

export const updateCurrencyStatus = createAsyncThunk(
  "currencyMaster/updateCurrencyStatus",
  async (data: ICurrencyStatus) => {
    return currencyService.updateCurrencyStatus(data);
  },
);
