import { createAsyncThunk } from "@reduxjs/toolkit";
import { IZoneRecord } from "../../pages/Zone/Zone.model";
import { ISearchAllZoneDataPayload, IZoneDetails, IZoneStatus } from "../../services/zone/zone.model";
import zoneService from "../../services/zone/zone.service";

export const removeZoneById = createAsyncThunk(
  "zone/removeZoneById",
  async (id: number) => {
    return zoneService.removeZoneById(id);
  }
);

export const updateZoneStatus = createAsyncThunk(
  "zone/updateZoneStatus",
  async (data: IZoneStatus) => {
    return zoneService.updateZoneStatus(data);
  }
);

export const editZoneById = createAsyncThunk(
  "zone/editZoneById",
  async (data: IZoneRecord) => {
    return zoneService.editZoneById(data);
  }
);

export const createNewZone = createAsyncThunk(
  "zone/createNewZone",
  async (data: IZoneDetails) => {
    return zoneService.createNewZone(data);
  }
);

export const searchZoneData = createAsyncThunk(
  "zone/searchZoneData",
  async (data: any) => {
    return zoneService.searchZoneData(data);
  }
);

export const searchAllZoneData = createAsyncThunk(
  "zone/searchAllZoneData",
  async (data: ISearchAllZoneDataPayload) => {
    return zoneService.searchAllZoneData(data);
  }
);
