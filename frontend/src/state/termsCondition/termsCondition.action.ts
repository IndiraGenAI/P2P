import { createAsyncThunk } from '@reduxjs/toolkit';
import termsConditionService from '@/services/termsCondition/termsCondition.service';
import type { ITermsConditionRow } from './termsCondition.model';

export const searchTermsConditionData = createAsyncThunk(
  'termsConditionMaster/searchTermsConditionData',
  async (data: any) => {
    return termsConditionService.search(data);
  },
);

export const createNewTermsCondition = createAsyncThunk(
  'termsConditionMaster/createNewTermsCondition',
  async (data: Partial<ITermsConditionRow>) => {
    return termsConditionService.create(data);
  },
);

export const editTermsConditionById = createAsyncThunk(
  'termsConditionMaster/editTermsConditionById',
  async (data: Partial<ITermsConditionRow> & { id: number }) => {
    return termsConditionService.edit(data);
  },
);

export const removeTermsConditionById = createAsyncThunk(
  'termsConditionMaster/removeTermsConditionById',
  async (id: number) => {
    return termsConditionService.remove(id);
  },
);

export const updateTermsConditionStatus = createAsyncThunk(
  'termsConditionMaster/updateTermsConditionStatus',
  async (data: { id: number; status?: boolean }) => {
    return termsConditionService.updateStatus(data);
  },
);
