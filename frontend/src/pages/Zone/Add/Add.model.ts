import type { Ref } from "react";
import type { IZoneRecord } from "../Zone.model";

export interface IZoneAddOption {
  value: string;
  label: string;
}

export interface IZoneAddProps {
  data?: IZoneRecord;
  onSubmit: (value: IZoneRecord) => void;
  myRef?: Ref<HTMLButtonElement> | undefined;
  countries: IZoneAddOption[];
}
