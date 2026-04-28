import vendorSiteService, {
  type IVendorSiteRow,
} from '@/services/vendorSite/vendorSite.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const vendorSite = createMasterSlice<
  IVendorSiteRow,
  Partial<IVendorSiteRow>,
  Partial<IVendorSiteRow> & { id: number }
>('vendorSiteMaster', vendorSiteService);

export const {
  search: searchVendorSiteData,
  create: createNewVendorSite,
  edit: editVendorSiteById,
  remove: removeVendorSiteById,
  updateStatus: updateVendorSiteStatus,
} = vendorSite.actions;

export const clearVendorSiteMessage = vendorSite.clearMessage;
export const vendorSiteMasterSelector = (state: RootState) =>
  state.vendorSiteMaster;
export default vendorSite.reducer;
