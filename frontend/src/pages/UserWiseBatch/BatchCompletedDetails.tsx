import { Button, Card, Col, Form, Modal, Row, Typography, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TableComponent from "src/components/DataTable";
import StudentMobileNumber from "src/components/StudentMobileNumber";
import { bufferURLDecode, showTooltip } from "src/utils/helperFunction";
import { AppDispatch } from "src/state/app.model";
import {
  batchWiseStudentCompleted,
  getBatchCompletedStudentAndNotCompletedStudentDetails,
  searchUserBatchData,
} from "src/state/userBatch/userBatch.action";
import {
  AdmissionSubcourse,
  IBatchCompletedStudentDetails,
} from "src/services/userBatch/userBatch.model";
import {
  userBatchSelector,
  clearRemoveMessageForUserBatch,
} from "src/state/userBatch/userBatch.reducer";
import { useAppSelector } from "src/state/app.hooks";
import {
  AdmissionSubcourseGrade,
  AdmissionSubcourseStatus,
  Common,
  RoleType,
  UserBatchStatusType,
} from "src/utils/constants/constant";
import { Can } from "src/ability/can";
import { CheckOutlined } from "@ant-design/icons";
import { userSelector } from "src/state/users/user.reducer";
import { loginSelector } from "src/state/Login/login.reducer";
import { IBatchCompletedDetails } from "./UserWiseBatch.model";
import { StarOutlined } from "@ant-design/icons";
import DrawerComponent from "src/components/Drawer";
import FloatLabel from "src/components/Form/FloatLabel";
import TextEditor from "src/components/TextEditor";
import { AdmissionRemarks } from "./BatchWiseStudentDetails.model";

export default function BatchCompletedDetails(props: IBatchCompletedDetails) {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useAppSelector(userSelector);
  const { userRoleId } = useSelector(loginSelector);
  const [
    batchWiseCompletedStudentDetails,
    setBatchWiseCompletedStudentDetails,
  ] = useState<IBatchCompletedStudentDetails[]>();
  const [
    batchWiseNotCompletedStudentDetails,
    setBatchWiseNotCompletedStudentDetails,
  ] = useState<IBatchCompletedStudentDetails[]>();
  const [completedBatchStudentCount, setCompletedBatchStudentCount] =
    useState<number>(0);
  const [notCompletedBatchStudentCount, setNotCompletedBatchStudentCount] =
    useState<number>(0);
  const [completeStudentAdmissionIds, setCompleteStudentAdmissionIds] =
    useState<number[] | undefined>();
  const [inCompleteStudentAdmissionIds, setInCompleteStudentAdmissionIds] =
    useState<number[] | undefined>();
  const [disable, setDisable] = useState<boolean | undefined>(false);
  const [isRoleFacultyHead, setIsRoleFacultyHead] = useState<boolean>(false);
  const [admissionId, setAdmissionId] = useState<number>();
  const [remarksModalOpen, setRemarksModalOpen] = useState<boolean>(false);
  const userBatchState = useAppSelector(userBatchSelector);
  const [editorValue, setEditorValue] = useState("");
  const [remarks, setRemarks] = useState<AdmissionRemarks[]>([]);
  const { batch_id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { Text } = Typography;

  const rules = {
    remarks: [{ required: true, message: "Please Enter Remarks" }],
  };

  const remarkField = Form.useWatch("remarks", form);
  useEffect(() => {
    if (!!remarkField && !remarkField?.replace(/<\/?[^>]+>/g, "")?.length) {
      form.setFieldValue("remarks", undefined);
    }
  }, [remarkField]);

  useEffect(() => {
    dispatch(
      getBatchCompletedStudentAndNotCompletedStudentDetails(Number(batch_id))
    ).then((res: any) => {
      setBatchWiseCompletedStudentDetails(
        res?.payload?.data?.completed_batch_student
      );
      setCompletedBatchStudentCount(
        res?.payload?.data?.completed_batch_student_count
      );
      setBatchWiseNotCompletedStudentDetails(
        res?.payload?.data?.not_completed_batch_student
      );
      setNotCompletedBatchStudentCount(
        res?.payload?.data?.not_completed_batch_student_count
      );
      setLoading(false);
    });
    dispatch(searchUserBatchData({ noLimit: true }));
  }, [batch_id]);

  const onSelectCompletedStudentsChange = (newSelectedRowKeys: number[]) => {
    setCompleteStudentAdmissionIds(newSelectedRowKeys);
    const data: AdmissionRemarks[] = [];
    batchWiseCompletedStudentDetails
      ?.filter((notCompletedStudent: IBatchCompletedStudentDetails) =>
        newSelectedRowKeys.includes(notCompletedStudent.id)
      )
      .map((notCompletedStudent) => {
        const isFindRemarks = remarks.find(
          (data: AdmissionRemarks) =>
            data.admission_id === notCompletedStudent.admission_id
        );
        if (!isFindRemarks) {
          data.push({
            admission_id: notCompletedStudent.admission_id,
            remarks: `${
              currentBatchData &&
              "Subcourse_" +
                currentBatchData?.subcourse.name +
                " , " +
                "Faculty_" +
                userState.userData.data.first_name +
                " " +
                userState.userData.data.last_name +
                " , " +
                "Batch_" +
                currentBatchData.name
            }`,
          });
        } else {
          data.push(isFindRemarks);
        }
      });
    setRemarks(data);
  };
  const rowCompletedStudentsSelection = {
    onChange: onSelectCompletedStudentsChange,
    getCheckboxProps: (record: AdmissionSubcourse) => ({
      disabled: record.subcourse_status === AdmissionSubcourseStatus.COMPLETED,
      id: record.id,
    }),
  };

  const onSelectInCompletedStudentChange = (newSelectedRowKeys: number[]) => {
    const completedStudentIds: number[] =
      batchWiseNotCompletedStudentDetails
        ?.filter(
          (data: IBatchCompletedStudentDetails) =>
            data?.subcourse_status === AdmissionSubcourseStatus.COMPLETED
        )
        ?.map((data: IBatchCompletedStudentDetails) => data.id) || [];

    const selectedUnCompletedStudentIds: number[] = newSelectedRowKeys?.filter(
      (ids: number) => !completedStudentIds?.includes(ids)
    );

    if (selectedUnCompletedStudentIds?.length > 0) {
      setDisable(false);
    } else {
      setDisable(true);
    }

    setInCompleteStudentAdmissionIds(newSelectedRowKeys);
    const data: AdmissionRemarks[] = [];
    batchWiseNotCompletedStudentDetails
      ?.filter((notCompletedStudent: IBatchCompletedStudentDetails) =>
        newSelectedRowKeys.includes(notCompletedStudent.id)
      )
      .map((notCompletedStudent) => {
        const isFindRemarks = remarks.find(
          (data: AdmissionRemarks) =>
            data.admission_id === notCompletedStudent.admission_id
        );
        if (!isFindRemarks) {
          data.push({
            admission_id: notCompletedStudent.admission_id,
            remarks: `${
              currentBatchData &&
              "Subcourse_" +
                currentBatchData?.subcourse.name +
                " , " +
                "Faculty_" +
                userState.userData.data.first_name +
                " " +
                userState.userData.data.last_name +
                " , " +
                "Batch_" +
                currentBatchData.name
            }`,
          });
        } else {
          data.push(isFindRemarks);
        }
      });
    setRemarks(data);
  };

  const rowInCompletedStudentsSelection = useMemo(() => {
    const batchData = userBatchState.searchData.data.rows.find(
      (batch) => batch.id === Number(batch_id)
    );
    return {
      onChange: onSelectInCompletedStudentChange,
      getCheckboxProps: (record: AdmissionSubcourse) => ({
        disabled:
          record.subcourse_status === AdmissionSubcourseStatus.COMPLETED || batchData?.batches_status === UserBatchStatusType.COMPLETED,
        id: record.id,
      }),
    };
  }, [userBatchState.searchData.data.rows, batch_id]);
  
  const completedStudent = () => {
    dispatch(
      batchWiseStudentCompleted({
        batch_id: Number(batch_id),
        id:
          completeStudentAdmissionIds && completeStudentAdmissionIds?.length > 0
            ? completeStudentAdmissionIds
            : inCompleteStudentAdmissionIds,
        is_forcefully:
          inCompleteStudentAdmissionIds &&
          inCompleteStudentAdmissionIds?.length > 0
            ? true
            : false,
        admission_remarks: remarks,
      })
    ).then((res) => {
      if (res.payload) {
        setDisable(true);
        setCompleteStudentAdmissionIds([]);
      }

      dispatch(
        getBatchCompletedStudentAndNotCompletedStudentDetails(Number(batch_id))
      ).then((res: any) => {
        setBatchWiseCompletedStudentDetails(
          res?.payload?.data?.completed_batch_student
        );
        setCompletedBatchStudentCount(
          res?.payload?.data?.completed_batch_student_count
        );
        setBatchWiseNotCompletedStudentDetails(
          res?.payload?.data?.not_completed_batch_student
        );
        setNotCompletedBatchStudentCount(
          res?.payload?.data?.not_completed_batch_student_count
        );
      });
    });
  };
  useEffect(() => {
    if (userBatchState.batchWiseStudentCompleted.message) {
      if (userBatchState.batchWiseStudentCompleted.hasErrors) {
        message.error(userBatchState.batchWiseStudentCompleted.message);
      } else {
        message.success(userBatchState.batchWiseStudentCompleted.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.batchWiseStudentCompleted.message]);

  useEffect(() => {
    const getUserData = userState.userData.data.user_roles.find(
      (userRole) => userRole.id === userRoleId
    );
    if (getUserData && getUserData.role.type === RoleType.FACULTY_HEAD) {
      setIsRoleFacultyHead(true);
    }
  }, [userState.userData.data.user_roles, userRoleId]);

  useEffect(() => {
    if (
      userBatchState.getBatchCompletedStudentAndNotCompletedStudentDetails
        .message
    ) {
      if (
        userBatchState.getBatchCompletedStudentAndNotCompletedStudentDetails
          .hasErrors
      ) {
        message.error(
          userBatchState.getBatchCompletedStudentAndNotCompletedStudentDetails
            .message
        );
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [
    userBatchState.getBatchCompletedStudentAndNotCompletedStudentDetails
      .message,
  ]);

  const handleAddRemarksFinish = (values: { remarks: string }) => {
    const remarkData = remarks;
    const updatedRemarkIndex = remarks.findIndex(
      (remarks: AdmissionRemarks) => admissionId === remarks.admission_id
    );

    remarkData[updatedRemarkIndex].remarks = `${
      currentBatchData &&
      "Subcourse_" +
        currentBatchData?.subcourse.name +
        " , " +
        "Faculty_" +
        userState.userData.data.first_name +
        " " +
        userState.userData.data.last_name +
        " , " +
        "Batch_" +
        currentBatchData.name
    }: ${values.remarks.replace(/\s+/g, " ")}`;
    setRemarks(remarkData);
    message.success("Remark created successfully");

    setRemarksModalOpen(false);
  };
  const currentBatchData = userBatchState.searchData.data.rows.find(
    (d) => d.id === Number(batch_id)
  );

  const newColumnsBatchWiseNotCompletedStudents: ColumnsType<IBatchCompletedStudentDetails> =
    [
      {
        title: "No.",
        align: "center",
        width: "5%",
        render: (text, record, index) => <>{index + 1}</>,
      },
      {
        title: "GR ID",
        align: "center",
        width: "5%",
        dataIndex: "gr_id",
        render: (_, record) => {
          return <span>{record?.admission?.gr_id}</span>;
        },
      },
      {
        title: "Student Name",
        dataIndex: "user",
        width: "40%",
        render: (_, record) => {
          const maxLength = 30;
          return (
            <>
              <span>
                {showTooltip(
                  record?.admission?.first_name +
                    " " +
                    record?.admission?.middle_name?.charAt(0)?.toUpperCase() +
                    " " +
                    record?.admission?.last_name,
                  maxLength
                )}
              </span>
              <StudentMobileNumber
                studentMobileNumber={String(record?.admission?.mobile_no)}
              />
            </>
          );
        },
      },
      {
        title: "Grade",
        dataIndex: "percentage",
        align: "center",
        width: "40%",
        render: (_, record) => {
          return (
            <span>
              {record.grade
                ? record.grade
                : record?.percentage >= 91
                ? AdmissionSubcourseGrade.A_PLUS
                : record?.percentage >= 81
                ? AdmissionSubcourseGrade.A
                : record?.percentage >= 71
                ? AdmissionSubcourseGrade.B_PLUS
                : record?.percentage >= 61
                ? AdmissionSubcourseGrade.B
                : record?.percentage >= 51
                ? AdmissionSubcourseGrade.C
                : AdmissionSubcourseGrade.D}
            </span>
          );
        },
      },
      {
        title: "Email",
        dataIndex: ["admission"],
        width: "40%",

        render: (_, record) => {
          const maxLength = 30;
          return (
            <span>{showTooltip(record?.admission?.email, maxLength)}</span>
          );
        },
      },
      {
        title: "Father Name",
        dataIndex: "father_name",
        width: "40%",
        render: (_, record) => {
          const maxLength = 30;
          return (
            <>
              <span>
                {showTooltip(
                  record?.admission?.father_name &&
                    record.admission.father_name,
                  maxLength
                )}
              </span>
              {record?.admission?.father_mobile_no &&
                record?.admission?.father_mobile_no && (
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
        title: "Action",
        key: "action",
        width: "5%",
        align: "center",
        render: (record) => {
          const isDisable = inCompleteStudentAdmissionIds?.includes(record.id)
            ? false
            : true;
          return (
            <>
              {
                <>
                  <div
                    className={
                      !isDisable ? "action-icon" : "action-icon-disable"
                    }
                  >
                    <div>
                      <Text
                        ellipsis={true}
                        style={{ cursor: "pointer", color: "#fff" }}
                        onClick={() => {
                          if (!isDisable) {
                            setRemarksModalOpen(true);
                            setAdmissionId(record?.admission_id);
                            form.resetFields();
                          }
                        }}
                      >
                        <StarOutlined style={{ color: "#fff" }} />
                      </Text>
                    </div>
                  </div>
                </>
              }
            </>
          );
        },
      },
    ];

  const newColumnsBatchWiseCompletedStudents: ColumnsType<AdmissionSubcourse> =
    [
      {
        title: "No.",
        align: "center",
        width: "5%",
        render: (text, record, index) => <>{index + 1}</>,
      },
      {
        title: "GR ID",
        align: "center",
        width: "5%",
        dataIndex: "gr_id",
        render: (_, record) => {
          return <span>{record?.admission?.gr_id}</span>;
        },
      },
      {
        title: "Student Name",
        dataIndex: "user",
        width: "40%",
        render: (_, record) => {
          const maxLength = 30;
          return (
            <>
              <span>
                {showTooltip(
                  record?.admission?.first_name +
                    " " +
                    record?.admission?.middle_name?.charAt(0)?.toUpperCase() +
                    " " +
                    record?.admission?.last_name,
                  maxLength
                )}
              </span>
              <StudentMobileNumber
                studentMobileNumber={String(record?.admission?.mobile_no)}
              />
            </>
          );
        },
      },
      {
        title: "Grade",
        dataIndex: "percentage",
        align: "center",
        width: "40%",
        render: (_, record) => {
          return (
            <span>
              {record.grade
                ? record.grade
                : record?.percentage >= 91
                ? AdmissionSubcourseGrade.A_PLUS
                : record?.percentage >= 81
                ? AdmissionSubcourseGrade.A
                : record?.percentage >= 71
                ? AdmissionSubcourseGrade.B_PLUS
                : record?.percentage >= 61
                ? AdmissionSubcourseGrade.B
                : record?.percentage >= 51
                ? AdmissionSubcourseGrade.C
                : AdmissionSubcourseGrade.D}
            </span>
          );
        },
      },
      {
        title: "Email",
        dataIndex: ["admission"],
        width: "40%",

        render: (_, record) => {
          const maxLength = 30;
          return (
            <span>{showTooltip(record?.admission?.email, maxLength)}</span>
          );
        },
      },
      {
        title: "Father Name",
        dataIndex: "father_name",
        width: "40%",
        render: (_, record) => {
          const maxLength = 30;
          return (
            <>
              <span>
                {showTooltip(record?.admission?.father_name, maxLength)}
              </span>
              {record?.admission?.father_name &&
                record?.admission?.father_mobile_no && (
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
          <Col xs={20} xxl={12}>
            <h2 className="rnw-page-title">
              Batch Completed Student Details
              {currentBatchData?.name && (
                <span className="gx-ml-2">- ({currentBatchData?.name})</span>
              )}
              {currentBatchData?.subcourse.name && (
                <small className="signingSheet-gr gx-ml-2 gx-ml-sm-0 gx-mt-2 gx-d-sm-block">
                  ({currentBatchData?.subcourse.name})
                </small>
              )}
            </h2>
          </Col>
          <Col xs={4} xxl={12} className="text-align-right gx-mt-2 gx-md-mt-0">
            <Button
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
        <Row>
          <Col xs={24} xl={12}>
            <Card className="rnw-card table-card absent-present student-completed">
              <div className="card-header-main gx-d-flex gx-align-items-center gx-justify-content-between gx-mb-2 gx-p-2">
                <div className="card-header">
                  <h5>
                    Completed Students (
                    {completedBatchStudentCount
                      ? completedBatchStudentCount
                      : "0"}
                    )
                  </h5>
                </div>
                <div className="card-header text-align-right">
                  <Can
                    I={Common.Actions.CAN_UPDATE}
                    a={Common.Modules.ACADEMIC.ACADEMIC_BATCH_COMPLETED_VIEW}
                  >
                    {completeStudentAdmissionIds &&
                      completeStudentAdmissionIds.length > 0 && (
                        <Button
                          className="completeStudentUpdateBtn"
                          onClick={completedStudent}
                          disabled={
                            completeStudentAdmissionIds &&
                            completeStudentAdmissionIds.length > 0 &&
                            !disable
                              ? false
                              : true
                          }
                        >
                          Update
                        </Button>
                      )}
                  </Can>
                </div>
              </div>
              <TableComponent
                rowKey={(record: { id: number }) => record.id}
                rowSelection={rowCompletedStudentsSelection}
                columns={newColumnsBatchWiseCompletedStudents}
                dataSource={batchWiseCompletedStudentDetails || []}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} xl={12}>
            {" "}
            <Card className="rnw-card table-card absent-present student-completed">
              <div className="card-header-main gx-d-flex gx-align-items-center gx-justify-content-between gx-mb-2 gx-p-2">
                <div className="card-header">
                  <h5>
                    In-completed Students ({notCompletedBatchStudentCount || 0})
                  </h5>
                </div>
                <div className="card-header text-align-right">
                  <Can
                    I={Common.Actions.CAN_UPDATE}
                    a={Common.Modules.ACADEMIC.ACADEMIC_BATCH_COMPLETED_VIEW}
                  >
                    {isRoleFacultyHead === true &&
                      inCompleteStudentAdmissionIds &&
                      inCompleteStudentAdmissionIds.length > 0 && (
                        <Button
                          className="completeStudentUpdateBtn"
                          onClick={() => {
                            Modal.confirm({
                              title:
                                "Are you sure you want to complete this student's forceFully?",
                              okText: "Yes",
                              cancelText: "No",
                              icon: <CheckOutlined />,
                              onOk: () => {
                                completedStudent();
                              },
                            });
                          }}
                          disabled={
                            inCompleteStudentAdmissionIds &&
                            inCompleteStudentAdmissionIds.length > 0 &&
                            !disable
                              ? false
                              : true
                          }
                        >
                          Update
                        </Button>
                      )}
                  </Can>
                </div>
              </div>
              <TableComponent
                rowKey={(record: { id: number }) => record.id}
                rowSelection={
                  isRoleFacultyHead === true && rowInCompletedStudentsSelection
                }
                columns={newColumnsBatchWiseNotCompletedStudents}
                dataSource={batchWiseNotCompletedStudentDetails || []}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <DrawerComponent
        onClose={() => setRemarksModalOpen(false)}
        visible={remarksModalOpen}
        title="Add Remark"
      >
        <Form
          form={form}
          className="drawer-form remark-admission bulk-remark-editer"
          onFinish={handleAddRemarksFinish}
        >
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
            >
              Submit
            </Button>
            <Button
              className="btn-cancel"
              onClick={() => {
                setRemarksModalOpen(false);
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
}
