import { useState } from "react";

import "./index.css";
import { IFloatLabelProps } from "./FloatLabel.model";
import { Form } from "antd";

const FloatLabel = (props: IFloatLabelProps) => {
  const [focus, setFocus] = useState(false);

  let { children, label, name, placeholder, required } = props;
  const form = Form.useFormInstance();
  const value = Form.useWatch(name, form);
  if (!placeholder) placeholder = label;

  const isOccupied = focus || (value !== undefined && value?.length !== 0);

  const labelClass = isOccupied ? "label as-label" : "label as-placeholder";

  const requiredMark = required ? <span className="text-danger">*</span> : null;
  return (
    <div
      className="float-label gx-form-row0"
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {children}
      <label className={labelClass}>
        <span>
          {isOccupied ? label : placeholder} {requiredMark}
        </span>
      </label>
    </div>
  );
};

export default FloatLabel;
