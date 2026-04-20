import { IUpdateAdmissionStatus } from "src/services/admission/admission.model";

export interface StatusUpdateProps {
  title: string;
  field?: string;
  visible: boolean;
  onClose: () => void;
  startDateName: string;
  onSubmit: (value: IUpdateAdmissionStatus) => void;
  children?: React.ReactNode; 
  buttonDisable?: boolean;
}
