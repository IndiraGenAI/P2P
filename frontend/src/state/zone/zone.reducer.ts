import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  createNewZone,
  editZoneById,
  removeZoneById,
  searchAllZoneData,
  searchZoneData,
  updateZoneStatus,
} from "./zone.action";
import { IZoneState } from "./zone.model";

export const initialState: IZoneState = {
  removeById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  updateById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  editById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  createZones: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  zonesData: {
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
  allZonesData: {
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
};

export const zoneSlice = createSlice({
  name: "zone",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = "";
      state.updateById.message="";
      state.editById.message="";
      state.createZones.message="";
    },
  },
  extraReducers: {

    // zoneDelete
    [removeZoneById.pending.type]: (state) => {
      state.removeById.loading = true;
    },
    [removeZoneById.fulfilled.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = false;
      state.removeById.message = action.payload.message;
    },
    [removeZoneById.rejected.type]: (state,action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = true;
      state.removeById.message =action.error.message;
    },


//zone update
    [updateZoneStatus.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [updateZoneStatus.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [updateZoneStatus.rejected.type]: (state,action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message =action.error.message;
    },

    //zoneedit
    [editZoneById.pending.type]: (state) => {
      state.editById.loading = true;
    },
    [editZoneById.fulfilled.type]: (state, action) => {
      state.editById.message = action.payload.message;
      state.editById.loading = false;
      state.editById.hasErrors = false;
    },
    [editZoneById.rejected.type]: (state,action) => {
      state.editById.loading = false;
      state.editById.hasErrors = true;
      state.editById.message = action.error.message;
    },

    //zone create
    [createNewZone.pending.type]: (state) => {
      state.createZones.loading = true;
    },
    [createNewZone.fulfilled.type]: (state, action) => {
      state.createZones.message = action.payload.message;
      state.createZones.hasErrors = action.payload.error;
      state.createZones.loading = false;
      state.createZones.hasErrors = false;

    },
    [createNewZone.rejected.type]: (state,action) => {
      state.createZones.loading = false;
      state.createZones.hasErrors = true;
      state.createZones.message = action.error.message;
    },

    [searchZoneData.pending.type]: (state) => {
      state.zonesData.loading = true;
    },
    [searchZoneData.fulfilled.type]: (state, action) => {
      state.zonesData.data = action.payload.data;
      state.zonesData.message = action.payload.message;
      state.zonesData.loading = false;
      state.zonesData.hasErrors = false;
    },
    [searchZoneData.rejected.type]: (state,action) => {
      state.zonesData.loading = false;
      state.zonesData.hasErrors = true;
      state.zonesData.message =action.error.message;
    },
    
    // search All Zone Data
    [searchAllZoneData.pending.type]: (state) => {
      state.allZonesData.loading = true;
    },
    [searchAllZoneData.fulfilled.type]: (state, action) => {
      state.allZonesData.data = action.payload.data;
      state.allZonesData.message = action.payload.message;
      state.allZonesData.loading = false;
      state.allZonesData.hasErrors = false;
    },
    [searchAllZoneData.rejected.type]: (state,action) => {
      state.allZonesData.loading = false;
      state.allZonesData.hasErrors = true;
      state.allZonesData.message =action.error.message;
    },
  },
});

// A selector
export const zoneSelector = (state: RootState) => state.zone;

export const { clearRemoveMessage } = zoneSlice.actions;

// The reducer
export default zoneSlice.reducer;
