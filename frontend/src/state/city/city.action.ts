import { createAsyncThunk } from "@reduxjs/toolkit";
import cityService, {
  type ICityRecord,
} from "src/services/city/city.service";
import type {
  ICityDetails,
  ICityStatus,
} from "src/services/city/city.model";

export const searchCityData = createAsyncThunk(
  "cityMaster/searchCityData",
  async (data: any) => {
    return cityService.searchCityData(data);
  },
);

export const createNewCity = createAsyncThunk(
  "cityMaster/createNewCity",
  async (data: ICityDetails) => {
    return cityService.createNewCity(data);
  },
);

export const editCityById = createAsyncThunk(
  "cityMaster/editCityById",
  async (data: ICityRecord) => {
    return cityService.editCityById(data);
  },
);

export const removeCityById = createAsyncThunk(
  "cityMaster/removeCityById",
  async (id: number) => {
    return cityService.removeCityById(id);
  },
);

export const updateCityStatus = createAsyncThunk(
  "cityMaster/updateCityStatus",
  async (data: ICityStatus) => {
    return cityService.updateCityStatus(data);
  },
);
