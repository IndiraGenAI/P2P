import { admissionViewAndUnAssignAdmissionViewRemarks } from "src/utils/constants/constant";

export interface IRemarksProps {
  branchId?: number;
  admissionStatus?: string;
  admissionId: number | undefined;
  remarksModalOpen: boolean;
  setAbsentStudentRemark?:(data: number) => void
  setRemarksModalOpen: (active: boolean) => void;
  admissionViewAndUnAssignAdmissionView?:
    | admissionViewAndUnAssignAdmissionViewRemarks
    | null
    | "";
}
