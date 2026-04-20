import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDepartmentStatus } from "../../services/departments/departments.model";
import departmentsService from "../../services/departments/departments.service";

export const removeDepartmentById = createAsyncThunk(
  "department/removeDepartmentById",
  async (id: number) => {
    return departmentsService.removeDepartmentById(id);
  }
);

export const updateDepartmentStatus = createAsyncThunk(
  "department/updateDepartmentStatus",
  async (data: IDepartmentStatus) => {
    return departmentsService.updateDepartmentStatus(data);
  }
);

export const editDepartmentById = createAsyncThunk(
  "department/editDepartmentById",
  async (data: any) => {
    return departmentsService.editDepartmentById(data);
  }
);

export const createNewDepartment = createAsyncThunk(
  "department/createNewDepartment",
  async (data: any) => {
    return departmentsService.createNewDepartment(data);
  }
);

export const searchDepartmentData = createAsyncThunk(
  "department/searchDepartmentData",
  async (data: any) => {
    return departmentsService.searchDepartmentData(data);
  }
);
