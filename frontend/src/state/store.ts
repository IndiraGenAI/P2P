import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.reducer';
import centerMasterReducer from './center/center.reducer';
import cityMasterReducer from './city/city.reducer';
import coaMasterReducer from './coa/coa.reducer';
import coaCategoryMasterReducer from './coaCategory/coaCategory.reducer';
import costCenterMasterReducer from './costCenter/costCenter.reducer';
import countryReducer from './country/country.reducer';
import currencyMasterReducer from './currency/currency.reducer';
import departmentMasterReducer from './department/department.reducer';
import gstMasterReducer from './gst/gst.reducer';
import invoiceSourceMasterReducer from './invoiceSource/invoiceSource.reducer';
import roleReducer from './role/role.reducer';
import rolePermissionsReducer from './rolePermissions/rolePermissions.reducer';
import stateMasterReducer from './state/state.reducer';
import subdepartmentMasterReducer from './subdepartment/subdepartment.reducer';
import tdsMasterReducer from './tds/tds.reducer';
import userReducer from './user/user.reducer';
import voucherMasterReducer from './voucher/voucher.reducer';
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
    departmentMaster: departmentMasterReducer,
    subdepartmentMaster: subdepartmentMasterReducer,
    costCenterMaster: costCenterMasterReducer,
    centerMaster: centerMasterReducer,
    invoiceSourceMaster: invoiceSourceMasterReducer,
    currencyMaster: currencyMasterReducer,
    voucherMaster: voucherMasterReducer,
    gstMaster: gstMasterReducer,
    tdsMaster: tdsMasterReducer,
    coaCategoryMaster: coaCategoryMasterReducer,
    coaMaster: coaMasterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
