import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { PlusOutlined, EditOutlined, FilterFilled } from "@ant-design/icons";
import {
  Button,
  Switch,
  Input,
  Form,
  Select,
  message,
  Card,
  Col,
  Row,
  Badge,
  Drawer,
  Popover,
} from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/app.model";
import { useAppSelector } from "../../state/app.hooks";
import {
  clearRemoveMessage,
  departmentSelector,
} from "../../state/department/department.reducer";
import {
  createNewDepartment,
  editDepartmentById,
  removeDepartmentById,
  searchDepartmentData,
  updateDepartmentStatus,
} from "../../state/department/department.action";
import { useSearchParams } from "react-router-dom";
import { Idepartment } from "../../services/departments/departments.model";
import DrawerComponent from "../../components/Drawer";
import {
  IBranchData,
  IDepartmentBranch,
  IDepartmentRecord,
} from "./Department.model";
import DepartmentAdd from "./Add";
import TableComponent from "../../components/DataTable";
import DeleteButtonWithConfirmComponent from "../../components/DeleteButtonWithConfirm";
import ContainerHeader from "src/components/ContainerHeader";
import FloatLabel from "src/components/Form/FloatLabel";
import ActionWrapper from "src/components/ActionWrapper";
import { dateFormate, showTooltip, trimObject } from "src/utils/helperFunction";
import { branchSelector } from "src/state/branch/branch.reducer";
import { searchBranchData } from "src/state/branch/branch.action";
import { Common } from "src/utils/constants/constant";
import { Can } from "src/ability/can";
import { ability } from "src/ability";
import CommonFilter from "src/components/CommonFilter";

const { Option } = Select;

