import {
  IStudentAttendenceValue,
  studentData,
} from "../BatchWiseStudentDetails.model";

export interface IStudentDetailsProps {
  setbatchWiseStudentDetailsModal: (values: boolean) => void;
  batchWiseStudentDetailsModal?: boolean;
  batchWiseStudentData: studentData;
  onNextStudentAttendence: (values: IStudentAttendenceValue) => void;
  studentCount: number;
}
