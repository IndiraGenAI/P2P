import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { ITermsConditionRow } from '@/services/termsCondition/termsCondition.service';

export type { ITermsConditionRow } from '@/services/termsCondition/termsCondition.service';

export interface ITermsConditionListData {
  rows: ITermsConditionRow[];
  meta: IMetaProps;
}

export interface ITermsConditionMasterState {
  termsConditionsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: ITermsConditionListData;
  };
  createTermsCondition: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
