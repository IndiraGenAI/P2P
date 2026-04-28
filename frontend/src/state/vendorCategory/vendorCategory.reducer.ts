import vendorCategoryService, {
  type IVendorCategoryRow,
} from '@/services/vendorCategory/vendorCategory.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const vendorCategory = createMasterSlice<
  IVendorCategoryRow,
  Partial<IVendorCategoryRow>,
  Partial<IVendorCategoryRow> & { id: number }
>('vendorCategoryMaster', vendorCategoryService);

export const {
  search: searchVendorCategoryData,
  create: createNewVendorCategory,
  edit: editVendorCategoryById,
  remove: removeVendorCategoryById,
  updateStatus: updateVendorCategoryStatus,
} = vendorCategory.actions;

export const clearVendorCategoryMessage = vendorCategory.clearMessage;
export const vendorCategoryMasterSelector = (state: RootState) =>
  state.vendorCategoryMaster;
export default vendorCategory.reducer;
