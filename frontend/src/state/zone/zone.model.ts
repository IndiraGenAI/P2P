import type { IZoneList } from "src/services/zone/zone.model";

export interface IZoneMasterState {
  zonesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data: IZoneList;
  };
  createZone: { loading: boolean; hasErrors: boolean; message: string };
  editById: { loading: boolean; hasErrors: boolean; message: string };
  removeById: { loading: boolean; hasErrors: boolean; message: string };
  updateById: { loading: boolean; hasErrors: boolean; message: string };
}
