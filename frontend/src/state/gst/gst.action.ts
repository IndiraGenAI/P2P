import { createAsyncThunk } from "@reduxjs/toolkit";
import gstService, {
  type IGstRecord,
} from "src/services/gst/gst.service";
import type {
  IGstDetails,
  IGstStatus,
} from "src/services/gst/gst.model";

export const searchGstData = createAsyncThunk(
  "gstMaster/searchGstData",
  async (data: any) => {
    return gstService.searchGstData(data);
  },
);

export const createNewGst = createAsyncThunk(
  "gstMaster/createNewGst",
  async (data: IGstDetails) => {
    return gstService.createNewGst(data);
  },
);

export const editGstById = createAsyncThunk(
  "gstMaster/editGstById",
  async (data: IGstRecord) => {
    return gstService.editGstById(data);
  },
);

export const removeGstById = createAsyncThunk(
  "gstMaster/removeGstById",
  async (id: number) => {
    return gstService.removeGstById(id);
  },
);

export const updateGstStatus = createAsyncThunk(
  "gstMaster/updateGstStatus",
  async (data: IGstStatus) => {
    return gstService.updateGstStatus(data);
  },
);
