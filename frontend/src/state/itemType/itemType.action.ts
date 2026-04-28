import { createAsyncThunk } from '@reduxjs/toolkit';
import itemTypeService from '@/services/itemType/itemType.service';
import type { IItemTypeRow } from './itemType.model';

export const searchItemTypeData = createAsyncThunk(
  'itemTypeMaster/searchItemTypeData',
  async (data: any) => {
    return itemTypeService.search(data);
  },
);

export const createNewItemType = createAsyncThunk(
  'itemTypeMaster/createNewItemType',
  async (data: Partial<IItemTypeRow>) => {
    return itemTypeService.create(data);
  },
);

export const editItemTypeById = createAsyncThunk(
  'itemTypeMaster/editItemTypeById',
  async (data: Partial<IItemTypeRow> & { id: number }) => {
    return itemTypeService.edit(data);
  },
);

export const removeItemTypeById = createAsyncThunk(
  'itemTypeMaster/removeItemTypeById',
  async (id: number) => {
    return itemTypeService.remove(id);
  },
);

export const updateItemTypeStatus = createAsyncThunk(
  'itemTypeMaster/updateItemTypeStatus',
  async (data: { id: number; status?: boolean }) => {
    return itemTypeService.updateStatus(data);
  },
);
