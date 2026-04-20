import React, { useContext, useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Radio, RadioChangeEvent } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { IUserRole } from "src/services/user/user.model";
import {
  setIsBranchSelected,
  setUserRoleId,
} from "src/state/Login/login.reducer";
import { AppDispatch } from "src/state/app.model";
import { userSelector } from "src/state/users/user.reducer";
import { ability, convertAbility } from "src/ability";
import { rules } from "src/utils/models/common";
import { SidebarPermissionCodeContext } from "src/contexts/sidebarPermissionCodeContext";
import { logoutUser } from "src/state/Login/login.action";
import { ZoneType } from "src/utils/constants/constant";
import { userProfile } from "src/state/users/user.action";

const UserBranchSelection = () => {
  const { userData } = useSelector(userSelector);
  const [selectId, setSelectId] = useState<number | null>(null);
  const [button, setButton] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { setIsCode } = useContext(SidebarPermissionCodeContext);
  const data: string | null = localStorage.getItem("myStorageID");
  const onChange = (e: RadioChangeEvent) => {
    setSelectId(e.target.value);
    setButton(false);
    localStorage.setItem("myStorageID", JSON.stringify(e.target.value));
    dispatch(setUserRoleId(e.target.value));
    let code: string[] = [];
    userData &&
      userData.data?.user_roles.map((x) => {
        if (x.id === e.target.value) {
          x?.role?.role_permissions?.map((y) => {
            let data = y?.page_action?.page?.page_code;
            if (!code?.includes(data)) {
              code.push(y?.page_action?.page?.page_code);
            }
          });
        }
      });

    setIsCode(code);
  };
  const sortedUserRoles = [...(userData.data.user_roles || [])].sort(
    (a: IUserRole, b: IUserRole) => {
      if (a.zone.type === b.zone.type) {
        return a.zone.name.localeCompare(b.zone.name);
      }
      if (a.zone.type === "PUBLIC") {
        return -1;
      }
      if (b.zone.type === "PUBLIC") {
        return 1;
      }
      return 0;
    }
  );

  const backToLogin = async () => {
    localStorage.removeItem("myStorageID");
    await dispatch(logoutUser()).then(() => {
      navigate("/login");
      setIsCode([]);
    });
  };

  return (
    <div className="single-branch">
      <div className="single-branch-list">
        <>
          <div className="gx-d-flex gx-justify-content-between gx-align-items-center">
            <h2 className="gx-w-100">Branch List</h2>
            {/* <Button type="primary" onClick={() => backToLogin()}>
              Back
            </Button> */}
          </div>
          <div>
            {sortedUserRoles
              .filter(
                (role: IUserRole) =>
                  role.zone?.status === true &&
                  (role.zone.type === ZoneType.PUBLIC
                    ? true
                    : role.zone.branches &&
                      role?.zone?.branches?.find(
                        (branch) => branch.status === true
                      ))
              )
              .map((role: IUserRole) => (
                <Radio
                  checked={role.id === selectId}
                  value={role.id}
                  onChange={onChange}
                  className="custom-branch-selection"
                  key={role.id}
                >
                  {role.zone.type === "PUBLIC" ? (
                    <>
                      {role.zone.name} ({role.role.name})
                      <CheckCircleFilled />
                    </>
                  ) : (
                    <>
                      {role.zone.branches?.find((branch) => branch?.code)?.code}{" "}
                      ({role.role.name})
                      <CheckCircleFilled />
                    </>
                  )}
                </Radio>
              ))}
          </div>
        </>
        <Button
          type="primary"
          className="gx-d-block gx-w-100 gx-mt-2 gx-mt-md-4"
          onClick={() => {
            dispatch(setIsBranchSelected(true));
            dispatch(userProfile()).then((res) => {
              if (res.payload.data.user_roles.length > 0) {
                const data = res.payload.data.user_roles.find(
                  (value: IUserRole) => value.id === selectId
                );
                const rules = convertAbility(
                  data?.role.role_permissions || []
                ) as rules;
                ability.update(rules);
                navigate("/", { replace: true });
              }
            });
          }}
          disabled={button}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default UserBranchSelection;
