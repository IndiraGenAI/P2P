import type { ColumnsType } from "antd/es/table";
import React, { useMemo, useState, useEffect } from "react";
import {
  PlusOutlined,
  EditOutlined,
  FilterFilled,
  SettingOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Row,
  Col,
  Select,
  Input,
  message,
  Tooltip,
  Menu,
  Popover,
  Badge,
  Drawer,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../state/app.model";
import { useAppSelector } from "../../state/app.hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "antd/lib/card/Card";
import ContainerHeader from "src/components/ContainerHeader";
import TableComponent from "src/components/DataTable";
import { IStatus, IUserRecord, IUserRolesArry } from "./Users.model";
import { IUser } from "src/services/user/user.model";
import {
  createNewUser,
  editUserById,
  removeUserById,
  resetUserPassword,
  searchUserData,
  updateUserStatus,
  userProfile,
} from "src/state/users/user.action";
import { clearRemoveMessage, userSelector } from "src/state/users/user.reducer";
import DeleteButtonWithConfirmComponent from "src/components/DeleteButtonWithConfirm";
import DrawerComponent from "src/components/Drawer";
import UserAdd from "./Add";
import FloatLabel from "src/components/Form/FloatLabel";
import UserActionWrapper from "src/components/ActionWrapper/UserActionWrapper";
import {
  GetSortOrder,
  dateFormate,
  dateFormateWithTime,
  showTooltip,
  trimObject,
} from "src/utils/helperFunction";
import {
  AvailabilityType,
  Common,
  ROLE_TYPE_SEQUENCE,
  RoleType,
  availability_time,
} from "src/utils/constants/constant";
import { Can } from "src/ability/can";
import { ability } from "src/ability";
import CommonFilter from "src/components/CommonFilter";
import StudentMobileNumber from "src/components/StudentMobileNumber";
import { zoneSelector } from "src/state/zone/zone.reducer";
import { searchZoneData } from "src/state/zone/zone.action";
import { roleSelector } from "src/state/role/role.reducer";
import { searchRoleData } from "src/state/role/role.action";

const { Option } = Select;
const User = () => {
  const navigate = useNavigate();
  const [row, setRow] = useState<IUserRecord>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<IUser>();
  const [count, setCount] = useState<number>(0);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const userState = useAppSelector(userSelector);
  const { userData } = useSelector(userSelector);
  const zoneState = useAppSelector(zoneSelector);
  const roleState = useAppSelector(roleSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  const storageID: string | null = localStorage.getItem("myStorageID");

  const otherUserRoles = useMemo(() => {
    if (!data?.rows) return [];

    const filteredUsers = row?.roles
      ? data.rows.filter((user) => user.id !== row.id)
      : data.rows;

    return filteredUsers
      .flatMap((user) => user.user_roles)
      .filter((role) => role?.status)
      .map((role) => ({
        zone_id: role?.zone.id,
        role_id: role?.role.id,
        user_role_color: role?.user_role_color,
      }));
  }, [row, data]);

  const currentUserRole = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.role;

  const currentUserRoleType = currentUserRole?.type;
  const filteredRoles = roleState.rolesData.data.rows.filter((role) => {
    if (currentUserRoleType && role?.type) {
      const roleSequence = ROLE_TYPE_SEQUENCE[role?.type];
      return roleSequence >= ROLE_TYPE_SEQUENCE[currentUserRoleType];
    }
  });

  const updatePage = (values: IUserRecord) => {
    if (row) {
      const updatedValues = values.roles.map((obj1) => {
        const matchingObj = row?.user_roles?.find(
          (obj2) => obj1.id === obj2.id
        );
        return {
          ...obj1,
          availability_time:
            matchingObj?.availability_time ?? availability_time,
        };
      });
      values.roles = updatedValues;
      const data = {
        ...values,
        id: row.id,
        status: row.status,
      };
      dispatch(editUserById(trimObject(data))).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        if (searchParams) {
          dispatch(searchUserData(searchParams));
          if (userData.data?.id === data.id) {
            dispatch(userProfile());
          }
        }
      });
    } else {
      dispatch(createNewUser(trimObject(values))).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        dispatch(searchUserData(searchParams));
      });
    }
  };
  useEffect(() => {
    dispatch(searchUserData(searchParams)).then(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    if (userState.usersData.data) {
      setData(userState.usersData.data);
    }
    if (searchParams.get("skip") && searchParams.get("take")) {
      setPage(
        searchParams.get("skip") && searchParams.get("take")
          ? Number(searchParams.get("skip")) /
              Number(searchParams.get("take")) +
              1
          : 1
      );
    }
  }, [userState.usersData.data]);

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      form.resetFields();
    }
  }, [formValues]);

  useEffect(() => {
    let sum = 0;
    const data = Object.fromEntries(new URLSearchParams(searchParams));
    for (const [key, value] of Object.entries(data)) {
      if (
        key !== "orderBy" &&
        key !== "order" &&
        key !== "skip" &&
        key !== "take"
      ) {
        sum += 1;
      }
    }
    setCount(sum);
  }, [window.location.search]);

  const onCancel = () => {
    setShow(false);
    setFilterModalOpen(false);
  };

  const onReset = () => {
    setCount(0);
  };
  const change = () => {};

  const handledelete = (record: IUserRecord) => {
    dispatch(removeUserById(record.id)).then(() => {
      const searchData = Object.fromEntries(new URLSearchParams(searchParams));
      const { take, skip, ...rest } = searchData;
      data && data?.rows.length === 1
        ? setSearchParams({ take, ...rest })
        : setSearchParams(searchData);
      dispatch(searchUserData(searchData));
    });
  };
  const onFinish = (values: { [key: string]: string }) => {
    const queryString = Object.entries(trimObject(values))
      .filter(([key, values]) => values !== undefined && values !== "")
      .map(([key, values]) => key + "=" + encodeURIComponent(values as string))
      .join("&");
    setSearchParams(queryString);
    setFilterModalOpen(false);
  };

  const handleEdit = (record: IUserRecord) => {
    let roles = record.user_roles?.map((x) => ({
      id: x.id,
      zone_id: x.zone.id,
      role_id: x.role.id,
      user_role_color: x.user_role_color,
      status: x.status,
    }));
    if (roles && roles.length === 0) {
      roles.push({
        id: null,
        zone_id: null,
        role_id: null,
        user_role_color: "",
        status: true,
      });
    }
    const data = Object.assign({ roles: roles }, record);
    setRow(data);
  };

  useEffect(() => {
    if (userState.removeById.message) {
      if (userState.removeById.hasErrors) {
        message.error(userState.removeById.message);
      } else {
        message.success(userState.removeById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [userState.removeById.message]);

  useEffect(() => {
    if (userState.editById.message) {
      if (userState.editById.hasErrors) {
        message.error(userState.editById.message);
      } else {
        message.success(userState.editById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [userState.editById.message]);

  useEffect(() => {
    if (userState.createUsers.message) {
      if (userState.createUsers.hasErrors) {
        message.error(userState.createUsers.message);
      } else {
        message.success(userState.createUsers.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [userState.createUsers.message]);

  useEffect(() => {
    if (userState.updateById.message) {
      if (userState.updateById.hasErrors) {
        message.error(userState.updateById.message);
      } else {
        message.success(userState.updateById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [userState.updateById.message]);

  const handleClick = (e: IStatus, record: IUserRecord) => {
    if (record) {
      const data = {
        id: record.id,
        status: e.key,
      };
      dispatch(updateUserStatus(data)).then((res) => {
        dispatch(searchUserData(searchParams));
      });
    }
  };
  const onResetPassword = (id: number) => {
    if (id) {
      dispatch(resetUserPassword(id));
    }
  };

  useEffect(() => {
    dispatch(
      searchZoneData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        type: "",
        isFilter: true,
      })
    );
    dispatch(searchRoleData({ noLimit: true, orderBy: "name", order: "ASC" }));
  }, []);

  const columns: ColumnsType<IUserRecord> = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: false,
      align: "center",
      width: "4%",
      render: (text, record, index) => (
        <>{(page - 1) * Number(searchParams.get("take")) + index + 1}</>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "",
      sorter: true,
      width: "12%",
      render: (_, record) => {
        const maxLength = 40;
        return (
          <>
            <span>
              {showTooltip(
                record?.first_name + " " + record?.last_name,
                maxLength
              )}
            </span>
            <StudentMobileNumber studentMobileNumber={String(record?.phone)} />
          </>
        );
      },
    },

    {
      title: "Roles",
      dataIndex: ["user_roles"],
      width: "15%",
      render: (user_roles) => {
        return (
          <>
            <div className="roles-details user-role-details">
              {user_roles?.map((userRole: IUserRolesArry, index: number) => {
                if (index < 2) {
                  return (
                    <Tooltip
                      placement="bottomLeft"
                      title={
                        userRole.zone.code
                          ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                          .trimStart() +
                        " " +
                        userRole.role.name
                      }
                    >
                      <div className="gx-d-flex gx-align-items-center">
                        <Badge
                          className="user-badge"
                          color={`${
                            userRole.user_role_color
                              ? userRole.user_role_color
                              : "#FFCDCD"
                          }`}
                        />
                        <p className="gx-mb-1">
                          {userRole.zone.code
                            ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                            .trimStart()}{" "}
                          (
                          {`${userRole.role.name}${
                            userRole.availability !== AvailabilityType.FULL_TIME
                              ? `-${userRole.availability?.replace("_", " ")}`
                              : ""
                          }`}
                          )
                        </p>
                      </div>
                    </Tooltip>
                  );
                }
              })}

              {user_roles.length > 2 && (
                <>
                  <div className="user-popover">
                    <Popover
                      getPopupContainer={(parent) =>
                        parent.parentElement as HTMLElement
                      }
                      content={
                        <p className="gx-mb-1 role-modal">
                          {user_roles?.map((userRole: IUserRolesArry) => {
                            return (
                              <div className="gx-d-flex gx-align-items-center">
                                <Badge
                                  className="user-badge"
                                  color={`${
                                    userRole.user_role_color
                                      ? userRole.user_role_color
                                      : "#FFCDCD"
                                  }`}
                                />
                                <p className="gx-mb-1">
                                  {userRole.zone.code
                                    ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                                    .trimStart()}
                                  (
                                  {`${userRole.role.name}${
                                    userRole.availability !==
                                    AvailabilityType.FULL_TIME
                                      ? `-${userRole.availability?.replace(
                                          "_",
                                          " "
                                        )}`
                                      : ""
                                  }`}
                                  )
                                </p>
                              </div>
                            );
                          })}
                        </p>
                      }
                      placement="bottomLeft"
                      title="Roles"
                      trigger="click"
                    >
                      <Button type="primary">More</Button>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          </>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      width: "12%",
      render: (record) => {
        const maxLength = 30;
        return (
          <span className="tableEmail">{showTooltip(record, maxLength)}</span>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      width: "5%",
      align: "center",
      render: (record) => {
        return record.toLowerCase();
      },
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      sorter: true,
      width: "8%",
      align: "center",
      render: (record) => {
        return <>{dateFormate(record)}</>;
      },
    },
    {
      title: "Last Seen",
      dataIndex: "last_seen",
      sorter: true,
      align: "center",
      width: "8%",
      render: (record) => {
        return <>{dateFormateWithTime(record)}</>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "5%",
      align: "center",
      render: (record) => {
        return (
          <>
            {ability.can(
              Common.Actions.CAN_UPDATE,
              Common.Modules.USER_CONFIGURATION.USERS
            ) ||
            ability.can(
              Common.Actions.CAN_DELETE,
              Common.Modules.USER_CONFIGURATION.USERS
            ) ? (
              <UserActionWrapper>
                <Can
                  I={Common.Actions.CAN_UPDATE}
                  a={Common.Modules.USER_CONFIGURATION.USERS}
                >
                  <Button
                    className="btn_edit "
                    type="ghost"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      let showNew = !show;
                      setShow(showNew);
                      handleEdit(record);
                    }}
                  >
                    Edit
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_DELETE}
                  a={Common.Modules.USER_CONFIGURATION.USERS}
                >
                  <DeleteButtonWithConfirmComponent
                    title={"Are you sure want to delete User?"}
                    okText={"YES"}
                    cancelText={"NO"}
                    disabled={record.id === userData.data.id ? true : false}
                    onDelete={() => handledelete(record)}
                    children={"Delete"}
                  />
                </Can>
                <Can
                  I={Common.Actions.CAN_UPDATE}
                  a={Common.Modules.USER_CONFIGURATION.USERS}
                >
                  <Menu onClick={(e) => handleClick(e, record)}>
                    <>
                      {record && record.status === "PENDING" ? (
                        ""
                      ) : record.status === "DISABLE" ? (
                        <Menu.Item key="ENABLE">
                          <Button
                            className="btn_config gx-mr-2"
                            style={{ color: "#54b3ea" }}
                            icon={
                              <SettingOutlined
                                style={{ color: "#54b3ea", fontSize: "14px" }}
                              />
                            }
                            type="ghost"
                          >
                            Enable
                          </Button>
                        </Menu.Item>
                      ) : (
                        <Menu.Item key="DISABLE">
                          <Button
                            className="btn_config gx-mr-2"
                            style={{ color: "#54b3ea" }}
                            icon={
                              <SettingOutlined
                                style={{ color: "#54b3ea", fontSize: "14px" }}
                              />
                            }
                            type="ghost"
                          >
                            Disable
                          </Button>
                        </Menu.Item>
                      )}
                    </>
                  </Menu>
                </Can>
                <Can
                  I={Common.Actions.CAN_UPDATE}
                  a={Common.Modules.USER_CONFIGURATION.USERS}
                >
                  <Button
                    className="btn_config gx-mr-1 gx-ml-1 gx-mr-md-0 gx-ml-md-0"
                    type="ghost"
                    icon={<SettingOutlined className="config-icon" />}
                    onClick={() => navigate(`/userconfig/${record.id}`)}
                  >
                    Config
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_UPDATE}
                  a={Common.Modules.USER_CONFIGURATION.USERS}
                >
                  <Button
                    className="btn_config"
                    type="ghost"
                    icon={<RedoOutlined />}
                    onClick={() => onResetPassword(record.id)}
                  >
                    Reset Password
                  </Button>
                </Can>
              </UserActionWrapper>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];
  return (
    <div className="rnw-main-content">
      <Row align="middle" justify="space-between" gutter={24} className="mb-20">
        <Col xxl={12}>
          <ContainerHeader title="Users" />
        </Col>
        <Col xxl={12} className="text-align-right">
          <Button
            icon={<FilterFilled />}
            onClick={() => setFilterModalOpen(true)}
          >
            Filter
            <span>
              <Badge count={count}></Badge>
            </span>
          </Button>
          <Can
            I={Common.Actions.CAN_ADD}
            a={Common.Modules.USER_CONFIGURATION.USERS}
          >
            <Button
              type="primary"
              onClick={() => {
                setRow(undefined);
                setShow(true);
              }}
              icon={<PlusOutlined />}
            >
              <span className="gx-d-none gx-d-sm-inline-block gx-ml-1">
                User
              </span>
            </Button>
          </Can>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <>
            <>
              <div className="filter" style={{ height: "auto" }}>
                <Drawer
                  className="filter-drawer"
                  title="User Filter"
                  width="1000"
                  visible={filterModalOpen}
                  onClose={() => {
                    setFilterModalOpen(false);
                  }}
                  footer={[
                    <div className="gx-d-flex gx-justify-content-center">
                      <Button
                        className="cancel-filter gx-mr-0"
                        key="back"
                        onClick={onCancel}
                      >
                        <span className="gx-d-none gx-d-sm-block">Cancel</span>
                        <i className="fa fa-close gx-d-sm-none"></i>
                      </Button>
                      <Button
                        className="btn-apply-filter gx-mx-2"
                        key="submit"
                        type="primary"
                        loading={loading}
                        htmlType="submit"
                        form="myForm"
                      >
                        Apply Filter
                      </Button>
                      <Button
                        className="reset-filter"
                        type="default"
                        htmlType="reset"
                        form="myForm"
                      >
                        <span className="gx-d-none gx-d-sm-block">Reset</span>
                        <i className="fa fa-refresh gx-d-sm-none"></i>
                      </Button>
                    </div>,
                  ]}
                >
                  <CommonFilter
                    fielterData={(value) => onFinish(value)}
                    change={change}
                    reset={() => onReset()}
                  >
                    <Row gutter={24}>
                      <Col xs={24}>
                        <FloatLabel
                          label="First Name"
                          placeholder="Enter User First Name"
                          name="first_name"
                        >
                          <Form.Item name="first_name">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Last Name"
                          placeholder="Enter User Last Name"
                          name="last_name"
                        >
                          <Form.Item name="last_name">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="E-mail"
                          placeholder="Enter User E-mail"
                          name="email"
                        >
                          <Form.Item name="email">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Phone"
                          placeholder="Enter User Phone"
                          name="phone"
                        >
                          <Form.Item name="phone">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Role Name"
                          placeholder="Select Role"
                          name="role_name"
                        >
                          <Form.Item name="role_name">
                            <Select
                              size="large"
                              allowClear
                              showSearch
                              filterOption={(input, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase().trim())
                              }
                            >
                              {filteredRoles.map((roles) => (
                                <Option key={roles.id} value={roles.name}>
                                  {roles.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Role Type"
                          placeholder="Select Role Type"
                          name="role_type"
                        >
                          <Form.Item name="role_type">
                            <Select
                              size="large"
                              allowClear
                              showSearch
                              filterOption={(input, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase().trim())
                              }
                            >
                              <Option key="2" value={RoleType.ADMIN}>
                                ADMIN
                              </Option>
                              <Option key="4" value={RoleType.FACULTY}>
                                FACULTY
                              </Option>
                              <Option key="3" value={RoleType.FACULTY_HEAD}>
                                FACULTY_HEAD
                              </Option>
                              <Option key="5" value={RoleType.MANAGER}>
                                MANAGER
                              </Option>
                              <Option key="1" value={RoleType.SUPER_ADMIN}>
                                SUPER_ADMIN
                              </Option>
                              <Option
                                key="6"
                                value={RoleType.OPERATION_MANAGER}
                              >
                                OPERATION_MANAGER
                              </Option>
                              <Option key="7" value={RoleType.SALES_MANAGER}>
                                SALES_MANAGER
                              </Option>
                              <Option key="8" value={RoleType.ACCOUNT_MANAGER}>
                                ACCOUNT_MANAGER
                              </Option>
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Status"
                          placeholder="Select Status"
                          name="status"
                        >
                          <Form.Item name="status">
                            <Select size="large" allowClear>
                              <Option value="DISABLE">Disable</Option>
                              <Option value="ENABLE">Enable</Option>
                              <Option value="PENDING">Pending</Option>
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Zone Name"
                          placeholder="Select Zone"
                          name="zone_id"
                        >
                          <Form.Item name="zone_id">
                            <Select
                              size="large"
                              allowClear
                              showSearch
                              filterOption={(input, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase().trim())
                              }
                            >
                              {zoneState.zonesData.data.rows
                                .filter((zones) => zones.status === true)
                                .map((zones) => (
                                  <Option
                                    key={zones.id}
                                    value={zones.id.toString()}
                                  >
                                    {zones.code
                                      ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                                      .trimStart() +
                                      "-" +
                                      zones.name
                                        ?.replace(/^BC_|^B_|BC_$|B_$/g, "")
                                        .trimStart()}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                    </Row>
                  </CommonFilter>
                </Drawer>
              </div>
            </>

            <div className="filter" style={{ height: "auto" }}>
              {show && (
                <DrawerComponent
                  title={row ? "Edit User" : "Create New User"}
                  onClose={() => {
                    setShow(false);
                  }}
                  visible={show}
                  size={"large"}
                  footer={true}
                  label={row ? "Update" : "Submit"}
                  className="create-new-user"
                >
                  <UserAdd
                    data={row}
                    onSubmit={updatePage}
                    otherUserRoles={otherUserRoles}
                  />
                </DrawerComponent>
              )}
            </div>
          </>
          <Card className="rnw-card table-card gx-mb-0">
            <TableComponent
              columns={columns}
              dataSource={
                data?.rows.slice().sort(GetSortOrder("created_date", "DESC")) ||
                []
              }
              loading={loading}
              meta={data?.meta}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default User;
