import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";

export type AddRemoveButtonProps = {
  fieldsLength: number;
  index: number;
  add: () => void;
  remove: () => void;
};

const AddRemoveButton: React.FC<AddRemoveButtonProps> = ({
  fieldsLength,
  index,
  add,
  remove,
}) => {
  return (
    <Space>
      {index === fieldsLength - 1 ? (
        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} />
      ) : null}
      {fieldsLength > 1 ? (
        <Button
          danger
          type="link"
          onClick={() => remove()}
          icon={<MinusCircleOutlined />}
        />
      ) : null}
    </Space>
  );
};

export default AddRemoveButton;
