import type { IMetaProps } from '@/components/Pagination/Pagination.model';
import type { IVendorSiteRow } from '@/services/vendorSite/vendorSite.service';

export type { IVendorSiteRow } from '@/services/vendorSite/vendorSite.service';

export interface IVendorSiteListData {
  rows: IVendorSiteRow[];
  meta: IMetaProps;
}

export interface IVendorSiteMasterState {
  vendorSitesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IVendorSiteListData;
  };
  createVendorSite: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
