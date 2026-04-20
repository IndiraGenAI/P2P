export interface IFilterStateData {
    analysisSelectedFaculty: number | undefined;
    analysisSelectedZone:number[];
    analysisSelectedBranch:  number[];
}
export interface INewFilterStateData {
    user_id?: number | undefined;
    zone_id?:number[];
    branch_id?:  number[];
    range:  number[];
    range_start ?: number;
    range_end ?: number;
    start_range ?: number;
    end_range ?: number;
}

export interface FilterStateAndMethod {
    analysisSelectedBranch: number[];
    analysisSelectedRange: number[];
    analysisSelectedZone: number[];
    setAnalysisSelectedRange: (data:number[]) => void;
    setAnalysisSelectedFaculty: (data:number | undefined) => void;
    analysisSelectedFaculty: number | undefined;
    setAnalysisSelectedZone: (data:number[]) => void;
    setAnalysisSelectedBranch: (data:number[]) => void;
    isShowRangeFilter ?: boolean;
    step : number;
    setAllFilterState?: React.Dispatch<React.SetStateAction<IFilterStateData>>;
    allFilterState?: IFilterStateData;
    filterState?: any;
    setFilterState?: any;
    formValues?: any;
}


