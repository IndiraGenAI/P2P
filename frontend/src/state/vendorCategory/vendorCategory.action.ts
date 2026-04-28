import { createAsyncThunk } from '@reduxjs/toolkit';
import vendorCategoryService from '@/services/vendorCategory/vendorCategory.service';
import type { IVendorCategoryRow } from './vendorCategory.model';

export const searchVendorCategoryData = createAsyncThunk(
  'vendorCategoryMaster/searchVendorCategoryData',
  async (data: any) => {
    return vendorCategoryService.search(data);
  },
);

export const createNewVendorCategory = createAsyncThunk(
  'vendorCategoryMaster/createNewVendorCategory',
  async (data: Partial<IVendorCategoryRow>) => {
    return vendorCategoryService.create(data);
  },
);

export const editVendorCategoryById = createAsyncThunk(
  'vendorCategoryMaster/editVendorCategoryById',
  async (data: Partial<IVendorCategoryRow> & { id: number }) => {
    return vendorCategoryService.edit(data);
  },
);

export const removeVendorCategoryById = createAsyncThunk(
  'vendorCategoryMaster/removeVendorCategoryById',
  async (id: number) => {
    return vendorCategoryService.remove(id);
  },
);

export const updateVendorCategoryStatus = createAsyncThunk(
  'vendorCategoryMaster/updateVendorCategoryStatus',
  async (data: { id: number; status?: boolean }) => {
    return vendorCategoryService.updateStatus(data);
  },
);
