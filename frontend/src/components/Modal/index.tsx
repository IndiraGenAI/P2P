import { Modal } from "antd";
import { IModalProps } from './Modal.model';

const ModalComponent = (props: IModalProps) => {
  const { title, showModal, onCancel, component, footer, className , modelWidth=1000 } = props;
  return (
    <>
      <Modal
        className={className}
        width={modelWidth}
        title={title}
        centered
        keyboard={true}
        visible={showModal}
        onCancel={onCancel}
        footer={footer}
      >
        {component}
      </Modal>
    </>
  );
};
export default ModalComponent;
