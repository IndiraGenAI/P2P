import type { Ref } from 'react';
import type { ITermsConditionRecord } from '../TermsCondition.model';

export interface ITermsConditionAddProps {
  data?: ITermsConditionRecord;
  onSubmit: (value: ITermsConditionRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
