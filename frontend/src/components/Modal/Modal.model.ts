export interface IModalProps {
  width?: number;
  title?: string;
  component: JSX.Element;
  onCancel?: (mode?: any) => void;
  showModal: boolean;
  footer?: any;
  className:string;
  modelWidth ?: number;
}
