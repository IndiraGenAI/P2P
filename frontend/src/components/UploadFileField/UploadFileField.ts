import { FormInstance } from "antd";

export interface IUploadedFileProps {
  uploadedImage?: string;
  setUploadedImage?:any
  isEdit?:boolean
  name: string | [number, string];
  showUploadButton: boolean;
  isViewAdmission?: boolean;
  isBranches?:boolean;
  showUploadList?: boolean;
  isAdmissionPage?: boolean;
  rulse?: { required: boolean; message: string }[];
  className?: string;
  form?:FormInstance;

  acceptType?: boolean;
}
export interface IPrev {
  aadhar_card : string;
  admission_id : number;
  created_by : string;
  created_date : string;
  form : string;
  id : number;
  last_passing_marksheet : string;
  photos : string;
  updated_by : string;
  updated_date : string;
}