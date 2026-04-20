import { Button, Form, Input, Select } from "antd";
import { IPattern, ISearchBoxProps } from "./SearchBox.model";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "src/state/users/user.reducer";
import { IUserRole } from "src/services/user/user.model";
import {
  loginSelector,
  setIsBranchSelected,
  setUserRoleId,
} from "src/state/Login/login.reducer";
import { AppDispatch } from "src/state/app.model";
import { userProfile } from "src/state/users/user.action";
import { useNavigate } from "react-router";
import { ability } from "src/ability";
import { useLocation, useSearchParams } from "react-router-dom";
import { Common, ZoneType } from "src/utils/constants/constant";
import { CreditCardOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Can } from "src/ability/can";
import { useEffect, useState } from "react";
import { InstallmentModal } from "./InstallmentModal/InstallmentModal";
import { searchAdmissionData } from "src/state/admission/admission.action";

const SearchBox = ({ styleName }: ISearchBoxProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { userData } = useSelector(userSelector);
  const { userRoleId } = useSelector(loginSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const [installmentModalOpen, setInstallmentModalOpen] =
    useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const getRoleIdWisePageCodeFind = (roleId: number) => {
    let allPageCode: string[] = [];

    userData?.data?.user_roles.map((userRole: IUserRole) => {
      if (userRole.id === roleId) {
        userRole?.role?.role_permissions?.map((rolePermissions) => {
          const pageCode = rolePermissions?.page_action?.page?.page_code;

          if (!allPageCode?.includes(pageCode)) {
            allPageCode.push(rolePermissions?.page_action?.page?.page_code);
          }
        });
      }
    });

    return allPageCode;
  };

  const rules = {
    gr_id: [
      { pattern: new RegExp(/^[0-9]+$/), message: "only Number Are Allowed" },
      {
        required: false,
        message: "Please enter GR ID",
      },
    ],
  };

  const handleChange = (value: number) => {
    dispatch(userProfile({})).then((res: any) => {
      const isZoneAvailable = res.payload.data.user_roles.find((x: IUserRole) =>
        x.id === value ? true : false
      );
      if (isZoneAvailable) {
        localStorage.setItem("myStorageID", value.toString());
        dispatch(setUserRoleId(value));
        const patterns: IPattern[] = [
          {
            pattern: /^\/batch\/\d+\/faculty(\?r=.+)?$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/batch\/\d+\/StudentDetailsList\?r=.+$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/batch\/\d+\/checkAttendence\?r=.+$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/batch\/\d+\/shiningSheet\?r=.+$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/batch\/\d+\/batch-completed-details$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/batch\/\d+\/StudentsMarks(\?r=.+)?(\&tab_id=\d+)?$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/\d+\/\d+\/StudentShiningSheet$/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
          {
            pattern: /^\/my-team-batches\/\d+\/faculty\?r=.+$/,
            redirect: "/my-team-batches",
            page_code: "ACADEMIC_MY_TEAM_BATCHES_VIEW",
          },
          {
            pattern: /^\/my-team-batches\/\d+\/StudentDetailsList\?r=.+$/,
            redirect: "/my-team-batches",
            page_code: "ACADEMIC_MY_TEAM_BATCHES_VIEW",
          },
          {
            pattern:
              /^\/my-team-batches\/\d+\/StudentsMarks(\?r=.+)?(\&tab_id=\d+)?$/,
            redirect: "/my-team-batches",
            page_code: "ACADEMIC_MY_TEAM_BATCHES_VIEW",
          },
          {
            pattern:
              /^\/branches\/\d+\/branchConfig(\?r=.+)?(\&current_tab=\d+)?$/,
            redirect: "/branches",
            page_code: "MASTER_BRANCHES",
          },
          {
            pattern: /^\/batch\/\d+\/lab-assign/,
            redirect: "/batch",
            page_code: "MASTER_BATCHES",
          },
        ];

        const matchingPattern = patterns.find((item) =>
          item.pattern.test(location.pathname + location.search)
        );
        if (matchingPattern) {
          const allPageCode: string[] = getRoleIdWisePageCodeFind(
            Number(value)
          );
          if (allPageCode?.includes(matchingPattern?.page_code)) {
            navigate(matchingPattern.redirect);
          } else {
            window.location.replace("/");
          }
        } else {
          const extractedPath = location.pathname?.split("/")[1];
          setTimeout(() => {
            window.location.replace(`/${extractedPath}`);
          }, 100);
        }
      } else {
        if (res.payload.data.user_roles.length > 0) {
          dispatch(setIsBranchSelected(false));
          navigate("/select-branch");
        } else {
          ability.update([]);
          dispatch(setIsBranchSelected(false));
          navigate("/access-denied");
        }
      }
    });
  };

  useEffect(() => {
    const grId = searchParams.get("gr_id");
    if (grId && grId !== "") {
      form.setFieldValue("gr_id", grId);
    } else {
      form.setFieldValue("gr_id", "");
    }
  }, [window.location.search]);

  const onFinish = () => {
    const gr_id = form.getFieldValue("gr_id");

    const permission = ability.can(
      Common.Actions.CAN_VIEW,
      Common.Modules.ADMISSION.VIEW_ADMISSION
    );

    if (gr_id && gr_id !== "") {
      if (!permission) {
        navigate("/not-found");
      } else {
        navigate(`/view-admission?gr_id=${gr_id}`);
        dispatch(searchAdmissionData({ gr_id }));
      }
    } else {
      setSearchParams({});
      dispatch(searchAdmissionData({ gr_id: "" }));
    }
  };

  return (
    <>
      <div className={`gx-search-bar ${styleName} gx-md-inline-block`}>
        <div className="navigation-icons gx-d-none gx-d-lg-flex">
          <div className="branch gx-d-none gx-d-md-inline-block gx-ml-4">
            <div
              className="branch-selected"
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Form
                className="GR-id-filter"
                id="gr_id"
                name="gr_id"
                form={form}
                autoComplete="off"
                requiredMark={true}
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "150px", marginBottom: 0 }}
              >
                <Form.Item
                  name="gr_id"
                  rules={rules.gr_id}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    style={{
                      outline: "none",
                      boxShadow: "none",
                      padding: "0",
                    }}
                    allowClear
                    size="large"
                    maxLength={9}
                    className="header-gr-id-filter"
                    placeholder="Search GR ID"
                    onFocus={(e) => {
                      e.target.style.outline = "none";
                      e.target.style.boxShadow = "none";
                      e.target.style.border = "none";
                    }}
                    onChange={(e) => {
                      if (!e.target.value) {
                        dispatch(searchAdmissionData({ gr_id: "" }));
                        setSearchParams({ gr_id: "" });
                      }
                    }}
                  />
                </Form.Item>
              </Form>
              <Can
                I={Common.Actions.CAN_VIEW}
                a={Common.Modules.REPORT.COUNSELLORS_INFORMATION}
              >
                <Button
                  icon={<QuestionCircleOutlined />}
                  onClick={() => {
                    navigate("/counsellor");
                  }}
                  className="help-button"
                  style={{
                    padding: "0px 8px",
                    height: "35px",
                  }}
                >
                  Course Information
                </Button>
              </Can>
              <Can
                I={Common.Actions.CAN_VIEW}
                a={Common.Modules.ADMISSION.ADMISSION_PENDING_AMOUNT}
              >
                <Button
                  icon={<CreditCardOutlined />}
                  onClick={() => {
                    setInstallmentModalOpen(true);
                  }}
                  className="help-button"
                  style={{
                    padding: "0px 8px",
                    height: "33px",
                  }}
                >
                  Pay
                </Button>
              </Can>

              <Select
                value={userRoleId}
                style={{ width: 300 }}
                options={userData.data.user_roles
                  ?.filter(
                    (role: IUserRole) =>
                      role.zone?.status === true &&
                      (role.zone.type === ZoneType.PUBLIC
                        ? true
                        : role.zone.branches &&
                          role?.zone?.branches?.find(
                            (branch) => branch.status === true
                          ))
                  )
                  .map((role: IUserRole) => {
                    if (role.zone.type === ZoneType.PUBLIC) {
                      return {
                        label: role.zone.name + ` (${role.role.name})`,
                        value: role.id,
                      };
                    } else {
                      return {
                        label:
                          role &&
                          role.zone.branches &&
                          (role.zone.branches.find((value) => value.code)
                            ?.code as string) + ` (${role.role.name})`,
                        value: role.id,
                      };
                    }
                  })
                  .sort((a, b) =>
                    (a?.label as string).localeCompare(b?.label as string)
                  )}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      {ability.can(
        Common.Actions.CAN_VIEW,
        Common.Modules.ADMISSION.ADMISSION_PENDING_AMOUNT
      ) &&
        installmentModalOpen && (
          <InstallmentModal
            installmentModalOpen={installmentModalOpen}
            setInstallmentModalOpen={setInstallmentModalOpen}
          />
        )}
    </>
  );
};
export default SearchBox;

SearchBox.defaultProps = {
  styleName: "",
  value: "",
};
