import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Form,
  message,
  Row,
  Skeleton,
} from "antd";
import { LeftCircleFilled } from "@ant-design/icons";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppSelector } from "src/state/app.hooks";
import { AppDispatch } from "src/state/app.model";
import { getRolePermissions } from "src/state/role/role.action";
import { roleSelector } from "src/state/role/role.reducer";
import { saveRolePermissions } from "src/state/rolePermissions/rolePermissions.action";
import {
  clearMessage,
  rolePermissionSelector,
} from "src/state/rolePermissions/rolePermissions.reducer";
import { userSelector } from "src/state/users/user.reducer";
import {
  IPageAction,
  IPermission,
  IRolePermission,
  module,
  subModule,
} from "./Permission.model";
import { userProfile } from "src/state/users/user.action";
import ContainerHeader from "src/components/ContainerHeader";
import { ActionType } from "src/utils/constants/constant";
import _ from "lodash";
import { bufferURLDecode } from "src/utils/helperFunction";
const Permissions = () => {
  const { getPermissions } = useSelector(roleSelector);
  const { userData } = useSelector(userSelector);
  const rolePermissionsState = useAppSelector(rolePermissionSelector);
  const [module, setModule] = useState<module[]>();
  const [subModule, setSubModule] = useState<subModule[]>();
  const [value, setValue] = useState<CheckboxValueType[]>([]);
  const [title, setTitle] = useState<string>();
  let [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  let param = useParams();
  const { Panel } = Collapse;
  useEffect(() => {
    if (param.id) {
      const id = param.id;
      dispatch(getRolePermissions(Number(id))).then(() => {
        setLoading(false);
      });
    }

  }, []);

  useEffect(() => {
    if (rolePermissionsState.saveRolePermissions.message) {
      if (rolePermissionsState.saveRolePermissions.hasErrors) {
        message.error(rolePermissionsState.saveRolePermissions.message);
      } else {
        message.success(rolePermissionsState.saveRolePermissions.message);
      }
      dispatch(clearMessage());
    }

  }, [rolePermissionsState.saveRolePermissions.message]);

  useEffect(() => {
    let page: module[] = [];
    let subPage: module[] = [];

    getPermissions.data.pages.map((x: module) => {
      if (x.parent_page_id === null) {
        page.push(x);
      } else {
        subPage.push(x);
      }
    });
    setModule(page);
    setSubModule(subPage);
    setTitle(getPermissions.data.name);
  }, [getPermissions]);

  useEffect(() => {
    setTitle("");
  }, []);

  const onFinish = () => {
    const permissionData: IPermission = {
      page_action_ids: value.filter((x) => !!x),
      role_id: Number(param.id),
      created_by: userData.data.id,
    };
    dispatch(saveRolePermissions(permissionData)).then(() => {
      dispatch(userProfile({}));
    });
  };

  useEffect(() => {
    const data = getPermissions.data.role_permissions.map(

      (x: IRolePermission) => {
        if (x !== undefined) return x.page_action?.id;
      }
    ) as CheckboxValueType[];

    setValue(data);
  }, [getPermissions]);

  const onChangeCheckAll = (e: any, value: IPageAction[]) => {
    const values = value.map((x: IPageAction) => x.id);
    if (e.target.checked) {
      values.forEach((x: CheckboxValueType) => {
        setValue((prev: CheckboxValueType[]) => {
          if (!prev.includes(x)) {
            return [...prev, x];
          } else {
            return [...prev];
          }
        });
      });
    }
  };

  const onChangeUnCheckAll = (e: any, value: IPageAction[]) => {
    const values = value.map((x: IPageAction) => x.id);
    if (e.target.checked) {
      values.forEach((x: CheckboxValueType) => {
        setValue((prev: CheckboxValueType[]) => {
          return prev.filter(
            (x: CheckboxValueType) => !values.includes(Number(x))
          );
        });
      });
    }
  };

  const onChange = (e: any) => {
    if (e.target.checked) {
      setValue((prev) => {
        return [...prev, e.target.value];
      });
    } else {
      setValue((prev) => {
        return prev.filter((x) => x !== e.target.value);
      });
    }
  };

  let checker = (arr: CheckboxValueType[], target: CheckboxValueType[]) =>
    target.every((v: CheckboxValueType) => arr.includes(v));

  let unChecker = (arr: CheckboxValueType[], target: CheckboxValueType[]) =>
    target.every((v: CheckboxValueType) => !arr.includes(v));

  let roleURl = "/roles";
  const url = searchParams.get("r");
  if (url) {
    const backURL = bufferURLDecode(url);
    roleURl = backURL;
  } else {
    roleURl = "/roles";
  }

  return (
    <>
      <Skeleton loading={loading} active avatar>
        <Row
          align="middle"
          justify="space-between"
          gutter={24}
          className="mb-20"
        >
          <Col xxl={24} className="gx-d-flex gx-align-items-center">
            <Link to={roleURl} className="back-btn gx-mr-3">
              <LeftCircleFilled />
            </Link>
            <ContainerHeader
              title={getPermissions.data.name ? getPermissions.data.name : ""}
            />
          </Col>
        </Row>

        <Form onFinish={onFinish}>
          <Collapse
            className="permission-info"
            defaultActiveKey={["1"]}
            key={"1"}
          >
            {module &&
              module.map((x: module, index: number) => {
                return (
                  <Panel header={x.name} key={index + 1}>
                    {subModule &&
                      subModule
                        .filter((y: subModule) => y.parent_page_id === x.id)
                        .map((y: subModule, index: number) => {
                          const pageActionId: number | undefined =
                            y.page_actions.find(
                              (p) => p.action.action_code === ActionType.VIEW
                            )?.id;
                          return (
                            <React.Fragment key={index}>
                              <Form.Item
                                className="permission-content"
                                label={y.name}
                              >
                                <Checkbox.Group
                                  key={index}
                                  options={y.page_actions.map(
                                    (z: IPageAction) => {
                                      return {
                                        label: z.action.name,
                                        value: z.id,
                                        onChange(e) {
                                          const checkView = y.page_actions.find(
                                            (p) =>
                                              p.action.action_code ===
                                              ActionType.VIEW
                                          )?.id as number;
                                          if (
                                            z.action.action_code ===
                                              ActionType.CREATE ||
                                            z.action.action_code ===
                                              ActionType.DELETE ||
                                            z.action.action_code ===
                                              ActionType.UPDATE ||
                                            z.action.action_code ===
                                              ActionType.FULL_VIEW ||
                                            z.action.action_code ===
                                              ActionType.EXPORT_DATA ||
                                            z.action.action_code ===
                                              ActionType.HOLD_BATCH ||
                                            z.action.action_code ===
                                              ActionType.ASSIGN_PERMISSION ||
                                            z.action.action_code ===
                                              ActionType.DELETE
                                          ) {
                                            setValue((prev) => {
                                              return [...prev, checkView];
                                            });
                                          }
                                          if (
                                            e.target.checked === false &&
                                            z.action.action_code ===
                                              ActionType.VIEW
                                          ) {
                                            let moduleIds: number[] = [];
                                            y.page_actions.map((c) =>
                                              moduleIds.push(c.id)
                                            );
                                            setValue((prev) => {
                                              let removePrev = _.pullAll(
                                                prev,
                                                moduleIds
                                              );
                                              return [...removePrev, checkView];
                                            });
                                          }
                                          onChange(e);
                                        },
                                      };
                                    }
                                  )}
                                  value={value}
                                />
                                <div className="all-none">
                                  <Checkbox
                                    className="check-all-checkbox"
                                    onChange={(e) =>
                                      onChangeCheckAll(e, y.page_actions)
                                    }
                                    checked={checker(
                                      value,
                                      y.page_actions.map((x) => x.id)
                                    )}
                                  >
                                    All
                                  </Checkbox>
                                  <Checkbox
                                    className="check-all-checkbox"
                                    onChange={(e) =>
                                      onChangeUnCheckAll(e, y.page_actions)
                                    }
                                    checked={unChecker(
                                      value,
                                      y.page_actions.map((x) => x.id)
                                    )}
                                  >
                                    None
                                  </Checkbox>
                                </div>
                              </Form.Item>
                            </React.Fragment>
                          );
                        })}
                  </Panel>
                );
              })}
          </Collapse>
          <div className="gx-text-right gx-pt-2 gx-pb-3">
            <Button
              className="gx-mb-1 gx-mb-md-0"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
            <Button
              className="btn-cancel "
              onClick={() => {
                const url = searchParams.get("r");
                if (url) {
                  const backURL = bufferURLDecode(url);
                  navigate(backURL);
                } else {
                  navigate(`/roles`);
                }
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Skeleton>
    </>
  );
};

export default Permissions;
