import { createAsyncThunk } from '@reduxjs/toolkit';
import applicantTypeService from '@/services/applicantType/applicantType.service';
import type { IApplicantTypeRow } from './applicantType.model';

export const searchApplicantTypeData = createAsyncThunk(
  'applicantTypeMaster/searchApplicantTypeData',
  async (data: any) => {
    return applicantTypeService.search(data);
  },
);

export const createNewApplicantType = createAsyncThunk(
  'applicantTypeMaster/createNewApplicantType',
  async (data: Partial<IApplicantTypeRow>) => {
    return applicantTypeService.create(data);
  },
);

export const editApplicantTypeById = createAsyncThunk(
  'applicantTypeMaster/editApplicantTypeById',
  async (data: Partial<IApplicantTypeRow> & { id: number }) => {
    return applicantTypeService.edit(data);
  },
);

export const removeApplicantTypeById = createAsyncThunk(
  'applicantTypeMaster/removeApplicantTypeById',
  async (id: number) => {
    return applicantTypeService.remove(id);
  },
);

export const updateApplicantTypeStatus = createAsyncThunk(
  'applicantTypeMaster/updateApplicantTypeStatus',
  async (data: { id: number; status?: boolean }) => {
    return applicantTypeService.updateStatus(data);
  },
);
