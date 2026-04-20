import { createAsyncThunk } from "@reduxjs/toolkit";
import commonModuleService from "src/services/commonModule/commonModule.service";
import { Configurations } from "src/utils/constants/constant";

export const searchCommonModuleData = createAsyncThunk(
  "commonModule/searchCommonModuleData",
  async (data: any) => {
    return commonModuleService.searchCommonModuleData(data);
  }
);

export const getConfigurationsDetailsByCode = createAsyncThunk(
  "commonModule/getConfigurationsDetailsByCode",
 async (data:Configurations[]) => {
  return commonModuleService.getConfigurationsDetailsByCode(data);
 }
)
