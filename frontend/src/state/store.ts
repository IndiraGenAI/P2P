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
import entityMasterReducer from './entity/entity.reducer';
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
import applicantTypeMasterReducer from './applicantType/applicantType.reducer';
import uomMasterReducer from './uom/uom.reducer';
import paymentTermMasterReducer from './paymentTerm/paymentTerm.reducer';
import termsConditionMasterReducer from './termsCondition/termsCondition.reducer';
import itemCategoryMasterReducer from './itemCategory/itemCategory.reducer';
import itemTypeMasterReducer from './itemType/itemType.reducer';
import itemMasterReducer from './item/item.reducer';
import vendorCategoryMasterReducer from './vendorCategory/vendorCategory.reducer';
import vendorMasterReducer from './vendor/vendor.reducer';
import vendorSiteMasterReducer from './vendorSite/vendorSite.reducer';
import purchaseRequestReducer from './purchaseRequest/purchaseRequest.reducer';
import purchaseOrderReducer from './purchaseOrder/purchaseOrder.reducer';

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
    entityMaster: entityMasterReducer,
    invoiceSourceMaster: invoiceSourceMasterReducer,
    currencyMaster: currencyMasterReducer,
    voucherMaster: voucherMasterReducer,
    gstMaster: gstMasterReducer,
    tdsMaster: tdsMasterReducer,
    coaCategoryMaster: coaCategoryMasterReducer,
    coaMaster: coaMasterReducer,
    applicantTypeMaster: applicantTypeMasterReducer,
    uomMaster: uomMasterReducer,
    paymentTermMaster: paymentTermMasterReducer,
    termsConditionMaster: termsConditionMasterReducer,
    itemCategoryMaster: itemCategoryMasterReducer,
    itemTypeMaster: itemTypeMasterReducer,
    itemMaster: itemMasterReducer,
    vendorCategoryMaster: vendorCategoryMasterReducer,
    vendorMaster: vendorMasterReducer,
    vendorSiteMaster: vendorSiteMasterReducer,
    purchaseRequest: purchaseRequestReducer,
    purchaseOrder: purchaseOrderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
