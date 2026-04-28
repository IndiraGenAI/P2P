import type { Ref } from 'react';
import type { IApplicantTypeRecord } from '../ApplicantType.model';

export interface IApplicantTypeAddProps {
  data?: IApplicantTypeRecord;
  onSubmit: (value: IApplicantTypeRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
