import type { Ref } from "react";
import type { IEntityRecord } from "../Entity.model";

export interface IEntityAddProps {
  data?: IEntityRecord;
  onSubmit: (value: IEntityRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
