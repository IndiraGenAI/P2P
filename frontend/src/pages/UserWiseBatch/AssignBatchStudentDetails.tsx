import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
  Typography,
  message,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import TableComponent from "src/components/DataTable";
import {
  bulkStudentAssign,
  getCourseWiseStudentListData,
  searchUserBatchData,
} from "src/state/userBatch/userBatch.action";
import { AppDispatch } from "src/state/app.model";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IStudentSigningSheet } from "./UserWiseBatch.model";
import {
  bufferURLDecode,
  dateFormate,
  trimObject,
} from "src/utils/helperFunction";
import StudentMobileNumber from "src/components/StudentMobileNumber";
import { useAppSelector } from "src/state/app.hooks";
import {
  clearRemoveMessageForUserBatch,
  userBatchSelector,
} from "src/state/userBatch/userBatch.reducer";
import DrawerComponent from "src/components/Drawer";
import FloatLabel from "src/components/Form/FloatLabel";
import TextEditor from "src/components/TextEditor";
import { FilterFilled } from "@ant-design/icons";
import { packageSelector } from "src/state/package/package.reducer";
import { searchPackageData } from "src/state/package/package.action";
import { IPackageRecord } from "src/services/package/package.model";
import { IBulkAssignBatch } from "./AssignBatchStudentDetails.model";
import { ICourseWiseStudents } from "src/services/userBatch/userBatch.model";
import moment, { Moment } from "moment";
const { Text } = Typography;

