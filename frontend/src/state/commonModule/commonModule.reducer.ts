import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  getConfigurationsDetailsByCode,
  searchCommonModuleData,
} from "./commonModule.action";
import { ICommonModuleState } from "./commonModule.model";

export const initialState: ICommonModuleState = {
  commonModulesData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {country:[],area:[],city:[],state:[]}
  },
  configurationsData:{
    loading: false,
    hasErrors: false,
    message: "",
    data:[]
  }

};

export const commonModuleSlice = createSlice({
  name: "commonModule",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.configurationsData.message="";
    },
  },
  extraReducers: {
    //get commonmodule
    [searchCommonModuleData.pending.type]: (state) => {
      state.commonModulesData.loading = true;
    },
    [searchCommonModuleData.fulfilled.type]: (state, action) => {
      state.commonModulesData.data = action.payload.data;
      state.commonModulesData.message = action.payload.message;
      state.commonModulesData.loading = false;
      state.commonModulesData.hasErrors = false;
    },
    [searchCommonModuleData.rejected.type]: (state, action) => {
      state.commonModulesData.loading = false;
      state.commonModulesData.hasErrors = true;
      state.commonModulesData.message = action.error.message;
    },

    //get configurations details by codes
    [getConfigurationsDetailsByCode.pending.type]: (state) => {
      state.configurationsData.loading = true;
    },
    [getConfigurationsDetailsByCode.fulfilled.type]: (state, action) => {
      state.configurationsData.data = action.payload.data;
      state.configurationsData.message = action.payload.message;
      state.configurationsData.loading = false;
      state.configurationsData.hasErrors = false;
    },
    [getConfigurationsDetailsByCode.rejected.type]: (state, action) => {
      state.configurationsData.loading = false;
      state.configurationsData.hasErrors = true;
      state.configurationsData.message = action.error.message;
    },
  },
});

// A selector
export const commonModuleSelector = (state: RootState) => state.commonModule;

// The reducer
export default commonModuleSlice.reducer;
