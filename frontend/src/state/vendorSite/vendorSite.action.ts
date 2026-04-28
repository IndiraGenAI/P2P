import { createAsyncThunk } from '@reduxjs/toolkit';
import vendorSiteService from '@/services/vendorSite/vendorSite.service';
import type { IVendorSiteRow } from './vendorSite.model';

export const searchVendorSiteData = createAsyncThunk(
  'vendorSiteMaster/searchVendorSiteData',
  async (data: any) => {
    return vendorSiteService.search(data);
  },
);

export const createNewVendorSite = createAsyncThunk(
  'vendorSiteMaster/createNewVendorSite',
  async (data: Partial<IVendorSiteRow>) => {
    return vendorSiteService.create(data);
  },
);

export const editVendorSiteById = createAsyncThunk(
  'vendorSiteMaster/editVendorSiteById',
  async (data: Partial<IVendorSiteRow> & { id: number }) => {
    return vendorSiteService.edit(data);
  },
);

export const removeVendorSiteById = createAsyncThunk(
  'vendorSiteMaster/removeVendorSiteById',
  async (id: number) => {
    return vendorSiteService.remove(id);
  },
);

export const updateVendorSiteStatus = createAsyncThunk(
  'vendorSiteMaster/updateVendorSiteStatus',
  async (data: { id: number; status?: boolean }) => {
    return vendorSiteService.updateStatus(data);
  },
);
