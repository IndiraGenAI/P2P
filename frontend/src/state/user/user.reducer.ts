import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import {
  createNewUser,
  editUserById,
  removeUserById,
  searchUserData,
  updateUserStatus,
} from './user.action';
import type { IUserState } from './user.model';

export const initialState: IUserState = {
  usersData: {
    loading: false,
    hasErrors: false,
    message: '',
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
  createUsers: { loading: false, hasErrors: false, message: '' },
  editById: { loading: false, hasErrors: false, message: '' },
  removeById: { loading: false, hasErrors: false, message: '' },
  updateById: { loading: false, hasErrors: false, message: '' },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserMessage: (state) => {
      state.removeById.message = '';
      state.updateById.message = '';
      state.editById.message = '';
      state.createUsers.message = '';
      state.usersData.message = '';
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(searchUserData.pending, (state) => {
        state.usersData.loading = true;
      })
      .addCase(searchUserData.fulfilled, (state, action) => {
        state.usersData.data = action.payload.data;
        state.usersData.message = action.payload.message;
        state.usersData.loading = false;
        state.usersData.hasErrors = false;
      })
      .addCase(searchUserData.rejected, (state, action) => {
        state.usersData.loading = false;
        state.usersData.hasErrors = true;
        state.usersData.message = action.error.message ?? '';
      })


      .addCase(createNewUser.pending, (state) => {
        state.createUsers.loading = true;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.createUsers.message = action.payload.message;
        state.createUsers.loading = false;
        state.createUsers.hasErrors = false;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.createUsers.loading = false;
        state.createUsers.hasErrors = true;
        state.createUsers.message = action.error.message ?? '';
      })


      .addCase(editUserById.pending, (state) => {
        state.editById.loading = true;
      })
      .addCase(editUserById.fulfilled, (state, action) => {
        state.editById.message = action.payload.message;
        state.editById.loading = false;
        state.editById.hasErrors = false;
      })
      .addCase(editUserById.rejected, (state, action) => {
        state.editById.loading = false;
        state.editById.hasErrors = true;
        state.editById.message = action.error.message ?? '';
      })


      .addCase(updateUserStatus.pending, (state) => {
        state.updateById.loading = true;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.updateById.message = action.payload.message;
        state.updateById.loading = false;
        state.updateById.hasErrors = false;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.updateById.loading = false;
        state.updateById.hasErrors = true;
        state.updateById.message = action.error.message ?? '';
      })


      .addCase(removeUserById.pending, (state) => {
        state.removeById.loading = true;
      })
      .addCase(removeUserById.fulfilled, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = false;
        state.removeById.message = action.payload.message;
      })
      .addCase(removeUserById.rejected, (state, action) => {
        state.removeById.loading = false;
        state.removeById.hasErrors = true;
        state.removeById.message = action.error.message ?? '';
      });
  },
});

export const userSelector = (state: RootState) => state.user;
export const { clearUserMessage } = userSlice.actions;

export default userSlice.reducer;
