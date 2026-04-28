import vendorService, {
  type IVendorRow,
} from '@/services/vendor/vendor.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const vendor = createMasterSlice<
  IVendorRow,
  Partial<IVendorRow>,
  Partial<IVendorRow> & { id: number }
>('vendorMaster', vendorService);

export const {
  search: searchVendorData,
  create: createNewVendor,
  edit: editVendorById,
  remove: removeVendorById,
  updateStatus: updateVendorStatus,
} = vendor.actions;

export const clearVendorMessage = vendor.clearMessage;
export const vendorMasterSelector = (state: RootState) => state.vendorMaster;
export default vendor.reducer;
