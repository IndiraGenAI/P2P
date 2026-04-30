import type { SelectOption } from '@/common/models';
import type { IPurchaseRequestRecord } from '../PurchaseRequest.model';

export interface ISubdepartmentOption extends SelectOption {
  department_id: string;
}

export interface IPurchaseRequestAddProps {
  data?: IPurchaseRequestRecord;
  onSubmit: (val: IPurchaseRequestRecord) => void;
  myRef?: React.Ref<HTMLButtonElement>;
  vendors: SelectOption[];
  entities: SelectOption[];
  itemTypes: SelectOption[];
  departments: SelectOption[];
  subdepartments: ISubdepartmentOption[];
  paymentTerms: SelectOption[];
  centers: SelectOption[];
  items: SelectOption[];
}
