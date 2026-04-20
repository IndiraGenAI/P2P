import React, { useContext } from "react";
import { SidebarPermissionCodeContext } from "src/contexts/sidebarPermissionCodeContext";
import { Common } from "src/utils/constants/constant";
import NotFoundDashboard from "../NotFoundDashboard";
import StatisticsDashboard from "../StatisticsDashboard";

const MainStatisticsDashboard = () => {
  const { isCode } = useContext(SidebarPermissionCodeContext);

  return (
    <div>
      {Object.keys(Common.Modules.STATISTICS_DASHBOARD).filter((permission) =>
        isCode?.includes(permission),
      ).length > 0 ? (
        <div>
          <StatisticsDashboard />
        </div>
      ) : (
        <NotFoundDashboard />
      )}
    </div>
  );
};

export default MainStatisticsDashboard;
