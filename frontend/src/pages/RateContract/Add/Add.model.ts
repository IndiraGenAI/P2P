import type { SelectOption } from '@/common/models';
import type { IRateContractRecord } from '../RateContract.model';

export interface ISubdepartmentOption extends SelectOption {
  department_id: string;
}

export interface IRateContractAddProps {
  data?: IRateContractRecord;
  readOnly?: boolean;
  onSubmit: (val: IRateContractRecord) => void;
  myRef?: React.Ref<HTMLButtonElement>;
  vendors: SelectOption[];
  entities: SelectOption[];
  itemTypes: SelectOption[];
  departments: SelectOption[];
  subdepartments: ISubdepartmentOption[];
  paymentTerms: SelectOption[];
  centers: SelectOption[];
  items: SelectOption[];
  termsConditions: SelectOption[];
  currencies: SelectOption[];
}
