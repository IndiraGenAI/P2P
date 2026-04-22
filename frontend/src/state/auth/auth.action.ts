import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from 'src/services/auth/auth.service';
import type {
  ILoginPayload,
  IRegisterPayload,
} from 'src/services/auth/auth.model';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: ILoginPayload) => authService.login(data),
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: IRegisterPayload) => authService.register(data),
);

export const fetchProfile = createAsyncThunk('auth/me', async () =>
  authService.me(),
);
