import { IBranchInfrastructureDetails } from "src/services/BranchInfrastructure/branchInfrastructure.model";

export interface IShowPlaces {
  placeAssignDrawer: boolean;
  setPlaceAssignDrawer: (active: boolean) => void;
  placesData: IBranchInfrastructureDetails | null;
}

export interface ISelectedHardwareDetails {
  id: number;
  hardware_id?: number | null;
  is_laptop?: boolean;
  branch_infrastructure_id?: number | null;
}

export interface IHardwareEditApi {
  branch_infrastructure_id?: number;
  places: ISelectedHardwareDetails[];
}
