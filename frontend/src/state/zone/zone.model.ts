import { IZone} from "../../services/zone/zone.model";

export interface IZoneState {
  removeById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };

  updateById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };

  editById: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  createZones: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
  };
  zonesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data:IZone;
  };
  allZonesData: {
    loading: boolean;
    hasErrors: boolean;
    message: string;
    data:IZone;
  };
}
