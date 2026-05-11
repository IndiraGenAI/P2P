import type { Ref } from 'react';
import type { IBudgetRecord } from '../Budget.model';

export interface IBudgetAddProps {
  data?: IBudgetRecord;
  onSubmit: (value: IBudgetRecord) => void;
  myRef?: Ref<HTMLButtonElement>;
}
