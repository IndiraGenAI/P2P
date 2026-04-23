import { createAsyncThunk } from "@reduxjs/toolkit";
import departmentService, {
  type IDepartmentRecord,
} from "src/services/department/department.service";
import type {
  IDepartmentDetails,
  IDepartmentStatus,
} from "src/services/department/department.model";

export const searchDepartmentData = createAsyncThunk(
  "departmentMaster/searchDepartmentData",
  async (data: any) => {
    return departmentService.searchDepartmentData(data);
  },
);

export const createNewDepartment = createAsyncThunk(
  "departmentMaster/createNewDepartment",
  async (data: IDepartmentDetails) => {
    return departmentService.createNewDepartment(data);
  },
);

export const editDepartmentById = createAsyncThunk(
  "departmentMaster/editDepartmentById",
  async (data: IDepartmentRecord) => {
    return departmentService.editDepartmentById(data);
  },
);

export const removeDepartmentById = createAsyncThunk(
  "departmentMaster/removeDepartmentById",
  async (id: number) => {
    return departmentService.removeDepartmentById(id);
  },
);

export const updateDepartmentStatus = createAsyncThunk(
  "departmentMaster/updateDepartmentStatus",
  async (data: IDepartmentStatus) => {
    return departmentService.updateDepartmentStatus(data);
  },
);
