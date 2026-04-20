import { IBranchInfrastructureDetails } from "src/services/BranchInfrastructure/branchInfrastructure.model";
import { ISearchSlotsData } from "src/services/slots/slots.model";
import { IStudentDetails } from "src/services/studentList/studentList.model";
import { IFormInitialValue, slotDetails } from "../AssignLab.model";

export interface ILabDetailsShow {
  batchStudentList?: IStudentDetails[];
  labBranchInfrastructureData?: IBranchInfrastructureDetails[];
  branchInfrastructureWisePlacesData?: ISearchSlotsData[];
  labFormInitialValue?: IFormInitialValue;
  fetchSlotData?: () => void;
  onFinishDateForm: (data: ISlotAPICreateEditPayloadData) => void;
  disable: boolean;
  setSlotStartTimeAndEndTime: (data: {
    start_time: string;
    end_time: string;
  }) => void;
  batchInOldSlotRecords: slotDetails[] | [];
}

export interface ISelectedStudentRecord {
  admission_id: number | null;
  branch_infrastructure_id?: number;
  place_id?: number;
  status: string;
  duration?: number;
  hours?: string[];
  id?: number | null;
  batch_id: number;
}

export interface ISlotAPICreateEditPayloadData {
  createPayload: ISelectedStudentRecord[];
  updatePayload: ISelectedStudentRecord[];
}
export interface ILabAssignForm {
  onSubmit: (data: ISlotAPICreateEditPayloadData) => void;
  allBatchStudentRecord?: IStudentDetails[];
  setStudentListDataMethod: (data: IStudentDetails[]) => void;
  labBranchInfrastructureData?: IBranchInfrastructureDetails[];
  studentListData?: IStudentDetails[];
  branchInfrastructureWisePlacesData?: ISearchSlotsData[];
  labFormInitialValue?: IFormInitialValue;
  disable?: boolean;
}

export interface ISlotFormSubmitData {
  [name: string]: string | undefined;
  start_time: string;
  end_time: string;
}

export interface IStudentListProps {
  students?: IStudentDetails[];
}

export interface IFormSubmitValue {
  start_time: string;
  end_time: string;
  [key: string]: string | undefined;
}
