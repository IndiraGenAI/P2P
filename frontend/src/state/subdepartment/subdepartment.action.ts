import { createAsyncThunk } from "@reduxjs/toolkit";
import subdepartmentService, {
  type ISubdepartmentRecord,
} from "src/services/subdepartment/subdepartment.service";
import type {
  ISubdepartmentDetails,
  ISubdepartmentStatus,
} from "src/services/subdepartment/subdepartment.model";

export const searchSubdepartmentData = createAsyncThunk(
  "subdepartmentMaster/searchSubdepartmentData",
  async (data: any) => {
    return subdepartmentService.searchSubdepartmentData(data);
  },
);

export const createNewSubdepartment = createAsyncThunk(
  "subdepartmentMaster/createNewSubdepartment",
  async (data: ISubdepartmentDetails) => {
    return subdepartmentService.createNewSubdepartment(data);
  },
);

export const editSubdepartmentById = createAsyncThunk(
  "subdepartmentMaster/editSubdepartmentById",
  async (data: ISubdepartmentRecord) => {
    return subdepartmentService.editSubdepartmentById(data);
  },
);

export const removeSubdepartmentById = createAsyncThunk(
  "subdepartmentMaster/removeSubdepartmentById",
  async (id: number) => {
    return subdepartmentService.removeSubdepartmentById(id);
  },
);

export const updateSubdepartmentStatus = createAsyncThunk(
  "subdepartmentMaster/updateSubdepartmentStatus",
  async (data: ISubdepartmentStatus) => {
    return subdepartmentService.updateSubdepartmentStatus(data);
  },
);
