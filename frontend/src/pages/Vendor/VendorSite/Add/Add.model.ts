import type { Ref } from 'react';
import type { SelectOption } from '@/common/models';
import type { IVendorSiteRecord } from '../VendorSite.model';

export interface IVendorSiteAddProps {
  data?: IVendorSiteRecord;
  onSubmit: (value: IVendorSiteRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  vendors: SelectOption[];
}
