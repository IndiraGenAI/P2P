import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Modal, Row, Select, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import TableComponent from "src/components/DataTable";
import { IStudentRecord } from "./BatchWiseStudentDetails.model";
import {
  searchUserBatchData,
  studentDetailsCsvEmailSendData,
} from "src/state/userBatch/userBatch.action";
import { AppDispatch } from "src/state/app.model";
import { useDispatch } from "react-redux";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  EyeOutlined,
  FileTextOutlined,
  DownloadOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import UserActionWrapper from "src/components/ActionWrapper/UserActionWrapper";
import { Can } from "src/ability/can";
import {
  AdmissionSubcourseStatus,
  Admission_Recurring_type,
  Common,
  admissionViewAndUnAssignAdmissionViewRemarks,
} from "src/utils/constants/constant";
import { IBulkRemark, IStudentSigningSheet } from "./UserWiseBatch.model";
import Remarks from "src/components/AddRemarks";
import { bufferURLDecode, bufferURLEncode } from "src/utils/helperFunction";
import StudentMobileNumber from "src/components/StudentMobileNumber";
import { ability } from "src/ability";
import { useAppSelector } from "src/state/app.hooks";
import {
  admissionSelector,
  clearRemoveMessage,
} from "src/state/admission/admission.reducer";
import {
  clearRemoveMessageForUserBatch,
  userBatchSelector,
} from "src/state/userBatch/userBatch.reducer";
import { searchStudentsListData } from "src/state/studentList/studentList.action";
import DrawerComponent from "src/components/Drawer";
import FloatLabel from "src/components/Form/FloatLabel";
import TextEditor from "src/components/TextEditor";
import { createBulkRemark } from "src/state/admission/admission.action";
import RemarksLabels from "src/components/RemarksLabel";
import {
  createAdmissionRecurring,
  getAdmissionRecurringDataByAdmissionId,
} from "src/state/students/students.action";
import { IGetStudentListData } from "src/services/studentList/studentList.model";