const AssignBatchStudentDetailsList = (props: IStudentSigningSheet) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const userBatchState = useAppSelector(userBatchSelector);
  const [searchParams, setSearchParams] = useSearchParams();
  const { batch_id } = useParams();
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  const [count, setCount] = useState<number>(0);
  const [formValues, setFormValues] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const currentBatchData = userBatchState.searchData.data.rows.find(
    (d) => d.id === Number(batch_id)
  );
  const [active, setActive] = useState<boolean>(true);
  const [assignBatchDrawer, setAssignBatchDrawer] = useState<boolean>(false);
  const [assignBatchDisable, setAssignBatchDisable] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState("");
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [dynamicPackage, setDynamicPackage] = useState<IPackageRecord[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const packageState = useAppSelector(packageSelector);
  const { Option } = Select;

  const rules = {
    labels: [{ required: true, message: "Please Select Labels" }],
    remarks: [{ required: true, message: "Please Enter Remarks" }],
    gr_id: [
      { pattern: new RegExp(/^[0-9]+$/), message: "only Number Are Allowed" },
    ],
  };

  useEffect(() => {
    const searchParamsWithBatchId = Object.assign(searchParams, {
      batch_id: Number(batch_id),
    });
    dispatch(
      getCourseWiseStudentListData(
        searchParamsWithBatchId as {
          batch_id: string | number | URLSearchParams;
        }
      )
    );
    dispatch(searchUserBatchData({ batch_id, noLimit: true }));
  }, [batch_id, searchParams]);

  const getCourseWiseStudentListDetails = useMemo(() => {
    if (userBatchState.getCourseWiseStudentList.data) {
      setLoading(false);
      return userBatchState.getCourseWiseStudentList.data;
    }
  }, [userBatchState.getCourseWiseStudentList.data]);

  useEffect(() => {
    let sum = 0;
    const data = Object.fromEntries(new URLSearchParams(searchParams));
    for (const [key, value] of Object.entries(data)) {
      if (
        key !== "orderBy" &&
        key !== "order" &&
        key !== "skip" &&
        key !== "take" &&
        key !== "r" &&
        data[key] !== ""
      ) {
        sum += 1;
      }
    }
    setCount(sum);
  }, [window.location.search]);

  useEffect(() => {
    if (searchParams.get("skip") && searchParams.get("take")) {
      setPage(
        searchParams.get("skip") && searchParams.get("take")
          ? Number(searchParams.get("skip")) /
              Number(searchParams.get("take")) +
              1
          : 1
      );
    }
  }, [userBatchState.getCourseWiseStudentList.data]);

  useEffect(() => {
    form.setFieldValue("labels", "Batch Assign");
    dispatch(
      searchPackageData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        isZoneOnly: true,
      })
    );
  }, []);

  useEffect(() => {
    if (!assignBatchDrawer) {
      form.resetFields();
    } else {
      form.setFieldValue("labels", "Batch Assign");
    }
  }, [assignBatchDrawer]);

  useEffect(() => {
    setDynamicPackage(packageState?.packageData?.data?.rows);
  }, [packageState.packageData.data]);

  const onReset = () => {
    const backURL = searchParams.get("r");
    setSearchParams(backURL ? { r: backURL } : {});
    setFormValues(" ");
    setTimeout(() => filterForm.resetFields());
  };

  const onFinish = (values: { [key: string]: string }) => {
    let queryString = Object.entries(trimObject(values))
      .filter(([key, newData]) => newData !== undefined && newData !== "")
      .map(
        ([key, newData]) => key + "=" + encodeURIComponent(newData as string)
      )
      .join("&");
    const backURL = searchParams.get("r");
    if (backURL) {
      queryString += `&r=${backURL}`;
    }
    setSearchParams(queryString.trim());
    setFilterDrawer(false);
  };

  useEffect(() => {
    const data = { ...setFormValues };
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      Object.assign(data, {
        [key]: value,
      });
    }
    setFormValues(data);
  }, [searchParams]);

  useEffect(() => {
    if (userBatchState.getCourseWiseStudentList.message) {
      if (userBatchState.getCourseWiseStudentList.hasErrors) {
        message.error(userBatchState.getCourseWiseStudentList.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.getCourseWiseStudentList.message]);

  useEffect(() => {
    if (userBatchState.bulkAssign.message) {
      if (userBatchState.bulkAssign.hasErrors) {
        message.error(userBatchState.bulkAssign.message);
      } else {
        message.success(userBatchState.bulkAssign.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.bulkAssign.message]);

  const onSelectChange = (newSelectedRowKeys: []) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const handleCancel = () => {
    setFilterDrawer(false);
  };

  const handleBulkAssignsFinish = (values: IBulkAssignBatch) => {
    setAssignBatchDisable(true);
    let permission = true;
    const currentDate: Moment = moment();
    const data = {
      batch_id: batch_id,
      remarks: `${
        "Faculty_" +
        currentBatchData?.user?.first_name +
        " " +
        currentBatchData?.user?.last_name +
        " , " +
        "Batch_" +
        currentBatchData?.name +
        " , " +
        "Date_" +
        dateFormate(currentDate.toString()) +
        (values?.remarks ? " , " + values?.remarks?.replace(/\s+/g, " ") : "")
      }`,
      label: values.labels,
      admissionSubCourseId: selectedRowKeys,
    };
    const remarkTrim = data.remarks.split("<p> ");
    data.remarks =
      remarkTrim.length === 1 ? remarkTrim[0] : "<p>" + remarkTrim[1].trim();
    if (data.remarks !== "<p></p>") {
      if (selectedRowKeys.length > 0 && permission) {
        permission = false;

        dispatch(bulkStudentAssign(data)).then((res) => {
          if (res.payload) {
            const searchParamsWithBatchId = Object.assign(searchParams, {
              batch_id: Number(batch_id),
            });
            setAssignBatchDrawer(false);
            setSelectedRowKeys([]);
            setActive(true);
            dispatch(
              getCourseWiseStudentListData(
                searchParamsWithBatchId as {
                  batch_id: string | number | URLSearchParams;
                }
              )
            );
          } else {
            setAssignBatchDrawer(true);
          }
        });
      }
    } else {
      message.error("Remarks should not consist of only spaces");
    }
  };

  const newColumnsBatchWiseStudents: ColumnsType<ICourseWiseStudents> = [
    {
      title: "No.",
      align: "center",
      width: "5%",
      render: (text, record, index) => (
        <>{(page - 1) * Number(searchParams.get("take")) + index + 1}</>
      ),
    },
    {
      title: "GR ID",
      dataIndex: "gr_id",
      key: "gr_id",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <>{record.admission.gr_id}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      width: "30%",
      render: (_, record) => {
        return (
          <>
            <span>
              {record.admission.first_name + " " + record.admission.last_name}
            </span>
            <StudentMobileNumber
              studentMobileNumber={String(record?.admission?.mobile_no)}
            />
          </>
        );
      },
    },
    {
      title: "Father Name",
      dataIndex: "father_name",
      key: "father_name",
      width: "30%",
      render: (_, record) => {
        return (
          <>
            {record.admission.father_name}

            {record?.admission?.father_mobile_no && (
              <StudentMobileNumber
                studentMobileNumber={String(
                  record?.admission?.father_mobile_no
                )}
              />
            )}
          </>
        );
      },
    },
    {
      title: "Package/Course Name",
      dataIndex: "",
      key: "course",
      render: (_, record) => {
        return (
          <>
            {record?.package?.name ? (
              <>
                <Tooltip
                  placement="topLeft"
                  title={`P :${record?.package?.name}(${record?.subcourse?.name})`}
                >
                  <Text style={{ cursor: "pointer" }} ellipsis={true}>
                    P :{record?.package?.name}
                    <br />S :{record?.subcourse?.name}
                  </Text>
                </Tooltip>
              </>
            ) : (
              <Tooltip placement="topLeft" title={record?.subcourse?.name}>
                <Text style={{ cursor: "pointer" }} ellipsis={true}>
                  S :{record?.subcourse?.name}
                </Text>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "",
      key: "status",
      render: (_, record) => {
        return <span>{record.admission.status}</span>;
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      render: (_, record) => {
        return <span className="tableEmail">{record.admission.email}</span>;
      },
    },
  ];

  return (
    <>
      <div className="rnw-main-content">
        <Row
          align="middle"
          justify="space-between"
          gutter={24}
          className="mb-20"
        >
          <Col xxl={12}>
            <h2 className="rnw-page-title">
              Bulk Batch Assign Student Details
              {currentBatchData?.subcourse.name && (
                <small className="signingSheet-gr gx-mt-2 gx-d-block">
                  ({currentBatchData?.subcourse.name})
                </small>
              )}
            </h2>
          </Col>
          <Col xxl={12} className="text-align-right gx-mt-2 gx-mt-md-0">
            <Button
              className="gx-mt-0"
              disabled={active}
              onClick={() => {
                return setAssignBatchDrawer(true), setAssignBatchDisable(false);
              }}
            >
              Bulk Batch Assign
            </Button>
            <Button
              className="gx-mb-0"
              icon={<FilterFilled />}
              onClick={() => setFilterDrawer(true)}
            >
              Filter
              <span>
                <Badge count={count}></Badge>
              </span>
            </Button>
            <Button
              className="gx-mb-0"
              type="primary"
              onClick={() => {
                const url = searchParams.get("r");
                if (url) {
                  const backURL = bufferURLDecode(url);
                  navigate(backURL);
                } else {
                  props.is_my_batch === false
                    ? navigate("/batch")
                    : navigate("/my-team-batches");
                }
              }}
            >
              <i className="fa fa-arrow-left back-icon"></i>{" "}
              <span className="gx-d-none gx-d-sm-inline-block">Back</span>
            </Button>
          </Col>
        </Row>
        <Card className="rnw-card table-card cheque-amount gx-mb-0">
          <TableComponent
            rowSelection={rowSelection}
            columns={newColumnsBatchWiseStudents}
            dataSource={getCourseWiseStudentListDetails?.rows || []}
            loading={userBatchState.getCourseWiseStudentList.loading}
            meta={getCourseWiseStudentListDetails?.meta}
            rowKey={(admissionRecord) => admissionRecord.id}
          />
          <div className="filter" style={{ height: "auto" }}>
            <Drawer
              className="filter-drawer"
              title="My Team Assign Batch Filter"
              width="1000"
              visible={filterDrawer}
              onClose={handleCancel}
              footer={[
                <div className="gx-d-flex gx-justify-content-center">
                  <Button
                    className="cancel-filter gx-mr-0"
                    key="back"
                    onClick={handleCancel}
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
              <Form
                id="myForm"
                onFinish={onFinish}
                form={filterForm}
                onReset={onReset}
                initialValues={formValues}
              >
                <Row>
                  <Col xs={24} className="gx-mb-1">
                    <FloatLabel
                      label="Gr Id"
                      placeholder="Enter Student Gr Id"
                      name="gr_id"
                    >
                      <Form.Item name="gr_id" rules={rules.gr_id}>
                        <Input maxLength={9} />
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <FloatLabel
                      label="Select Package"
                      placeholder="Select Package"
                      name="package_id"
                    >
                      <Form.Item name="package_id">
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear
                          size="large"
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children?.toString() || "")
                              .toLowerCase()
                              .includes(input.toLowerCase().trim())
                          }
                        >
                          {dynamicPackage
                            ?.filter((packages) => packages.status === true)
                            .map((packages) => {
                              return (
                                <Option value={packages.id.toString()}>
                                  {packages.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                </Row>
              </Form>
            </Drawer>
          </div>
        </Card>
      </div>
      <DrawerComponent
        onClose={() => setAssignBatchDrawer(false)}
        visible={assignBatchDrawer}
        title="Bulk Remarks Add"
        className="assign-batch"
      >
        <Form
          form={form}
          className="drawer-form remark-admission bulk-remark-editer"
          onFinish={handleBulkAssignsFinish}
        >
          <FloatLabel
            label="Labels"
            placeholder="Select Labels"
            name="labels"
            required
          >
            <Form.Item name="labels">
              <Input size="large" />
            </Form.Item>
          </FloatLabel>

          <div className="text-editor">
            <FloatLabel
              label="Remarks"
              placeholder="Enter Remarks"
              name="remarks"
              required
            >
              <Form.Item name="remarks" rules={rules.remarks}>
                <TextEditor
                  value={editorValue || " "}
                  placeholder=""
                  onChange={setEditorValue}
                />
              </Form.Item>
            </FloatLabel>
          </div>
          <Form.Item className="modal-btn-grp">
            <Button
              className="btn-submit"
              key="submit"
              type="primary"
              htmlType="submit"
              disabled={assignBatchDisable}
            >
              Submit
            </Button>
            <Button
              className="btn-cancel"
              onClick={() => {
                setAssignBatchDrawer(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
    </>
  );
};

export default AssignBatchStudentDetailsList;
