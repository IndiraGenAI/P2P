import type { Ref } from "react";
import type { ICoaCategoryRecord } from "../CoaCategory.model";

export interface ICoaCategoryAddProps {
  data?: ICoaCategoryRecord;
  onSubmit: (value: ICoaCategoryRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
