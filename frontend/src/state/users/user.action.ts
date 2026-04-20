import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUserRecord } from "src/pages/User/Users.model";
import {
  IFacultyUtilizationFilters,
  IUserConfig,
  IUserStatus,
} from "src/services/user/user.model";
import userService from "src/services/user/user.service";

export const searchUserData = createAsyncThunk(
  "user/searchUserData",
  async (data: any) => {
    return userService.searchUserData(data);
  }
);
export const createNewUser = createAsyncThunk(
  "user/createNewUser",
  async (data: IUserRecord) => {
    return userService.createNewUser(data);
  }
);
export const editUserById = createAsyncThunk(
  "user/editUserById",
  async (data: IUserRecord) => {
    return userService.editUserById(data);
  }
);
export const removeUserById = createAsyncThunk(
  "user/removeUserById",
  async (id: number) => {
    return userService.removeUserById(id);
  }
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async (data: IUserStatus) => {
    return userService.updateUserStatus(data);
  }
);

export const userProfile = createAsyncThunk(
  "user/userProfile",
  async (header?: Record<string, unknown>) => {
    const userData = await userService.userProfile(header);
    return userData;
  }
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data: { [key: string]: string }) => {
    return userService.changePassword(data);
  }
);

export const resetUserPassword = createAsyncThunk(
  "user/resetUserPassword",
  async (id: number) => {
    return userService.resetUserPassword(id);
  }
);

export const branchWiseUsers = createAsyncThunk(
  "user/branchWiseUsers",
  async (data: number) => {
    return userService.branchWiseUsers(data);
  }
);

export const getUserDetailsById = createAsyncThunk(
  "user/getUserDetailsById",
  async (id: number) => {
    return userService.getUserDetailsById(id);
  }
);

export const updateUserConfig = createAsyncThunk(
  "user/updateUserConfig",
  async (data: IUserConfig) => {
    return userService.updateUserConfig(data);
  }
);

export const getFacultyUtilization = createAsyncThunk(
  "user/getFacultyUtilization",
  async (data: IFacultyUtilizationFilters) => {
    return userService.getFacultyUtilization(data);
  }
);

export const getFacultyWiseLectureCount = createAsyncThunk(
  "user/getFacultyWiseLectureCount",
  async (data: URLSearchParams | {}) => {
    return userService.getFacultyWiseLectureCount(data);
  }
);
