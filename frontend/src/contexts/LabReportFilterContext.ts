import { createContext } from "react";

export const LabReportFilterContext = createContext({
  masterSelectedBranch: [] as number[],
  setMasterSelectedBranch: (value: number[]) => {},
  masterSelectedZone: [] as number[],
  setMasterSelectedZone: (value: number[]) => {},
  refetchAvailablePcsTimeWiseData: 0 as number,
  setRefetchAvailablePcsTimeWiseData: (value: number) => {},
});
