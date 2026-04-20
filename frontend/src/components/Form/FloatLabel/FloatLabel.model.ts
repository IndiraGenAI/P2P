import { NamePath } from "antd/lib/form/interface";

export interface IFloatLabelProps {
  children: JSX.Element;
  label: string;
  name: NamePath;
  placeholder: string;
  required?: boolean;
  className?: string;
}
