import applicantTypeService, {
  type IApplicantTypeRow,
} from '@/services/applicantType/applicantType.service';
import { createMasterSlice } from '../helpers/createMasterSlice';
import type { RootState } from '../store';

const applicantType = createMasterSlice<
  IApplicantTypeRow,
  Partial<IApplicantTypeRow>,
  Partial<IApplicantTypeRow> & { id: number }
>('applicantTypeMaster', applicantTypeService);

export const {
  search: searchApplicantTypeData,
  create: createNewApplicantType,
  edit: editApplicantTypeById,
  remove: removeApplicantTypeById,
  updateStatus: updateApplicantTypeStatus,
} = applicantType.actions;

export const clearApplicantTypeMessage = applicantType.clearMessage;

export const applicantTypeMasterSelector = (state: RootState) =>
  state.applicantTypeMaster;

export default applicantType.reducer;
