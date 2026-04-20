import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  forcePasswordChange,
  forgotPassword,
  forgotPasswordChange,
  loginUserData,
  logoutUser,
  studentPortal,
  changePassword,
} from "./login.action";
import { ILoginState } from "./login.model";

export const initialState: ILoginState = {
  userData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      user: [],
    },
    configData: {
      cognitoUserId: {},
      refreshToken: {},
      accessToken: {},
    },
  },
  logout: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  forcePasswordChange: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  forgotPasswordChange: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  forgotPassword: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  userRoleId: 0,
  isBranchSelected: false,
  studentPortal: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  changePassword: {
    loading: false,
    hasErrors: false,
    message: "",
  },
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.userData.message = "";
      state.logout.message = "";
      state.forcePasswordChange.message = "";
      state.forgotPasswordChange.message = "";
      state.forgotPassword.message = "";
    },
    setUserRoleId: (state, action) => {
      state.userRoleId = action.payload;
    },
    setIsBranchSelected: (state, action) => {
      state.isBranchSelected = action.payload;
    },
  },

  extraReducers: {
    // login
    [loginUserData.pending.type]: (state) => {
      state.userData.loading = true;
    },
    [loginUserData.fulfilled.type]: (state, action) => {
      state.userData.configData = action.payload.user.signInUserSession;
      state.userData.data = action.payload.user;
      state.userData.message = action.payload.message;
      state.userData.loading = false;
      state.userData.hasErrors = false;
    },
    [loginUserData.rejected.type]: (state, action) => {
      state.userData.loading = false;
      state.userData.hasErrors = true;
      state.userData.message = action.error.message;
    },

    // logout
    [logoutUser.pending.type]: (state) => {
      state.logout.loading = true;
    },
    [logoutUser.fulfilled.type]: (state, action) => {
      state.logout.loading = false;
      state.logout.hasErrors = false;
      state.isBranchSelected = false;
      state.userRoleId = 0;
    },
    [logoutUser.rejected.type]: (state, action) => {
      state.logout.loading = false;
      state.logout.hasErrors = true;
      state.logout.message = action.error.message;
    },

    // forcePasswordChange
    [forcePasswordChange.pending.type]: (state) => {
      state.forcePasswordChange.loading = true;
    },
    [forcePasswordChange.fulfilled.type]: (state, action) => {
      state.forcePasswordChange.message = action.payload.message;
      state.forcePasswordChange.loading = false;
      state.forcePasswordChange.hasErrors = false;
    },
    [forcePasswordChange.rejected.type]: (state, action) => {
      state.forcePasswordChange.loading = false;
      state.forcePasswordChange.hasErrors = true;
      state.forcePasswordChange.message = action.error.message;
    },

    // forgotPasswordChange
    [forgotPasswordChange.pending.type]: (state) => {
      state.forgotPasswordChange.loading = true;
    },
    [forgotPasswordChange.fulfilled.type]: (state, action) => {
      state.forgotPasswordChange.message = action.payload.message;
      state.forgotPasswordChange.loading = false;
      state.forgotPasswordChange.hasErrors = false;
    },
    [forgotPasswordChange.rejected.type]: (state, action) => {
      state.forgotPasswordChange.loading = false;
      state.forgotPasswordChange.hasErrors = true;
      state.forgotPasswordChange.message = action.error.message;
    },

    // forgotPassword
    [forgotPassword.pending.type]: (state) => {
      state.forgotPassword.loading = true;
    },
    [forgotPassword.fulfilled.type]: (state, action) => {
      state.forgotPassword.message = action.payload.message;
      state.forgotPassword.loading = false;
      state.forgotPassword.hasErrors = false;
    },
    [forgotPassword.rejected.type]: (state, action) => {
      state.forgotPassword.loading = false;
      state.forgotPassword.hasErrors = true;
      state.forgotPassword.message = action.error.message;
    },

    // student portal login
    [studentPortal.pending.type]: (state) => {
      state.studentPortal.loading = true;
    },
    [studentPortal.fulfilled.type]: (state, action) => {
      state.studentPortal.message = action.payload.message;
      state.studentPortal.loading = false;
      state.studentPortal.hasErrors = false;
    },
    [studentPortal.rejected.type]: (state, action) => {
      state.studentPortal.loading = false;
      state.studentPortal.hasErrors = true;
      state.studentPortal.message = action.error.message;
    },

    // change password login
    [changePassword.pending.type]: (state) => {
      state.changePassword.loading = true;
    },
    [changePassword.fulfilled.type]: (state, action) => {
      state.changePassword.message = action.payload.message;
      state.changePassword.loading = false;
      state.changePassword.hasErrors = false;
    },
    [changePassword.rejected.type]: (state, action) => {
      state.changePassword.loading = false;
      state.changePassword.hasErrors = true;
      state.changePassword.message = action.error.message;
    },
  },
});

// A selector
export const loginSelector = (state: RootState) => state.login;

export const { clearRemoveMessage, setUserRoleId, setIsBranchSelected } =
  loginSlice.actions;

// The reducer
export default loginSlice.reducer;
