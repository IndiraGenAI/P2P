import { createAsyncThunk } from '@reduxjs/toolkit';
import vendorService from '@/services/vendor/vendor.service';
import type { IVendorRow } from './vendor.model';

export const searchVendorData = createAsyncThunk(
  'vendorMaster/searchVendorData',
  async (data: any) => {
    return vendorService.search(data);
  },
);

export const createNewVendor = createAsyncThunk(
  'vendorMaster/createNewVendor',
  async (data: Partial<IVendorRow>) => {
    return vendorService.create(data);
  },
);

export const editVendorById = createAsyncThunk(
  'vendorMaster/editVendorById',
  async (data: Partial<IVendorRow> & { id: number }) => {
    return vendorService.edit(data);
  },
);

export const removeVendorById = createAsyncThunk(
  'vendorMaster/removeVendorById',
  async (id: number) => {
    return vendorService.remove(id);
  },
);

export const updateVendorStatus = createAsyncThunk(
  'vendorMaster/updateVendorStatus',
  async (data: { id: number; status?: boolean }) => {
    return vendorService.updateStatus(data);
  },
);

export const bulkUploadVendors = createAsyncThunk(
  'vendorMaster/bulkUploadVendors',
  async (file: File) => {
    return vendorService.bulkUpload(file);
  },
);
