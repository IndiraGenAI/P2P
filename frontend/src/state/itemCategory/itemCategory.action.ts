import { createAsyncThunk } from '@reduxjs/toolkit';
import itemCategoryService from '@/services/itemCategory/itemCategory.service';
import type { IItemCategoryRow } from './itemCategory.model';

export const searchItemCategoryData = createAsyncThunk(
  'itemCategoryMaster/searchItemCategoryData',
  async (data: any) => {
    return itemCategoryService.search(data);
  },
);

export const createNewItemCategory = createAsyncThunk(
  'itemCategoryMaster/createNewItemCategory',
  async (data: Partial<IItemCategoryRow>) => {
    return itemCategoryService.create(data);
  },
);

export const editItemCategoryById = createAsyncThunk(
  'itemCategoryMaster/editItemCategoryById',
  async (data: Partial<IItemCategoryRow> & { id: number }) => {
    return itemCategoryService.edit(data);
  },
);

export const removeItemCategoryById = createAsyncThunk(
  'itemCategoryMaster/removeItemCategoryById',
  async (id: number) => {
    return itemCategoryService.remove(id);
  },
);

export const updateItemCategoryStatus = createAsyncThunk(
  'itemCategoryMaster/updateItemCategoryStatus',
  async (data: { id: number; status?: boolean }) => {
    return itemCategoryService.updateStatus(data);
  },
);
