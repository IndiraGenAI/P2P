import { createAsyncThunk } from "@reduxjs/toolkit";
import stateService, {
  type IStateRecord,
} from "src/services/state/state.service";
import type {
  IStateDetails,
  IStateStatus,
} from "src/services/state/state.model";

export const searchStateData = createAsyncThunk(
  "stateMaster/searchStateData",
  async (data: any) => {
    return stateService.searchStateData(data);
  },
);

export const createNewState = createAsyncThunk(
  "stateMaster/createNewState",
  async (data: IStateDetails) => {
    return stateService.createNewState(data);
  },
);

export const editStateById = createAsyncThunk(
  "stateMaster/editStateById",
  async (data: IStateRecord) => {
    return stateService.editStateById(data);
  },
);

export const removeStateById = createAsyncThunk(
  "stateMaster/removeStateById",
  async (id: number) => {
    return stateService.removeStateById(id);
  },
);

export const updateStateStatus = createAsyncThunk(
  "stateMaster/updateStateStatus",
  async (data: IStateStatus) => {
    return stateService.updateStateStatus(data);
  },
);
