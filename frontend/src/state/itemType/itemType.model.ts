import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IItemTypeRow } from '@/services/itemType/itemType.service';

export type { IItemTypeRow } from '@/services/itemType/itemType.service';

export interface IItemTypeListData {
  rows: IItemTypeRow[];
  meta: IMetaProps;
}

export interface IItemTypeMasterState {
  itemTypesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IItemTypeListData;
  };
  createItemType: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
