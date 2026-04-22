import type { Ref } from "react";
import type { IRoleRecord } from "../Role.model";

export interface IRoleAddProps {
  data?: IRoleRecord;
  onSubmit: (value: IRoleRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
