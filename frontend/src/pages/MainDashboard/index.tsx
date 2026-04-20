import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loginSelector } from "src/state/Login/login.reducer";
import { userSelector } from "src/state/users/user.reducer";
import { Common } from "src/utils/constants/constant";
import Dashboard from "../Dashboard";
import NotFoundDashboard from "../NotFoundDashboard";
import { IUserRole } from "src/services/user/user.model";

function MainDashboard() {
  const [isCode, setIsCode] = useState<string[]>([]);
  const { userData } = useSelector(userSelector);
  const { userRoleId } = useSelector(loginSelector);

  useEffect(() => {
    let code: string[] = [];

    userData?.data?.user_roles.map((x: IUserRole) => {
      if (x.id === userRoleId) {
        x?.role?.role_permissions?.map((y) => {
          let data = y?.page_action?.page?.page_code;

          if (!code?.includes(data)) {
            code.push(y?.page_action?.page?.page_code);
          }
        });
      }
    });
    setIsCode(code);
  }, [userData]);

  return (
    <div>
      {Object.keys(Common.Modules.DASHBOARD).filter((permission) =>
        isCode?.includes(permission)
      ).length > 0 ? (
        <div>
          <Dashboard />
        </div>
      ) : (
        <>
          <NotFoundDashboard />
        </>
      )}
    </div>
  );
}

export default MainDashboard;
