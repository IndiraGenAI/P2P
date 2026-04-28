import type { Ref } from 'react';
import type { IPaymentTermRecord } from '../PaymentTerm.model';

export interface IPaymentTermAddProps {
  data?: IPaymentTermRecord;
  onSubmit: (value: IPaymentTermRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
