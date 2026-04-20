import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app.model";
import {
  branchWiseUsers,
  changePassword,
  createNewUser,
  editUserById,
  getUserDetailsById,
  removeUserById,
  searchUserData,
  updateUserConfig,
  updateUserStatus,
  resetUserPassword,
  userProfile,
  getFacultyUtilization,
  getFacultyWiseLectureCount
} from "./user.action";
import { IUserState } from "./user.model";

export const initialState: IUserState = {
  usersData: {
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
  createUsers: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  editById: {
    loading: false,
    hasErrors: false,
    message: "",
  },
  updateUserConfig: {
    loading: false,
    hasErrors: false,
    message: "",
  },
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
  userData: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      first_name: "",
      last_name: "",
      email: "",
      hash: "",
      phone: "",
      last_seen: "",
      created_date: "",
      modified_date: "",
      id: 0,
      created_by: null,
      updated_by: null,
      status: "",
      user_roles: [],
    },
  },
  changePassword: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      user: [],
    },
  },
  branchwiseusersData: {
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
  getUserDetailsById: {
    loading: false,
    hasErrors: false,
    message: "",
    data: {
      first_name: "",
      last_name: "",
      email: "",
      hash: "",
      phone: "",
      last_seen: "",
      created_date: "",
      modified_date: "",
      id: 0,
      created_by: null,
      updated_by: null,
      status: "",
      user_roles: [],
    },
  },
  getFacultyUtilization: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
  getFacultyWiseLectureCount: {
    loading: false,
    hasErrors: false,
    message: "",
    data: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearRemoveMessage: (state) => {
      state.removeById.message = "";
      state.updateById.message = "";
      state.editById.message = "";
      state.createUsers.message = "";
      state.changePassword.message = "";
      state.updateUserConfig.message = "";
      state.getFacultyWiseLectureCount.message = "";
      state.getFacultyUtilization.message = "";
    },
  },
  extraReducers: {
    //get user
    [searchUserData.pending.type]: (state) => {
      state.usersData.loading = true;
    },
    [searchUserData.fulfilled.type]: (state, action) => {
      state.usersData.data = action.payload.data;
      state.usersData.message = action.payload.message;
      state.usersData.loading = false;
      state.usersData.hasErrors = false;
    },
    [searchUserData.rejected.type]: (state, action) => {
      state.usersData.loading = false;
      state.usersData.hasErrors = true;
      state.usersData.message = action.error.message;
    },

    [userProfile.pending.type]: (state) => {
      state.userData.loading = true;
    },
    [userProfile.fulfilled.type]: (state, action) => {
      state.userData.data = action.payload.data;
      state.userData.message = action.payload.message;
      state.userData.loading = false;
      state.userData.hasErrors = false;
    },
    [userProfile.rejected.type]: (state, action) => {
      state.userData.loading = false;
      state.userData.hasErrors = true;
      state.userData.message = action.error.message;
    },

    //create user
    [createNewUser.pending.type]: (state) => {
      state.createUsers.loading = true;
    },
    [createNewUser.fulfilled.type]: (state, action) => {
      state.createUsers.message = action.payload.message;
      state.createUsers.hasErrors = action.payload.error;
      state.createUsers.loading = false;
      state.createUsers.hasErrors = false;
    },
    [createNewUser.rejected.type]: (state, action) => {
      state.createUsers.loading = false;
      state.createUsers.hasErrors = true;
      state.createUsers.message = action.error.message;
    },

    //edit user
    [editUserById.pending.type]: (state) => {
      state.editById.loading = true;
    },
    [editUserById.fulfilled.type]: (state, action) => {
      state.editById.message = action.payload.message;
      state.editById.loading = false;
      state.editById.hasErrors = false;
    },
    [editUserById.rejected.type]: (state, action) => {
      state.editById.loading = false;
      state.editById.hasErrors = true;
      state.editById.message = action.error.message;
    },

    //update user
    [updateUserStatus.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [updateUserStatus.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [updateUserStatus.rejected.type]: (state, action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message = action.error.message;
    },

    //reset User password
    [resetUserPassword.pending.type]: (state) => {
      state.updateById.loading = true;
    },
    [resetUserPassword.fulfilled.type]: (state, action) => {
      state.updateById.message = action.payload.message;
      state.updateById.loading = false;
      state.updateById.hasErrors = false;
    },
    [resetUserPassword.rejected.type]: (state, action) => {
      state.updateById.loading = false;
      state.updateById.hasErrors = true;
      state.updateById.message = action.error.message;
    },

    //Delete user
    [removeUserById.pending.type]: (state) => {
      state.removeById.loading = true;
    },
    [removeUserById.fulfilled.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = false;
      state.removeById.message = action.payload.message;
    },
    [removeUserById.rejected.type]: (state, action) => {
      state.removeById.loading = false;
      state.removeById.hasErrors = true;
      state.removeById.message = action.error.message;
    },

    // changePassword
    [changePassword.pending.type]: (state) => {
      state.userData.loading = true;
    },
    [changePassword.fulfilled.type]: (state, action) => {
      state.userData.data = action.payload.user;
      state.userData.message = action.payload.message;
      state.userData.loading = false;
      state.userData.hasErrors = false;
    },
    [changePassword.rejected.type]: (state, action) => {
      state.userData.loading = false;
      state.userData.hasErrors = true;
      state.userData.message = action.error.message;
    },

    //get branchWiseUsers
    [branchWiseUsers.pending.type]: (state) => {
      state.branchwiseusersData.loading = true;
    },
    [branchWiseUsers.fulfilled.type]: (state, action) => {
      state.branchwiseusersData.data = action.payload.data;
      state.branchwiseusersData.message = action.payload.message;
      state.branchwiseusersData.loading = false;
      state.branchwiseusersData.hasErrors = false;
    },
    [branchWiseUsers.rejected.type]: (state, action) => {
      state.branchwiseusersData.loading = false;
      state.branchwiseusersData.hasErrors = true;
      state.branchwiseusersData.message = action.error.message;
    },

    // get user by id
    [getUserDetailsById.pending.type]: (state) => {
      state.getUserDetailsById.loading = true;
    },
    [getUserDetailsById.fulfilled.type]: (state, action) => {
      state.getUserDetailsById.data = action.payload.data;
      state.getUserDetailsById.message = action.payload.message;
      state.getUserDetailsById.loading = false;
      state.getUserDetailsById.hasErrors = false;
    },
    [getUserDetailsById.rejected.type]: (state, action) => {
      state.getUserDetailsById.loading = false;
      state.getUserDetailsById.hasErrors = true;
      state.getUserDetailsById.message = action.error.message;
    },
    //edit user
    [updateUserConfig.pending.type]: (state) => {
      state.updateUserConfig.loading = true;
    },
    [updateUserConfig.fulfilled.type]: (state, action) => {
      state.updateUserConfig.message = action.payload.message;
      state.updateUserConfig.loading = false;
      state.updateUserConfig.hasErrors = false;
    },
    [updateUserConfig.rejected.type]: (state, action) => {
      state.updateUserConfig.loading = false;
      state.updateUserConfig.hasErrors = true;
      state.updateUserConfig.message = action.error.message;
    },

    // getFacultyUtilization
    [getFacultyUtilization.pending.type]: (state) => {
      state.getFacultyUtilization.loading = true;
    },
    [getFacultyUtilization.fulfilled.type]: (state, action) => {      
      state.getFacultyUtilization.data = action.payload.data;
      state.getFacultyUtilization.message = action.payload.message;
      state.getFacultyUtilization.loading = false;
      state.getFacultyUtilization.hasErrors = false;
    },
    [getFacultyUtilization.rejected.type]: (state, action) => {
      state.getFacultyUtilization.loading = false;
      state.getFacultyUtilization.hasErrors = true;
      state.getFacultyUtilization.message = action.error.message;
    },

    // get Faculty Wise Lecture Count
    [getFacultyWiseLectureCount.pending.type]: (state) => {
      state.getFacultyWiseLectureCount.loading = true;
    },
    [getFacultyWiseLectureCount.fulfilled.type]: (state, action) => {
      state.getFacultyWiseLectureCount.data = action.payload.data;
      state.getFacultyWiseLectureCount.message = action.payload.message;
      state.getFacultyWiseLectureCount.loading = false;
      state.getFacultyWiseLectureCount.hasErrors = false;
    },
    [getFacultyWiseLectureCount.rejected.type]: (state, action) => {
      state.getFacultyWiseLectureCount.loading = false;
      state.getFacultyWiseLectureCount.hasErrors = true;
      state.getFacultyWiseLectureCount.message = action.error.message;
    },
  },
});

// A selector
export const userSelector = (state: RootState) => state.user;

export const { clearRemoveMessage } = userSlice.actions;

// The reducer
export default userSlice.reducer;
