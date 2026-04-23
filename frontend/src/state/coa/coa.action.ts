import { createAsyncThunk } from "@reduxjs/toolkit";
import coaService, {
  type ICoaRecord,
} from "src/services/coa/coa.service";
import type { ICoaDetails, ICoaStatus } from "src/services/coa/coa.model";

export const searchCoaData = createAsyncThunk(
  "coaMaster/searchCoaData",
  async (data: any) => {
    return coaService.searchCoaData(data);
  },
);

export const createNewCoa = createAsyncThunk(
  "coaMaster/createNewCoa",
  async (data: ICoaDetails) => {
    return coaService.createNewCoa(data);
  },
);

export const editCoaById = createAsyncThunk(
  "coaMaster/editCoaById",
  async (data: ICoaRecord) => {
    return coaService.editCoaById(data);
  },
);

export const removeCoaById = createAsyncThunk(
  "coaMaster/removeCoaById",
  async (id: number) => {
    return coaService.removeCoaById(id);
  },
);

export const updateCoaStatus = createAsyncThunk(
  "coaMaster/updateCoaStatus",
  async (data: ICoaStatus) => {
    return coaService.updateCoaStatus(data);
  },
);
