import { createAsyncThunk } from "@reduxjs/toolkit";
import costCenterService, {
  type ICostCenterRecord,
} from "src/services/cost-center/cost-center.service";
import type {
  ICostCenterDetails,
  ICostCenterStatus,
} from "src/services/cost-center/cost-center.model";

export const searchCostCenterData = createAsyncThunk(
  "costCenterMaster/searchCostCenterData",
  async (data: any) => {
    return costCenterService.searchCostCenterData(data);
  },
);

export const createNewCostCenter = createAsyncThunk(
  "costCenterMaster/createNewCostCenter",
  async (data: ICostCenterDetails) => {
    return costCenterService.createNewCostCenter(data);
  },
);

export const editCostCenterById = createAsyncThunk(
  "costCenterMaster/editCostCenterById",
  async (data: ICostCenterRecord) => {
    return costCenterService.editCostCenterById(data);
  },
);

export const removeCostCenterById = createAsyncThunk(
  "costCenterMaster/removeCostCenterById",
  async (id: number) => {
    return costCenterService.removeCostCenterById(id);
  },
);

export const updateCostCenterStatus = createAsyncThunk(
  "costCenterMaster/updateCostCenterStatus",
  async (data: ICostCenterStatus) => {
    return costCenterService.updateCostCenterStatus(data);
  },
);
