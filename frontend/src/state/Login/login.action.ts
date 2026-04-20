import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  IChangePasswordField,
  IForgotPasswordChangeField,
  IForgotPasswordFormField,
  ILoginFormField,
  IResetPasswordDTO,
  IStudentPortalVerify,
} from "src/services/login/login.model";
import loginService from "src/services/login/login.service";

export const loginUserData = createAsyncThunk(
  "login/loginUserData",
  async (data: ILoginFormField) => {
    return loginService.authUser(data);
  }
);

export const logoutUser = createAsyncThunk("login/logout", async () => {
  return loginService.logout();
});

export const forcePasswordChange = createAsyncThunk(
  "login/forcePasswordChange",
  async (data: IResetPasswordDTO) => {
    return loginService.forcePasswordChange(data);
  }
);

export const forgotPasswordChange = createAsyncThunk(
  "login/forgotPasswordChange",
  async (data: IForgotPasswordChangeField) => {
    return loginService.forgotPasswordChange(data);
  }
);

export const forgotPassword = createAsyncThunk(
  "login/forgotPassword",
  async (data: IForgotPasswordFormField) => {
    return loginService.forgotPassword(data);
  }
);

export const studentPortal = createAsyncThunk(
  "login/student-portal",
  async (data: IStudentPortalVerify) => {
    return loginService.studentPortal(data);
  }
);

export const changePassword = createAsyncThunk(
  "login/changePassword",
  async (data: IChangePasswordField) => {
    return loginService.changePassword(data);
  }
);
