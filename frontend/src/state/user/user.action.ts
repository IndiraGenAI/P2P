import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  IUserCreatePayload,
  IUserStatus,
  IUserUpdatePayload,
} from "src/services/user/user.model";
import userService from "src/services/user/user.service";

export const searchUserData = createAsyncThunk(
  "user/searchUserData",
  async (data: unknown) => {
    return userService.searchUserData(data);
  },
);

export const createNewUser = createAsyncThunk(
  "user/createNewUser",
  async (data: IUserCreatePayload) => {
    return userService.createNewUser(data);
  },
);

export const editUserById = createAsyncThunk(
  "user/editUserById",
  async (data: IUserUpdatePayload) => {
    return userService.editUserById(data);
  },
);

export const removeUserById = createAsyncThunk(
  "user/removeUserById",
  async (id: number) => {
    return userService.removeUserById(id);
  },
);

export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async (data: IUserStatus) => {
    return userService.updateUserStatus(data);
  },
);
