import type { SelectOption } from '@/common/models';
import type { IPurchaseOrderRecord } from '../purchaseOrder.model';

export interface ISubdepartmentOption extends SelectOption {
  department_id: string;
}

export interface IPurchaseOrderAddProps {
  data?: IPurchaseOrderRecord;
  /** When true, all fields are disabled and item add/remove is hidden. */
  readOnly?: boolean;
  onSubmit: (val: IPurchaseOrderRecord) => void;
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
