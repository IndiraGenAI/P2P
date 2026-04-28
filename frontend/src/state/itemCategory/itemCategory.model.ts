import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IItemCategoryRow } from '@/services/itemCategory/itemCategory.service';

export type { IItemCategoryRow } from '@/services/itemCategory/itemCategory.service';

export interface IItemCategoryListData {
  rows: IItemCategoryRow[];
  meta: IMetaProps;
}

export interface IItemCategoryMasterState {
  itemCategoriesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IItemCategoryListData;
  };
  createItemCategory: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
