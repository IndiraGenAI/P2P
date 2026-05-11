import type { SelectOption } from '@/common/models';
import type { IRateContractRecord } from '../RateContract.model';

export interface ISubdepartmentOption extends SelectOption {
  department_id: string;
}

export type RateContractFormVariant =
  | 'rate_contract'
  | 'purchase_order'
  | 'grn'
  | 'grn_invoice';

/** GST master options with percentage for line tax calculation (GRN / GRN Invoice). */
export interface IGstRateOption {
  id: number;
  label: string;
  percentage: number;
}

/** TDS master options (GRN Invoice line withholding). */
export interface ITdsRateOption {
  id: number;
  label: string;
  percentage: number;
}

export interface IRateContractAddProps {
  data?: IRateContractRecord;
  /** GRN / GRN Invoice: invoice header fields, hides RC validity schedule, adjusts labels. */
  formVariant?: RateContractFormVariant;
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
  /** When non-empty, line items show GST / GST amount / net columns (GRN & GRN Invoice). */
  gstRates?: IGstRateOption[];
  /** When non-empty (GRN Invoice only), line items show TDS / TDS amount before net. */
  tdsRates?: ITdsRateOption[];
  /** Purchase Order: GL / COA picker per line */
  coaOptions?: SelectOption[];
}
