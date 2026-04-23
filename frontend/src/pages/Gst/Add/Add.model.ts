import type { Ref } from "react";
import type { IGstRecord } from "../Gst.model";

export interface IGstAddProps {
  data?: IGstRecord;
  onSubmit: (value: IGstRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
}
