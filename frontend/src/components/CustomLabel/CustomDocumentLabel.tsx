import { Divider, Tooltip } from "antd";
import { ICustomLabelProps } from "./CustomLabel.model";

const CustomDocumentLabel = (props: ICustomLabelProps) => {
  const { label, orientation, style } = props;

  return (
    <Tooltip title={label}>
      <div className="custom-label-com" style={style}>
        <Divider orientation={orientation ?? "left"}>
          <span>{label}</span>
        </Divider>
      </div>
    </Tooltip>
  );
};

export default CustomDocumentLabel;
