import type { ReactNode } from 'react';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface DeleteButtonWithConfirmComponentProps {
  title: string;
  okText?: string;
  cancelText?: string;
  onDelete: () => void;
  children?: ReactNode;
}

const DeleteButtonWithConfirmComponent = ({
  title,
  okText = 'Yes',
  cancelText = 'No',
  onDelete,
  children = 'Delete',
}: DeleteButtonWithConfirmComponentProps) => (
  <Popconfirm
    title={title}
    okText={okText}
    cancelText={cancelText}
    onConfirm={onDelete}
  >
    <Button danger type="text" icon={<DeleteOutlined />} className="btn_delete">
      {children}
    </Button>
  </Popconfirm>
);

export default DeleteButtonWithConfirmComponent;
