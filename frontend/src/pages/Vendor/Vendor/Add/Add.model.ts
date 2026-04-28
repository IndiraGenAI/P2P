import type { Ref } from 'react';
import type { SelectOption } from '@/common/models';
import type { IVendorRecord } from '../Vendor.model';

export interface IVendorAddProps {
  data?: IVendorRecord;
  onSubmit: (value: IVendorRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  vendorCategories: SelectOption[];
  paymentTerms: SelectOption[];
  applicantTypes: SelectOption[];
  tdsList: SelectOption[];
  countries: SelectOption[];
  currencies: SelectOption[];
}
