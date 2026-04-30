import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IItemRow } from '@/services/item/item.service';

export type { IItemRow } from '@/services/item/item.service';

export interface IItemListData {
  rows: IItemRow[];
  meta: IMetaProps;
}

export interface IItemMasterState {
  itemsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IItemListData;
  };
  createItem: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
  bulkUpload: { loading: boolean; hasErrors: boolean; message: string };
}
