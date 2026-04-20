import React, { ReactNode } from "react";
import { Button, Popconfirm } from "antd";

export type DeleteButtonWithConfirmProps = {
  title: string;
  okText: string;
  cancelText: string;
  onDelete: () => void;
  children: ReactNode;
  disabled?: boolean;
};

const DeleteButtonWithConfirmComponent: React.FC<
  DeleteButtonWithConfirmProps
> = ({ title, okText, cancelText, onDelete, children, disabled }) => {
  return (
    <Popconfirm
      title={title}
      okText={okText}
      cancelText={cancelText}
      onConfirm={onDelete}
      disabled={disabled}
    >
      <Button danger type="link" disabled={disabled}>
        {children}
      </Button>
    </Popconfirm>
  );
};

export default DeleteButtonWithConfirmComponent;
