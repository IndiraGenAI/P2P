import type { IGstList } from "src/services/gst/gst.model";

export interface IGstMasterState {
  gstsData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IGstList;
  };
  createGst: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
