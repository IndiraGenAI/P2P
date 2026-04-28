import { createAsyncThunk } from '@reduxjs/toolkit';
import uomService from '@/services/uom/uom.service';
import type { IUomRow } from './uom.model';

export const searchUomData = createAsyncThunk(
  'uomMaster/searchUomData',
  async (data: any) => {
    return uomService.search(data);
  },
);

export const createNewUom = createAsyncThunk(
  'uomMaster/createNewUom',
  async (data: Partial<IUomRow>) => {
    return uomService.create(data);
  },
);

export const editUomById = createAsyncThunk(
  'uomMaster/editUomById',
  async (data: Partial<IUomRow> & { id: number }) => {
    return uomService.edit(data);
  },
);

export const removeUomById = createAsyncThunk(
  'uomMaster/removeUomById',
  async (id: number) => {
    return uomService.remove(id);
  },
);

export const updateUomStatus = createAsyncThunk(
  'uomMaster/updateUomStatus',
  async (data: { id: number; status?: boolean }) => {
    return uomService.updateStatus(data);
  },
);
