import type { SelectOption } from '@/common/models';
import type { IPurchaseRequestRecord } from '../PurchaseRequest.model';

export interface IPurchaseRequestAddProps {
  data?: IPurchaseRequestRecord;
  onSubmit: (val: IPurchaseRequestRecord) => void;
  myRef?: React.Ref<HTMLButtonElement>;
  vendors: SelectOption[];
  vendorSites: SelectOption[];
  entities: SelectOption[];
  itemTypes: SelectOption[];
  departments: SelectOption[];
  subdepartments: SelectOption[];
  paymentTerms: SelectOption[];
  centers: SelectOption[];
  items: SelectOption[];
}
