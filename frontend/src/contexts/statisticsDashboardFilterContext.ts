import { createContext, Dispatch, SetStateAction } from "react";
import { IGlobalFilterState } from "src/components/StatisticsDashboardGlobalFilter/StatisticsDashboardGlobalFilter.model";

export const StatisticsDashboardFilterContext = createContext<{
    statisticsDashboardGlobalFilter: IGlobalFilterState;
    setStatisticsDashboardFilter: Dispatch<SetStateAction<IGlobalFilterState>>;
}>({
    statisticsDashboardGlobalFilter: {} as IGlobalFilterState,
    setStatisticsDashboardFilter: (() => {}) as Dispatch<SetStateAction<IGlobalFilterState>>,
});