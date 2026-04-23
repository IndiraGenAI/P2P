import { createAsyncThunk } from "@reduxjs/toolkit";
import coaCategoryService, {
  type ICoaCategoryRecord,
} from "src/services/coaCategory/coaCategory.service";
import type {
  ICoaCategoryDetails,
  ICoaCategoryStatus,
} from "src/services/coaCategory/coaCategory.model";

export const searchCoaCategoryData = createAsyncThunk(
  "coaCategoryMaster/searchCoaCategoryData",
  async (data: any) => {
    return coaCategoryService.searchCoaCategoryData(data);
  },
);

export const createNewCoaCategory = createAsyncThunk(
  "coaCategoryMaster/createNewCoaCategory",
  async (data: ICoaCategoryDetails) => {
    return coaCategoryService.createNewCoaCategory(data);
  },
);

export const editCoaCategoryById = createAsyncThunk(
  "coaCategoryMaster/editCoaCategoryById",
  async (data: ICoaCategoryRecord) => {
    return coaCategoryService.editCoaCategoryById(data);
  },
);

export const removeCoaCategoryById = createAsyncThunk(
  "coaCategoryMaster/removeCoaCategoryById",
  async (id: number) => {
    return coaCategoryService.removeCoaCategoryById(id);
  },
);

export const updateCoaCategoryStatus = createAsyncThunk(
  "coaCategoryMaster/updateCoaCategoryStatus",
  async (data: ICoaCategoryStatus) => {
    return coaCategoryService.updateCoaCategoryStatus(data);
  },
);
