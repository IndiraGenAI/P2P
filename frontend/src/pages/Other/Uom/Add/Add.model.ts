import type { Ref } from 'react';
import type { IUomRecord } from '../Uom.model';

export interface IUomAddProps {
  data?: IUomRecord;
  onSubmit: (value: IUomRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
