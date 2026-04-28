import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IUomRow } from '@/services/uom/uom.service';

export type { IUomRow } from '@/services/uom/uom.service';

export interface IUomListData {
  rows: IUomRow[];
  meta: IMetaProps;
}

export interface IUomMasterState {
  uomsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IUomListData;
  };
  createUom: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
