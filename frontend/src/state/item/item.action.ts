import { createAsyncThunk } from '@reduxjs/toolkit';
import itemService from '@/services/item/item.service';
import type { IItemRow } from './item.model';

export const searchItemData = createAsyncThunk(
  'itemMaster/searchItemData',
  async (data: any) => {
    return itemService.search(data);
  },
);

export const createNewItem = createAsyncThunk(
  'itemMaster/createNewItem',
  async (data: Partial<IItemRow>) => {
    return itemService.create(data);
  },
);

export const editItemById = createAsyncThunk(
  'itemMaster/editItemById',
  async (data: Partial<IItemRow> & { id: number }) => {
    return itemService.edit(data);
  },
);

export const removeItemById = createAsyncThunk(
  'itemMaster/removeItemById',
  async (id: number) => {
    return itemService.remove(id);
  },
);

export const updateItemStatus = createAsyncThunk(
  'itemMaster/updateItemStatus',
  async (data: { id: number; status?: boolean }) => {
    return itemService.updateStatus(data);
  },
);
