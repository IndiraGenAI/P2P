import { createAsyncThunk } from "@reduxjs/toolkit";
import zoneService, {
  type IZoneRecord,
} from "src/services/zone/zone.service";
import type {
  IZoneDetails,
  IZoneStatus,
} from "src/services/zone/zone.model";

export const searchZoneData = createAsyncThunk(
  "zoneMaster/searchZoneData",
  async (data: any) => {
    return zoneService.searchZoneData(data);
  },
);

export const createNewZone = createAsyncThunk(
  "zoneMaster/createNewZone",
  async (data: IZoneDetails) => {
    return zoneService.createNewZone(data);
  },
);

export const editZoneById = createAsyncThunk(
  "zoneMaster/editZoneById",
  async (data: IZoneRecord) => {
    return zoneService.editZoneById(data);
  },
);

export const removeZoneById = createAsyncThunk(
  "zoneMaster/removeZoneById",
  async (id: number) => {
    return zoneService.removeZoneById(id);
  },
);

export const updateZoneStatus = createAsyncThunk(
  "zoneMaster/updateZoneStatus",
  async (data: IZoneStatus) => {
    return zoneService.updateZoneStatus(data);
  },
);
