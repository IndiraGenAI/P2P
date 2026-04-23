import { createAsyncThunk } from "@reduxjs/toolkit";
import centerService, {
  type ICenterRecord,
} from "src/services/center/center.service";
import type {
  ICenterDetails,
  ICenterStatus,
} from "src/services/center/center.model";

export const searchCenterData = createAsyncThunk(
  "centerMaster/searchCenterData",
  async (data: any) => {
    return centerService.searchCenterData(data);
  },
);

export const createNewCenter = createAsyncThunk(
  "centerMaster/createNewCenter",
  async (data: ICenterDetails) => {
    return centerService.createNewCenter(data);
  },
);

export const editCenterById = createAsyncThunk(
  "centerMaster/editCenterById",
  async (data: ICenterRecord) => {
    return centerService.editCenterById(data);
  },
);

export const removeCenterById = createAsyncThunk(
  "centerMaster/removeCenterById",
  async (id: number) => {
    return centerService.removeCenterById(id);
  },
);

export const updateCenterStatus = createAsyncThunk(
  "centerMaster/updateCenterStatus",
  async (data: ICenterStatus) => {
    return centerService.updateCenterStatus(data);
  },
);