const Department = () => {
  const [row, setRow] = useState<IDepartmentRecord>();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<Idepartment>();
  const departmentState = useAppSelector(departmentSelector);
  const branchState = useAppSelector(branchSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [count, setCount] = useState<number>(0);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  useEffect(() => {
    const data = { ...setFormValues, ...dataConvertFromSearchParm() };
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      Object.assign(data, {
        [key]: value,
      });
    }
    setFormValues(data);
  }, []);

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      form.resetFields();
    }
  }, [formValues]);

  const handledelete = (record: IDepartmentRecord) => {
    dispatch(removeDepartmentById(record.id)).then((res) => {
      if (res.payload) {
        const searchData = Object.fromEntries(
          new URLSearchParams(searchParams)
        );
        const { take, skip, ...rest } = searchData;
        data && data?.rows.length === 1
          ? setSearchParams({ take, ...rest })
          : setSearchParams(searchData);
        dispatch(searchDepartmentData(searchData));
      }
    });
  };
  useEffect(() => {
    dispatch(
      searchBranchData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        isAllBranch: true,
      })
    );
  }, []);

  useEffect(() => {
    if (departmentState.removeById.message) {
      if (departmentState.removeById.hasErrors) {
        message.error(departmentState.removeById.message);
      } else {
        message.success(departmentState.removeById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [departmentState.removeById.message]);

  useEffect(() => {
    if (departmentState.editById.message) {
      if (departmentState.editById.hasErrors) {
        message.error(departmentState.editById.message);
      } else {
        message.success(departmentState.editById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [departmentState.editById.message]);

  useEffect(() => {
    if (departmentState.createDepartments.message) {
      if (departmentState.createDepartments.hasErrors) {
        message.error(departmentState.createDepartments.message);
      } else {
        message.success(departmentState.createDepartments.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [departmentState.createDepartments.message]);

  useEffect(() => {
    if (departmentState.updateById.message) {
      if (departmentState.updateById.hasErrors) {
        message.error(departmentState.updateById.message);
      } else {
        message.success(departmentState.updateById.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [departmentState.updateById.message]);

  useEffect(() => {
    if (departmentState.departmentsData.data) {
      setData(departmentState.departmentsData.data);
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
  }, [departmentState.departmentsData.data]);

  const dataConvertFromSearchParm = () => {
    let data = {};
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      if (value == "") {
        setSearchParams("");
        data = "";
      }
      if (key === "branch_id") {
        Object.assign(data, {
          ["branch_ids"]: value.split(","),
        });
      } else {
        Object.assign(data, {
          [key]: value,
        });
      }
    }
    return data;
  };
  useEffect(() => {
    dispatch(searchDepartmentData(dataConvertFromSearchParm())).then(() => {
      setLoading(false);
    });
  }, [searchParams]);

  const onFinish = (values: { [key: string]: string }) => {
    let queryString = Object.entries(trimObject(values))
      .filter(
        ([key, values]) =>
          values !== undefined &&
          values !== "" &&
          (Array.isArray(values) ? values.length > 0 : values)
      )
      .map(([key, values]) => key + "=" + encodeURIComponent(values as string))
      .join("&");
    setSearchParams(queryString);
    setFilterModalOpen(false);
  };

  const updatePage = (values: IDepartmentRecord) => {
    if (row) {
      let branch_departments: IDepartmentBranch[] = [];
      if (Array.isArray(values.branch_id)) {
        values.branch_id?.map((item) => {
          row.branch_departments.map((x) => {
            if (item === x.branch_id) {
              let obj = { branch_id: item, id: x.id };
              branch_departments.push(obj);
            }
          });
        });
      }
      let array1 = row.branch_departments.map((x) => x.branch_id);
      let array2 = values.branch_id;
      if (array1 && array2) {
        let difference = array2.filter((x: number) => !array1?.includes(x));
        if (difference.length > 0) {
          difference.map((x: number) => {
            let obj = { branch_id: x };
            branch_departments.push(obj);
          });
        }
      }
      values = { ...values, branch_departments };
      const { branch_id, ...rest } = values;

      const data: IDepartmentRecord = {
        ...rest,
        id: row.id,
      };
      dispatch(editDepartmentById(trimObject(data))).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        if (searchParams) {
          dispatch(searchDepartmentData(dataConvertFromSearchParm()));
        }
      });
    } else {
      let branch_departments: IDepartmentBranch[] = [];
      if (Array.isArray(values.branch_id)) {
        values.branch_id.map((item) => {
          let obj = { branch_id: item };
          branch_departments.push(obj);
        });
      }
      values = { ...values, branch_departments };
      const { branch_id, ...rest } = values;
      dispatch(createNewDepartment(trimObject(rest))).then((res) => {
        if (res.payload) {
          setShow(false);
        }
        if (searchParams) {
          dispatch(searchDepartmentData(dataConvertFromSearchParm()));
        }
      });
    }
  };

  const onCancel = () => {
    setShow(false);
    setFilterModalOpen(false);
  };

  const handleEdit = (record: IDepartmentRecord) => {
    setRow(record);
  };

  const onReset = () => {
    setCount(0);
  };
  const change = () => {};
  const handleStatus = (record: IDepartmentRecord, checked: boolean) => {
    const data = {
      id: record.id,
      status: checked,
    };
    dispatch(updateDepartmentStatus(data)).then(() => {
      dispatch(searchDepartmentData(dataConvertFromSearchParm()));
    });
  };

  const columns: ColumnsType<IDepartmentRecord> = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: false,
      align: "center",
      width: "5%",
      render: (text, record, index) => (
        <>{(page - 1) * Number(searchParams.get("take")) + index + 1}</>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      width: "25%",
      render: (record) => {
        const maxLength = 40;
        return <span>{showTooltip(record, maxLength)}</span>;
      },
    },
    {
      title: "Code ",
      dataIndex: "code",
      sorter: true,
      width: "25%",
    },
    {
      title: "Branch Code",
      dataIndex: "branch_departments",
      width: "10%",
      render: (branch_departments) => {
        return (
          <>
            <div className="roles-details gx-d-flex ">
              {branch_departments?.map((x: IBranchData, index: number) => {
                if (index < 1) {
                  return (
                    <>
                      <p className="gx-mb-1">{x.branch.code}</p>
                    </>
                  );
                }
              })}
              {branch_departments.length > 1 && (
                <>
                  <div className="gx-ml-2">
                    <Popover
                      content={
                        <p className="gx-mb-1 role-modal-details ">
                          {branch_departments?.map((branch: IBranchData) => {
                            const branchClass =
                              branch.branch.status === false
                                ? "inactive-status"
                                : "";
                            return (
                              <p className={`gx-mb-1 ${branchClass}`}>
                                {branch.branch.code}
                              </p>
                            );
                          })}
                        </p>
                      }
                      placement="bottomRight"
                      title="Branches"
                      trigger="click"
                      getPopupContainer={(parent) =>
                        parent.parentElement as HTMLElement
                      }
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
      title: "Created Date",
      dataIndex: "created_date",
      sorter: true,
      align: "center",
      width: "10%",
      render: (record) => {
        return <>{dateFormate(record)}</>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      key: "status",
      align: "center",
      width: "8%",
      render: (_, record) => {
        return (
          <>
            {ability.can(
              Common.Actions.CAN_UPDATE,
              Common.Modules.MASTER.DEPARTMENTS
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
            {ability.can(
              Common.Actions.CAN_UPDATE,
              Common.Modules.MASTER.DEPARTMENTS
            ) ||
            ability.can(
              Common.Actions.CAN_DELETE,
              Common.Modules.MASTER.DEPARTMENTS
            ) ? (
              <ActionWrapper>
                <Can
                  I={Common.Actions.CAN_UPDATE}
                  a={Common.Modules.MASTER.DEPARTMENTS}
                >
                  <Button
                    className="btn_edit"
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
                  a={Common.Modules.MASTER.DEPARTMENTS}
                >
                  <DeleteButtonWithConfirmComponent
                    title={"Are you sure want to delete sector?"}
                    okText={"YES"}
                    cancelText={"NO"}
                    onDelete={() => handledelete(record)}
                    children={"Delete"}
                  />
                </Can>
              </ActionWrapper>
            ) : (
              ""
            )}
          </>
        );
      },
    },
  ];

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

  return (
    <div className="rnw-main-content">
      <Row align="middle" justify="space-between" gutter={24} className="mb-20">
        <Col xxl={18}>
          <ContainerHeader title="Sectors" />
        </Col>
        <Col xxl={6} className="text-align-right">
          <Button
            icon={<FilterFilled />}
            onClick={() => setFilterModalOpen(true)}
          >
            Filter
            <span>
              <Badge count={count}></Badge>
            </span>
          </Button>
          <Can I={Common.Actions.CAN_ADD} a={Common.Modules.MASTER.DEPARTMENTS}>
            <Button
              type="primary"
              onClick={() => {
                setRow(undefined);
                setShow(true);
              }}
              icon={<PlusOutlined />}
            >
              <span className="gx-d-none gx-d-sm-inline-block gx-ml-1">
                Sector
              </span>
            </Button>
          </Can>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <div className="filter" style={{ height: "auto" }}>
            <Drawer
              className="filter-drawer"
              title="Sector Filter"
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
                      label="Name"
                      placeholder="Enter Sector Name"
                      name="name"
                    >
                      <Form.Item name="name">
                        <Input size="large" />
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <FloatLabel
                      label="Code"
                      placeholder="Enter Sector Code"
                      name="code"
                    >
                      <Form.Item name="code">
                        <Input size="large" />
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <FloatLabel
                      label="Branch Code"
                      placeholder="Select Branch Code"
                      name="branch_id"
                    >
                      <Form.Item name="branch_id">
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          mode="multiple"
                          showArrow
                          allowClear
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children?.toString() || "")
                              .toLowerCase()
                              .includes(input.toLowerCase().trim())
                          }
                        >
                          {branchState.branchesData.data.rows.map((branch) => (
                            <Option value={branch.id.toString()}>
                              {branch.code}
                            </Option>
                          ))}
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
                          getPopupContainer={(trigger) => trigger.parentNode}
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

          <div className="filter">
            {show && (
              <DrawerComponent
                title={row ? "Edit Sector" : "Create New Sector"}
                onClose={() => {
                  setShow(false);
                }}
                visible={show}
                footer={true}
                label={row ? "Update" : "Submit"}
              >
                <DepartmentAdd data={row} onSubmit={updatePage} />
              </DrawerComponent>
            )}
          </div>

          <Card className="rnw-card departments gx-mb-0">
            <TableComponent
              columns={columns}
              dataSource={departmentState.departmentsData.data?.rows || []}
              meta={data?.meta}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Department;
