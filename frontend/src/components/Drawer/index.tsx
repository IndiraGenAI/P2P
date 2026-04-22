import type { ReactNode, RefObject } from 'react';
import { useRef } from 'react';
import { Button, Drawer as AntdDrawer } from 'antd';

interface DrawerComponentProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: boolean;
  label?: string;
  width?: number | string;
  size?: 'default' | 'large';
}



const DrawerComponent = ({
  title,
  visible,
  onClose,
  children,
  footer = false,
  label = 'Submit',
  width,
  size = 'default',
}: DrawerComponentProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    const btn = bodyRef.current?.querySelector<HTMLButtonElement>('.btn-submit');
    btn?.click();
  };

  return (
    <AntdDrawer
      title={title}
      open={visible}
      onClose={onClose}
      {...(width !== undefined ? { width } : { size })}
      destroyOnClose
      footer={
        footer && (
          <div className="gx-d-flex gx-justify-content-end" style={{ gap: 8 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              {label}
            </Button>
          </div>
        )
      }
    >
      <div ref={bodyRef as RefObject<HTMLDivElement>}>{children}</div>
    </AntdDrawer>
  );
};

export default DrawerComponent;
