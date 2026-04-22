import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.reducer';
import roleReducer from './role/role.reducer';
import rolePermissionsReducer from './rolePermissions/rolePermissions.reducer';
import userReducer from './user/user.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    rolePermissions: rolePermissionsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
