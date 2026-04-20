import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  createNewDepartment,
  editDepartmentById,
  removeDepartmentById,
  searchDepartmentData,
  updateDepartmentStatus,
} from "./department.action";
import { IDepartmentState } from "./department.model";

export const initialState: IDepartmentState = {
  removeById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  updateById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  editById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  createDepartments: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  departmentsData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      rows: [],
      meta: {
        take: 0,
        itemCount: 0,
        pageCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    },
  },
};

export const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = "";
      state.updateById.message = "";
      state.editById.message = "";
      state.createDepartments.message = "";
      state.departmentsData.message = "";
    },
  },
  extraReducers: {
    [removeDepartmentById.pending.type]: (state) => {
      state.removeById.loading = true;
    },
    [removeDepartmentById.fulfilled.type]: (state, action) => {
      state.removeById.message = action.payload.message;
      state.removeById.loading = false;
      state.removeById.hasErrors = false;
    },
    [removeDepartmentById.rejected.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = true;
      state.removeById.message = action.error.message;
    },

    [updateDepartmentStatus.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [updateDepartmentStatus.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [updateDepartmentStatus.rejected.type]: (state, action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message = action.error.message;
    },

    [editDepartmentById.pending.type]: (state) => {
      state.editById.loading = true;
    },
    [editDepartmentById.fulfilled.type]: (state, action) => {
      state.editById.message = action.payload.message;
      state.editById.loading = false;
      state.editById.hasErrors = false;
    },
    [editDepartmentById.rejected.type]: (state, action) => {
      state.editById.loading = false;
      state.editById.hasErrors = true;
      state.editById.message = action.error.message;
    },

    [createNewDepartment.pending.type]: (state) => {
      state.createDepartments.loading = true;
    },
    [createNewDepartment.fulfilled.type]: (state, action) => {
      state.createDepartments.message = action.payload.message;
      state.createDepartments.loading = false;
      state.createDepartments.hasErrors = false;
    },
    [createNewDepartment.rejected.type]: (state, action) => {
      state.createDepartments.loading = false;
      state.createDepartments.hasErrors = true;
      state.createDepartments.message = action.error.message;
    },

    [searchDepartmentData.pending.type]: (state) => {
      state.departmentsData.loading = true;
    },
    [searchDepartmentData.fulfilled.type]: (state, action) => {
      state.departmentsData.data = action.payload.data;
      state.departmentsData.message = action.payload.message;
      state.departmentsData.loading = false;
      state.departmentsData.hasErrors = false;
    },
    [searchDepartmentData.rejected.type]: (state, action) => {
      state.departmentsData.loading = false;
      state.departmentsData.hasErrors = true;
      state.departmentsData.message = action.error.message;
    },
  },
});

// A selector
export const departmentSelector = (state: RootState) => state.departments;

export const { clearRemoveMessage } = departmentSlice.actions;

// The reducer
export default departmentSlice.reducer;