const StudentDetailsList = (props: IStudentSigningSheet) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const admissionState = useAppSelector(admissionSelector);
  const userBatchState = useAppSelector(userBatchSelector);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentDetails, setStudentDetails] = useState<IGetStudentListData>();
  const { batch_id } = useParams();
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const currentBatchData = userBatchState.searchData.data.rows.find(
    (d) => d.id === Number(batch_id)
  );
  const [remarksModalOpen, setRemarksModalOpen] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [multiId, setMultiId] = useState<[]>([]);
  const [branchId, setBranchId] = useState(0);
  const [admissionStatus, setAdmissionStatus] = useState("");
  const [admissionId, setAdmissionId] = useState<number>();
  const [remarkDrawer, setRemarkDrawer] = useState<boolean>(false);
  const [remarkDisable, setRemarkDisable] = useState<boolean>(false);
  const [editorValue, setEditorValue] = useState("");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;

  const rules = {
    labels: [{ required: true, message: "Please Select Labels" }],
    remarks: [{ required: true, message: "Please Enter Remarks" }],
    rating: [{ required: true, message: "Please Select Rating" }],
  };

  useEffect(() => {
    const searchParamsWithBatchId = Object.assign(searchParams, {
      batch_id: Number(batch_id),
    });
    dispatch(
      searchStudentsListData(
        searchParamsWithBatchId as {
          batch_id: string | number | URLSearchParams;
        }
      )
    ).then((result: any) => {
      setStudentDetails(result.payload?.data);
      setLoading(false);
    });
    dispatch(searchUserBatchData({ batch_id, noLimit: true }));
  }, [batch_id, searchParams]);

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
  }, [studentDetails]);

  const StudentDetailsCsvMail = () => {
    if (batch_id) {
      dispatch(studentDetailsCsvEmailSendData(Number(batch_id)));
    }
  };
  useEffect(() => {
    if (userBatchState.studentDetailsCsvEmailSendData.message) {
      if (userBatchState.studentDetailsCsvEmailSendData.hasErrors) {
        message.error(userBatchState.studentDetailsCsvEmailSendData.message);
      } else {
        message.success(userBatchState.studentDetailsCsvEmailSendData.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.studentDetailsCsvEmailSendData.message]);

  useEffect(() => {
    if (admissionState.bulkRemark.message) {
      if (admissionState.bulkRemark.hasErrors) {
        message.error(admissionState.bulkRemark.message);
      } else {
        message.success(admissionState.bulkRemark.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [admissionState.bulkRemark.message]);

  useEffect(() => {
    if (userBatchState.searchData.message) {
      if (userBatchState.searchData.hasErrors) {
        message.error(userBatchState.searchData.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.searchData.message]);

  const onSelectChange = (newSelectedRowKeys: []) => {
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length > 0) {
      setActive(false);
      setMultiId(newSelectedRowKeys);
    } else {
      setActive(true);
    }
  };

  const rowSelection = {
    onChange: onSelectChange,
    selectedRowKeys,
  };

  const handleBulkRemarksFinish = (values: IBulkRemark) => {
    setRemarkDisable(true);
    let permission = true;
    const data = {
      ...values,
      remarks: values.remarks.replace(/\s+/g, " "),
      admission_ids: multiId,
    };
    const remarkTrim = data.remarks.split("<p> ");
    data.remarks =
      remarkTrim.length === 1 ? remarkTrim[0] : "<p>" + remarkTrim[1].trim();
    if (data.remarks !== "<p></p>") {
      if (multiId.length > 0 && permission) {
        permission = false;

        dispatch(createBulkRemark(data)).then((res) => {
          if (res.payload) {
            setRemarkDrawer(false);
            setSelectedRowKeys([]);
            setActive(true);
          } else {
            setRemarkDrawer(true);
          }
        });
      }
    } else {
      message.error("Remarks should not consist of only spaces");
    }
  };

  const openPRMReport = (admission_id: number) => {
    dispatch(getAdmissionRecurringDataByAdmissionId(Number(admission_id)))
      .then((res: any) => {
        if (res?.payload?.data) {
          const record = res?.payload?.data;
          const backURL = bufferURLEncode(
            `${location.pathname}${location.search}`
          );
          navigate(`/student-report-card/${record.id}`, {
            replace: true,
            state: { viewPtm: true, backURL: backURL },
          });
        } else {
          generatePTMReport(admission_id);
        }
      })
      .catch(() => {
        message.error(
          "There was some technical error processing this request. Please try again."
        );
      });
  };

  const generatePTMReport = (admission_id: number) => {
    if (currentBatchData) {
      const createAdmissionRecurringInput = {
        admission_id,
        type: Admission_Recurring_type.PTM,
        faculty_id: currentBatchData.user.id,
      };

      dispatch(createAdmissionRecurring(createAdmissionRecurringInput)).then(
        (res: any) => {
          if (res?.payload?.data) {
            openPRMReport(admission_id);
          }
        }
      );
    }
  };

  const newColumnsBatchWiseStudents: ColumnsType<IStudentRecord> = [
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
      render: (_, record) => {
        return <span className="tableEmail">{record.admission.email}</span>;
      },
    },

    {
      title: "Action",
      key: "action",
      width: "5%",
      align: "center",
      render: (record) => {
        const status = record.subcourse_status;
        return (
          <>
            <Can
              I={Common.Actions.CAN_VIEW}
              a={
                Common.Modules.ACADEMIC
                  .ACADEMIC_USER_BATCH_STUDENT_SIGNING_SHEET_VIEW
              }
            >
              <UserActionWrapper>
                <Button
                  className="btn_edit"
                  type="ghost"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    navigate(
                      `/${record.batch_id}/${record.admission_id}/StudentShiningSheet`
                    );
                  }}
                >
                  Syllabus & Progress Sheet
                </Button>
                <>
                  {ability.can(
                    Common.Actions.CAN_VIEW,
                    Common.Modules.ACADEMIC.ACADEMIC_USER_BATCH_STUDENT_VIEW
                  ) && (
                    <Button
                      className="btn_edit"
                      type="ghost"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setRemarksModalOpen(true);
                        setAdmissionId(record?.admission_id);
                        setBranchId(record?.admission?.branch_id);
                        setAdmissionStatus(record?.admission?.status);
                      }}
                    >
                      Add Remark
                    </Button>
                  )}
                </>
                {status && status !== AdmissionSubcourseStatus.COMPLETED && (
                  <Button
                    className="btn_edit"
                    type="ghost"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      Modal.confirm({
                        title: "Are you sure you want to Generate PTM Report?",
                        okText: "Yes",
                        cancelText: "No",
                        icon: <WarningOutlined />,
                        onOk() {
                          openPRMReport(record.admission_id);
                        },
                      });
                    }}
                  >
                    PTM Report
                  </Button>
                )}
              </UserActionWrapper>
            </Can>
          </>
        );
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
              Student Details
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
                return (
                  setRemarkDrawer(true),
                  form.resetFields(),
                  setRemarkDisable(false)
                );
              }}
            >
              Bulk Remarks
            </Button>
            <Can
              I={Common.Actions.CAN_VIEW}
              a={Common.Modules.ACADEMIC.ACADEMIC_STUDENT_DETAILS_CSV_FILE_VIEW}
            >
              <Button
                className="gx-mb-0"
                icon={<FileTextOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title:
                      "Are you sure want to download student details csv file?",
                    okText: "Yes",
                    cancelText: "No",
                    icon: <DownloadOutlined />,
                    onOk() {
                      StudentDetailsCsvMail();
                    },
                  });
                }}
              >
                CSV
              </Button>
            </Can>
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
            dataSource={studentDetails?.rows || []}
            loading={loading}
            meta={studentDetails?.meta}
            rowKey={(admissionRecord) => admissionRecord.admission_id}
            rowClassName={(record: IStudentRecord, index: number) => {
              const status = record.subcourse_status;
              if (status === AdmissionSubcourseStatus.COMPLETED) {
                return "completed ";
              } else {
                return "";
              }
            }}
          />
        </Card>
      </div>
      <Remarks
        branchId={branchId}
        admissionStatus={admissionStatus}
        admissionId={admissionId}
        remarksModalOpen={remarksModalOpen}
        setRemarksModalOpen={setRemarksModalOpen}
        admissionViewAndUnAssignAdmissionView={
          admissionViewAndUnAssignAdmissionViewRemarks.VIEW_STUDENT_DETAILS_REMARKS
        }
      />
      <DrawerComponent
        onClose={() => setRemarkDrawer(false)}
        visible={remarkDrawer}
        title="Bulk Remarks Add"
        className="assign-batch"
      >
        <Form
          form={form}
          className="drawer-form remark-admission bulk-remark-editer"
          onFinish={handleBulkRemarksFinish}
        >
          <FloatLabel
            label="Labels"
            placeholder="Select Labels"
            name="labels"
            required
          >
            <RemarksLabels />
          </FloatLabel>

          <FloatLabel
            label="Rating"
            placeholder="Select Rating"
            name="rating"
            required
          >
            <Form.Item name="rating" rules={rules.rating}>
              <Select getPopupContainer={(trigger) => trigger.parentNode}>
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
                <Option value="4">4</Option>
                <Option value="5">5</Option>
              </Select>
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
              disabled={remarkDisable}
            >
              Submit
            </Button>
            <Button
              className="btn-cancel"
              onClick={() => {
                setRemarkDrawer(false);
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

export default StudentDetailsList;
