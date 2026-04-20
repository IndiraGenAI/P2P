import { combineReducers } from "@reduxjs/toolkit";
import CommonReducer from "./common/common.reducer";
import departmentReducer from "./department/department.reducer";
import roleReducer from "./role/role.reducer";
import loginReducer from "./Login/login.reducer";
import SettingsReducer from "./setting/setting.reducer";
import userReducer from "./users/user.reducer";
import zoneReducer from "./zone/zone.reducer";
import commonModuleReducer from "./commonModule/commonModule.reducer";
import branchReducer from "./branch/branch.reducer";
import rolePermissionsReducer from "./rolePermissions/rolePermissions.reducer";

/**
 * Reduced store: this workspace snapshot only includes the slices above.
 * Restore the full reducer map when the remaining feature modules are present.
 */
export const combinedReducer = combineReducers({
  departments: departmentReducer,
  zone: zoneReducer,
  user: userReducer,
  role: roleReducer,
  branch: branchReducer,
  commonModule: commonModuleReducer,
  common: CommonReducer,
  settings: SettingsReducer,
  login: loginReducer,
  rolePermissions: rolePermissionsReducer,
});

export const rootReducer = (state: any, action: any) => {
  return combinedReducer(state, action);
};
