import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.reducer';
import cityMasterReducer from './city/city.reducer';
import countryReducer from './country/country.reducer';
import roleReducer from './role/role.reducer';
import rolePermissionsReducer from './rolePermissions/rolePermissions.reducer';
import stateMasterReducer from './state/state.reducer';
import userReducer from './user/user.reducer';
import zoneMasterReducer from './zone/zone.reducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    role: roleReducer,
    rolePermissions: rolePermissionsReducer,
    user: userReducer,
    country: countryReducer,
    stateMaster: stateMasterReducer,
    cityMaster: cityMasterReducer,
    zoneMaster: zoneMasterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
