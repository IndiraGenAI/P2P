import type { Ref } from 'react';
import type { SelectOption } from '@/common/models';
import type { IItemRecord } from '../Item.model';

export interface IItemAddProps {
  data?: IItemRecord;
  onSubmit: (value: IItemRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  itemTypes: SelectOption[];
  itemCategories: SelectOption[];
  uoms: SelectOption[];
  coas: SelectOption[];
}
