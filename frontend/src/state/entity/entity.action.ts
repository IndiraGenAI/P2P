import { createAsyncThunk } from "@reduxjs/toolkit";
import entityService, {
  type IEntityRecord,
} from "src/services/entity/entity.service";
import type {
  IEntityDetails,
  IEntityStatus,
} from "src/services/entity/entity.model";

export const searchEntityData = createAsyncThunk(
  "entityMaster/searchEntityData",
  async (data: any) => {
    return entityService.searchEntityData(data);
  },
);

export const createNewEntity = createAsyncThunk(
  "entityMaster/createNewEntity",
  async (data: IEntityDetails) => {
    return entityService.createNewEntity(data);
  },
);

export const editEntityById = createAsyncThunk(
  "entityMaster/editEntityById",
  async (data: IEntityRecord) => {
    return entityService.editEntityById(data);
  },
);

export const removeEntityById = createAsyncThunk(
  "entityMaster/removeEntityById",
  async (id: number) => {
    return entityService.removeEntityById(id);
  },
);

export const updateEntityStatus = createAsyncThunk(
  "entityMaster/updateEntityStatus",
  async (data: IEntityStatus) => {
    return entityService.updateEntityStatus(data);
  },
);
