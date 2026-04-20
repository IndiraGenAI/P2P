import { Moment } from "moment";
import { createContext } from "react";

export const MasterDahsboardFilterContext = createContext({
masterSelectedBranch:[] as number[], setMasterSelectedBranch: (value: number[])=> {},
masterSelectedZone:[] as number[], setMasterSelectedZone: (value: number[])=> {},
masterSelectedFaculty:undefined as number |undefined, setMasterSelectedFaculty: (value: number |undefined)=> {},
masterSelectedDate: null as   [Moment | null, Moment | null] | null, setMasterSelectedDate: (value:  [Moment | null, Moment | null] | null)=> {},
masterOnlineBranchId : null as null |number | undefined, setMasterOnlineBranchId: (value : number | null | undefined) => {},
isOnlineFilter :false as boolean , setIsOnlineFilter:(value : boolean) => {},
isOfflineFilter :false as boolean , setIsOfflineFilter:(value : boolean) => {},
activeTab : "student" as string , setActiveTab:(value : string) => {},
});