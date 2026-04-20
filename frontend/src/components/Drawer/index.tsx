import React, { ReactNode, useRef } from "react";
import { Button, Drawer, Space } from "antd";

export type DrawerComponentProps = {
  title: string;
  onClose: () => void;
  visible: boolean;
  size?: "default" | "large";
  footer?: boolean;
  label?: string;
  className?: string;
  children: ReactNode;
};

const DrawerComponent: React.FC<DrawerComponentProps> = ({
  title,
  onClose,
  visible,
  size,
  footer,
  label,
  className,
  children,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const width = size === "large" ? 720 : 520;

  const triggerSubmit = () => {
    const btn = bodyRef.current?.querySelector(
      "button.btn-submit",
    ) as HTMLButtonElement | null;
    btn?.click();
  };

  return (
    <Drawer
      title={title}
      width={width}
      onClose={onClose}
      visible={visible}
      className={className}
      destroyOnClose
      footer={
        footer ? (
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={triggerSubmit}>
              {label ?? "Submit"}
            </Button>
          </Space>
        ) : undefined
      }
    >
      <div ref={bodyRef}>{children}</div>
    </Drawer>
  );
};

export default DrawerComponent;
