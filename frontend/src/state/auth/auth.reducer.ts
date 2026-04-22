import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app.model';
import { fetchProfile, loginUser, registerUser } from './auth.action';
import type { IAuthState } from './auth.model';

const ACCESS_TOKEN_KEY = 'accessToken';

const hasWindow = (): boolean => globalThis.window !== undefined;

const readToken = (): string | null => {
  if (!hasWindow()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const initialState: IAuthState = {
  login: { loading: false, hasErrors: false, message: '' },
  register: { loading: false, hasErrors: false, message: '' },
  profile: {
    loading: false,
    hasErrors: false,
    message: '',
    data: null,
  },
  accessToken: readToken(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthMessage: (state) => {
      state.login.message = '';
      state.register.message = '';
      state.profile.message = '';
    },
    signOut: (state) => {
      state.accessToken = null;
      state.profile.data = null;
      if (hasWindow()) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      if (hasWindow()) {
        if (action.payload) {
          localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
        } else {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.login.loading = true;
        state.login.hasErrors = false;
        state.login.message = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.login.loading = false;
        state.login.hasErrors = false;
        state.login.message = action.payload.message;
        state.accessToken = action.payload.data.accessToken;
        state.profile.data = action.payload.data.user;
        if (hasWindow()) {
          localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.data.accessToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.login.loading = false;
        state.login.hasErrors = true;
        state.login.message = action.error.message ?? '';
      })


      .addCase(registerUser.pending, (state) => {
        state.register.loading = true;
        state.register.hasErrors = false;
        state.register.message = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.register.loading = false;
        state.register.hasErrors = false;
        state.register.message = action.payload.message;
        state.accessToken = action.payload.data.accessToken;
        state.profile.data = action.payload.data.user;
        if (hasWindow()) {
          localStorage.setItem(ACCESS_TOKEN_KEY, action.payload.data.accessToken);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.register.loading = false;
        state.register.hasErrors = true;
        state.register.message = action.error.message ?? '';
      })


      .addCase(fetchProfile.pending, (state) => {
        state.profile.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.hasErrors = false;
        state.profile.data = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.hasErrors = true;
        state.profile.message = action.error.message ?? '';

        state.accessToken = null;
        state.profile.data = null;
        if (hasWindow()) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
        }
      });
  },
});

export const authSelector = (state: RootState) => state.auth;
export const { clearAuthMessage, signOut, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
