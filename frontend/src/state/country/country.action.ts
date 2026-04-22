import { createAsyncThunk } from "@reduxjs/toolkit";
import countryService, {
  type ICountryRecord,
} from "src/services/country/country.service";
import type {
  ICountryDetails,
  ICountryStatus,
} from "src/services/country/country.model";

export const searchCountryData = createAsyncThunk(
  "country/searchCountryData",
  async (data: any) => {
    return countryService.searchCountryData(data);
  },
);

export const createNewCountry = createAsyncThunk(
  "country/createNewCountry",
  async (data: ICountryDetails) => {
    return countryService.createNewCountry(data);
  },
);

export const editCountryById = createAsyncThunk(
  "country/editCountryById",
  async (data: ICountryRecord) => {
    return countryService.editCountryById(data);
  },
);

export const removeCountryById = createAsyncThunk(
  "country/removeCountryById",
  async (id: number) => {
    return countryService.removeCountryById(id);
  },
);

export const updateCountryStatus = createAsyncThunk(
  "country/updateCountryStatus",
  async (data: ICountryStatus) => {
    return countryService.updateCountryStatus(data);
  },
);
