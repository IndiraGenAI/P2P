import { createAsyncThunk } from "@reduxjs/toolkit";
import tdsService, {
  type ITdsRecord,
} from "src/services/tds/tds.service";
import type {
  ITdsDetails,
  ITdsStatus,
} from "src/services/tds/tds.model";

export const searchTdsData = createAsyncThunk(
  "tdsMaster/searchTdsData",
  async (data: any) => {
    return tdsService.searchTdsData(data);
  },
);

export const createNewTds = createAsyncThunk(
  "tdsMaster/createNewTds",
  async (data: ITdsDetails) => {
    return tdsService.createNewTds(data);
  },
);

export const editTdsById = createAsyncThunk(
  "tdsMaster/editTdsById",
  async (data: ITdsRecord) => {
    return tdsService.editTdsById(data);
  },
);

export const removeTdsById = createAsyncThunk(
  "tdsMaster/removeTdsById",
  async (id: number) => {
    return tdsService.removeTdsById(id);
  },
);

export const updateTdsStatus = createAsyncThunk(
  "tdsMaster/updateTdsStatus",
  async (data: ITdsStatus) => {
    return tdsService.updateTdsStatus(data);
  },
);
