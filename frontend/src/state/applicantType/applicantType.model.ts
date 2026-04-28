import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IApplicantTypeRow } from '@/services/applicantType/applicantType.service';

export type { IApplicantTypeRow } from '@/services/applicantType/applicantType.service';

export interface IApplicantTypeListData {
  rows: IApplicantTypeRow[];
  meta: IMetaProps;
}

export interface IApplicantTypeMasterState {
  applicantTypesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IApplicantTypeListData;
  };
  createApplicantType: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
