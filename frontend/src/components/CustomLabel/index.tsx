import { Divider } from "antd";
import { ICustomLabelProps } from "./CustomLabel.model";

const CustomLabel = (props: ICustomLabelProps) => {
  const { label, orientation } = props;

  return (
    <>
      <div className="custom-label-com">
        <Divider orientation={orientation ? orientation : "left"}>
          <span>{label}</span>
        </Divider>
      </div>
    </>
  );
};

export default CustomLabel;
