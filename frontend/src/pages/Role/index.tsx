import type { ColumnsType } from "antd/es/table";
import React, { useState, useEffect } from "react";
import { PlusOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import {
  Button,
  Switch,
  Input,
  Form,
  Select,
  message,
  Row,
  Col,
  Badge,
  Drawer,
  Card,
} from "antd";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../state/app.model";
import { useAppSelector } from "../../state/app.hooks";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DrawerComponent from "../../components/Drawer";
import FloatLabel from "src/components/Form/FloatLabel";
import ContainerHeader from "src/components/ContainerHeader";
import TableComponent from "src/components/DataTable";
import DeleteButtonWithConfirmComponent from "src/components/DeleteButtonWithConfirm";
import {
  createNewRole,
  editRoleById,
  getRolePermissions,
  removeRoleById,
  searchRoleData,
  updateRoleStatus,
} from "src/state/role/role.action";
import { clearRemoveMessage, roleSelector } from "src/state/role/role.reducer";
import {
  bufferURLEncode,
  dateFormate,
  showTooltip,
  trimObject,
} from "src/utils/helperFunction";
import type { IRoleRecord } from "./Role.model";
import type { IRole } from "src/services/role/role.model";
import ActionWrapper from "src/components/ActionWrapper";
import RoleAdd from "./Add";
import { Common, RoleType } from "src/utils/constants/constant";
import { Can } from "src/ability/can";
import { ability } from "src/ability";
import CommonFilter from "src/components/CommonFilter";

const { Option } = Select;

const Role = () => {
  const [row, setRow] = useState<IRoleRecord>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<IRole>();
  const [count, setCount] = useState<number>(0);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const roleState = useAppSelector(roleSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  const updatePage = (values: IRoleRecord) => {
    if (row) {
      const data: IRoleRecord = {
        id: row.id,
        name: values.name,
        description: values.description,
        type: values.type,
      };
      dispatch(editRoleById(trimObject(data))).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        if (searchParams) {
          dispatch(searchRoleData(searchParams));
        }
      });
    } else {
      dispatch(createNewRole(trimObject({ ...values }) as never)).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        if (searchParams) {
          dispatch(searchRoleData(searchParams));
        }
      });
    }
  };

  const handleEdit = (record: IRoleRecord) => {
    setRow(record);
  };

  const onCancel = () => {
    setShow(false);
    setFilterModalOpen(false);
  };

  const onReset = () => {
    setCount(0);
  };
  const change = () => {};
  const handleStatus = (record: IRoleRecord, checked: boolean) => {
    const data = {
      id: record.id,
      status: checked,
    };
    dispatch(updateRoleStatus(data)).then(() => {
      dispatch(searchRoleData(searchParams));
    });
  };

  const handledelete = (record: IRoleRecord) => {
    dispatch(removeRoleById(record.id)).then(() => {
      const searchData = Object.fromEntries(new URLSearchParams(searchParams));
      const { take, skip, ...rest } = searchData;
      data && data?.rows.length === 1
        ? setSearchParams({ take, ...rest })
        : setSearchParams(searchData);
      dispatch(searchRoleData(searchData));
    });
  };

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      form.resetFields();
    }
  }, [formValues]);

  useEffect(() => {
    if (roleState.rolesData.data) {
      setData(roleState.rolesData.data);
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
  }, [roleState.rolesData.data]);

  useEffect(() => {
    dispatch(searchRoleData(searchParams)).then(() => setLoading(false));
  }, [searchParams]);

  const onFinish = (values: { [key: string]: string }) => {
    const queryString = Object.entries(trimObject(values))
      .filter(([key, values]) => values !== undefined && values !== "")
      .map(([key, values]) => key + "=" + encodeURIComponent(values as string))
      .join("&");
    setSearchParams(queryString);
    setFilterModalOpen(false);
  };

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

  useEffect(() => {
    if (roleState.removeById.message) {
      if (roleState.removeById.hasErrors) {
        message.error(roleState.removeById.message);
      } else {
        message.success(roleState.removeById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [roleState.removeById.message]);

  useEffect(() => {
    if (roleState.editById.message) {
      if (roleState.editById.hasErrors) {
        message.error(roleState.editById.message);
      } else {
        message.success(roleState.editById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [roleState.editById.message]);

  useEffect(() => {
    if (roleState.createRoles.message) {
      if (roleState.createRoles.hasErrors) {
        message.error(roleState.createRoles.message);
      } else {
        message.success(roleState.createRoles.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [roleState.createRoles.message]);

  useEffect(() => {
    if (roleState.updateById.message) {
      if (roleState.updateById.hasErrors) {
        message.error(roleState.updateById.message);
      } else {
        message.success(roleState.updateById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [roleState.updateById.message]);

  const gotoPermission = (record: IRoleRecord) => {
    const backURL = bufferURLEncode(`${location.pathname}${location.search}`);
    navigate(`/permissions/${record.id}?r=${backURL}`);
  };

  const columns: ColumnsType<IRoleRecord> = [
    {
      title: "No.",
      sorter: false,
      align: "center",
      width: "5%",
      render: (text, record, index) => (
        <>{(page - 1) * Number(searchParams.get("take")) + index + 1}</>
      ),
    },
    {
      title: "Role Name",
      dataIndex: "name",
      sorter: true,
      width: "30%",
      render: (record) => {
        const maxLength = 55;
        return <span>{showTooltip(record, maxLength)}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: true,
      width: "30%",
      render: (record) => {
        const maxLength = 55;
        return <span>{showTooltip(record, maxLength)}</span>;
      },
    },

    {
      title: "Type",
      dataIndex: "type",
      sorter: true,
      width: "10%",
      render: (status) => {
        return status;
      },
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      sorter: true,
      width: "10%",
      align: "center",
      render: (record) => {
        return <>{dateFormate(record)}</>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      key: "status",
      width: "8%",
      align: "center",
      render: (_, record) => {
        return (
          <>
            {ability.can(
              Common.Actions.CAN_UPDATE,
              Common.Modules.USER_CONFIGURATION.ROLES
            ) ? (
              <Switch
                key={`record-${record.id}`}
                defaultChecked={record.status}
                onClick={(e) => {
                  handleStatus(record, e);
                  message.destroy();
                }}
              />
            ) : (
              <>
                {record.status === true ? (
                  <p className="gx-mb-0">Active</p>
                ) : (
                  <p className="gx-mb-0">Inactive</p>
                )}
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      align: "center",
      render: (record) => {
        return (
          <>
            <ActionWrapper>
              <Can
                I={Common.Actions.CAN_UPDATE}
                a={Common.Modules.USER_CONFIGURATION.ROLES}
              >
                <Button
                  className="btn_edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setShow(true);
                    handleEdit(record);
                  }}
                >
                  Edit
                </Button>
              </Can>
              <Can
                I={Common.Actions.CAN_DELETE}
                a={Common.Modules.USER_CONFIGURATION.ROLES}
              >
                <DeleteButtonWithConfirmComponent
                  title={"Are you sure want to delete Role?"}
                  okText={"YES"}
                  cancelText={"NO"}
                  onDelete={() => handledelete(record)}
                  children={"Delete"}
                />
              </Can>
              <Can
                I={Common.Actions.CAN_ASSIGN_PERMISSION}
                a={Common.Modules.USER_CONFIGURATION.ROLES}
              >
                <Button
                  className="btn_edit"
                  type="text"
                  onClick={() => {
                    gotoPermission(record);
                    dispatch(getRolePermissions(Number(record.id)));
                  }}
                  icon={
                    <span className="anticon ">
                      <svg
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"
                        />
                      </svg>
                    </span>
                  }
                >
                  Permissions
                </Button>
              </Can>
            </ActionWrapper>
          </>
        );
      },
    },
  ];
  return (
    <div className="rnw-main-content">
      <Row align="middle" justify="space-between" gutter={24} className="mb-20">
        <Col xxl={12}>
          <ContainerHeader title="Roles" />
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
            a={Common.Modules.USER_CONFIGURATION.ROLES}
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
                Role
              </span>
            </Button>
          </Can>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <>
            <Form onFinish={onFinish} form={form} initialValues={formValues}>
              <div className="filter" style={{ height: "auto" }}>
                <Drawer
                  className="filter-drawer"
                  title="Role Filter"
                  size="large"
                  open={filterModalOpen}
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
                    fielterData={(value) =>
                      onFinish(value as { [key: string]: string })
                    }
                    change={change}
                    reset={() => onReset()}
                  >
                    <Row gutter={24}>
                      <Col xs={24}>
                        <FloatLabel
                          label="Name"
                          placeholder="Enter Role Name"
                          name="name"
                        >
                          <Form.Item name="name">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>

                      <Col xs={24}>
                        <FloatLabel
                          label="Description"
                          placeholder="Enter description"
                          name="description"
                        >
                          <Form.Item name="description">
                            <Input size="large" />
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                      <Col xs={24}>
                        <FloatLabel
                          label="Type"
                          placeholder="Select Type"
                          name="type"
                        >
                          <Form.Item name="type">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              size="large"
                              allowClear
                            >
                              <option key="1" value={RoleType.SUPER_ADMIN}>
                                SUPER_ADMIN
                              </option>
                              <option key="2" value={RoleType.ADMIN}>
                                ADMIN
                              </option>
                              <option key="3" value={RoleType.FACULTY_HEAD}>
                                FACULTY_HEAD
                              </option>
                              <option key="4" value={RoleType.FACULTY}>
                                FACULTY
                              </option>
                              <option key="5" value={RoleType.MANAGER}>
                                MANAGER
                              </option>
                              <option
                                key="6"
                                value={RoleType.OPERATION_MANAGER}
                              >
                                OPERATION_MANAGER
                              </option>
                              <option key="7" value={RoleType.SALES_MANAGER}>
                                SALES_MANAGER
                              </option>
                              <option key="8" value={RoleType.ACCOUNT_MANAGER}>
                                ACCOUNT_MANAGER
                              </option>
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
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              size="large"
                              allowClear
                            >
                              <Option value="true">Active</Option>
                              <Option value="false">Inactive</Option>
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                    </Row>
                  </CommonFilter>
                </Drawer>
              </div>
            </Form>

            <div className="filter" style={{ height: "auto" }}>
              {show && (
                <DrawerComponent
                  title={row ? "Edit Role" : "Create New Role"}
                  onClose={() => {
                    setShow(false);
                  }}
                  visible={show}
                  footer={true}
                  label={row ? "Update" : "Submit"}
                >
                  <RoleAdd data={row} onSubmit={updatePage} />
                </DrawerComponent>
              )}
            </div>
          </>
          <Card className="rnw-card roles table-card gx-mb-0">
            <TableComponent
              columns={columns}
              dataSource={roleState?.rolesData?.data?.rows || []}
              loading={loading}
              meta={data?.meta}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Role;
