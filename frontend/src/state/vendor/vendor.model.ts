import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IVendorRow } from '@/services/vendor/vendor.service';

export type { IVendorRow } from '@/services/vendor/vendor.service';

export interface IVendorListData {
  rows: IVendorRow[];
  meta: IMetaProps;
}

export interface IVendorMasterState {
  vendorsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IVendorListData;
  };
  createVendor: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
