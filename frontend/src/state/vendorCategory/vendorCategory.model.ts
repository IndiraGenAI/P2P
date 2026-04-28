import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IVendorCategoryRow } from '@/services/vendorCategory/vendorCategory.service';

export type { IVendorCategoryRow } from '@/services/vendorCategory/vendorCategory.service';

export interface IVendorCategoryListData {
  rows: IVendorCategoryRow[];
  meta: IMetaProps;
}

export interface IVendorCategoryMasterState {
  vendorCategoriesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IVendorCategoryListData;
  };
  createVendorCategory: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
