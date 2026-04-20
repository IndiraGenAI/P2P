import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row, Skeleton, Empty } from "antd";
import {
  getBatchStudentAttendance,
  getBatchWiseStudentDetails,
  getShiningSheetTopicByBatch,
} from "src/state/userBatch/userBatch.action";
import { AppDispatch } from "src/state/app.model";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  IBatchShiningSheet,
  IBatchShiningSheetDetails,
  IFeedBack,
  IStudentActualDateAndPresent,
} from "./BatchWiseStudentDetails.model";
import { ReloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAdmissionDetailsById, getStudentDetailsById } from "src/state/admission/admission.action";
import { useAppSelector } from "src/state/app.hooks";
import { admissionSelector } from "src/state/admission/admission.reducer";
import { AdmissionsData } from "src/services/admission/admission.model";
import { bufferURLDecode, convertTimeFromNumeric, dateFormate } from "src/utils/helperFunction";
import { InformationType, PresentAndAbsentType, TopicType } from "src/utils/constants/constant";
import GetTitleByTooltip from "src/components/GetTitleByTooltip";
import MoreButtonShow from "src/components/MoreButton";
import {
  IBatchStudentMarks,
  ProjectVivaExam,
} from "../StudentsMarks/studentMarks.Model";
function StudentShiningSheet() {
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [studentShiningSheetDetails, setStudentShiningSheetDetails] = useState<
    IBatchShiningSheetDetails[]
  >([]);
  const [studentAttendanceDetails, setStudentAttendanceDetails] =
    useState<IStudentActualDateAndPresent[]>();
  const admissionState = useAppSelector(admissionSelector);
  const [admissionData, setAdmissionData] = useState<AdmissionsData>();
  const { batch_id, admission_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getStudentDetailsById({
        id: Number(admission_id),
        informationType: InformationType.IS_BASIC_DETAIL,
      })
    );
  }, [admission_id]);
  useEffect(() => {
    if (admissionState.getStudentDetailId.data) {
      setAdmissionData(admissionState.getStudentDetailId.data);
    }
  }, [admissionState.getStudentDetailId.data]);
  useEffect(() => {
    Promise.all([
      dispatch(
        getShiningSheetTopicByBatch({
          batch_id: Number(batch_id),
          admission_id: Number(admission_id),
        })
      ),
      dispatch(getBatchWiseStudentDetails({ admission_id, batch_id })),
    ])?.then((res: any) => {
      const finalPayload: IBatchShiningSheetDetails[] = [];
      if (res) {
        const shiningSheetTopics = res[0]?.payload?.data?.rows || [];
        const batchWiseStudentDetails = res[1]?.payload?.data?.rows || [];
        shiningSheetTopics?.forEach((topicData: IBatchShiningSheetDetails) => {
          if (
            topicData?.type === TopicType.PROJECT ||
            topicData?.type === TopicType.EXAM_PRACTICAL
          ) {
            if (
              topicData?.batchSingingSheets?.some(
                (data: IBatchShiningSheet) =>
                  data?.batchFacultyAttendances?.length
              )
            ) {
              batchWiseStudentDetails?.forEach(
                (studentMark: ProjectVivaExam) => {
                  const student = studentMark?.pr_vi_ex?.students[0]?.student;

                  if (
                    student &&
                    topicData?.id === student?.batch_singing_sheet_id
                  ) {
                    topicData.submission_link =
                      student?.submission_link || null;
                  }
                }
              );
            }
          }
          finalPayload?.push(topicData);
        });
        setLoading(false);
        setStudentShiningSheetDetails(finalPayload);
      }
    });
  }, [batch_id]);

  useEffect(() => {
    dispatch(
      getBatchStudentAttendance({
        batch_id: Number(batch_id),
        admission_id: Number(admission_id),
      })
    ).then((result: any) => {
      setStudentAttendanceDetails(result.payload?.data);
    });
  }, [studentShiningSheetDetails]);
  return (
    <>
      <div className="rnw-main-content">
        <Skeleton active loading={loading} avatar>
          <Row
            align="middle"
            justify="space-between"
            gutter={24}
            className="mb-20"
          >
            <Col xs={18} sm={20}>
              <h2 className="rnw-page-title student-mobile-gr">
                <GetTitleByTooltip
                  title={
                    studentShiningSheetDetails[0]?.batch?.name &&
                    admissionData?.first_name
                      ? admissionData?.first_name +
                        " " +
                        admissionData?.last_name +
                        " - " +
                        studentShiningSheetDetails[0]?.batch?.name
                      : ""
                  }
                />
                {studentShiningSheetDetails.length > 0 && (
                  <small className="signingSheet-gr gx-mt-2 gx-d-block">
                    (Gr ID -
                    {studentShiningSheetDetails[0]?.batch?.name &&
                    admissionData?.gr_id
                      ? " " + String(admissionData?.gr_id)
                      : ""}
                    <span className="gx-mx-2">|</span>
                    Mobile No -
                    <a
                      target="_blank"
                      href={`tel:${admissionData?.father_mobile_no}`}
                    >
                      {studentShiningSheetDetails[0]?.batch?.name &&
                      admissionData?.mobile_no
                        ? " " + String(admissionData?.mobile_no)
                        : ""}
                    </a>
                    )
                  </small>
                )}
              </h2>
            </Col>
            <Col xs={6} sm={4} className="text-align-right gx-mt-2 gx-mt-md-0">
              <Button
                type="primary"
                onClick={() => {
                  const url = searchParams.get("r");
                  if (url) {
                    const backURL = bufferURLDecode(url);
                    navigate(backURL);
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <i className="fa fa-arrow-left back-icon"></i> Back
              </Button>
            </Col>
          </Row>
          <Card className="rnw-card table-card faculty-signing-table gx-mb-0">
            <div>
              <table className="faculty-signing" style={{ minWidth: "1572px" }}>
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>No.</th>
                    <th style={{ width: "700px", textAlign: "left" }}>Topic</th>
                    <th style={{ width: "150px" }}>Planned Date</th>
                    <th style={{ width: "150px" }}>Actual Date (Time)</th>
                    <th style={{ width: "150px" }}>Attendance</th>
                    <th style={{ width: "150px" }}>Feedback/Mark</th>
                  </tr>
                </thead>
                <tbody className="gx-text-center">
                  {studentShiningSheetDetails.length > 0 ? (
                    studentShiningSheetDetails?.map(
                      (data: IBatchShiningSheetDetails, index: number) => (
                        <>
                          <tr className="main-topic">
                            <td>
                              <span
                                style={{
                                  width: "40px",
                                  display: "inline-block",
                                  textAlign: "center",
                                }}
                              >
                                {index + 1}
                              </span>
                            </td>
                            <td colSpan={7} style={{ textAlign: "left" }}>
                              <div className="gx-d-flex gx-justify-content-between">
                                <div>
                                  {data.name}
                                  <span className="project-type">
                                    ({data.type})
                                  </span>
                                  {(data?.type === TopicType.PROJECT ||
                                    data?.type === TopicType.EXAM_PRACTICAL) &&
                                    data?.submission_link && (
                                      <a
                                        href={data?.submission_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="project-type"
                                      >
                                        {"Submitted Link"}
                                      </a>
                                    )}
                                </div>
                                <span>
                                  {[
                                    TopicType.EXAM_THEORY,
                                    TopicType.EXAM_PRACTICAL,
                                    TopicType.PROJECT,
                                    TopicType.VIVA,
                                  ].includes(data?.type as TopicType) &&
                                    data.Batch_student_marks &&
                                    data.Batch_student_marks?.length > 0 &&
                                    (() => {
                                      const marks =
                                        data?.Batch_student_marks?.find(
                                          (
                                            batchStudentMarks: IBatchStudentMarks
                                          ) =>
                                            Number(
                                              batchStudentMarks.admission_id
                                            ) === Number(admissionData?.id)
                                        )?.marks;
                                      return marks != null ? `${marks}/` : "";
                                    })()}
                                  {data.marks}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {data.batchSingingSheets.map(
                            (
                              batchShiningSheet: IBatchShiningSheet,
                              shiningSheetIndex: number
                            ) => (
                              <>
                                <tr className="sub-topic">
                                  <td style={{ width: "63.98px" }}>
                                    <span
                                      style={{
                                        width: "40px",
                                        display: "inline-block",
                                        textAlign: "center",
                                      }}
                                    >
                                      {Number(index + 1)}.
                                      {shiningSheetIndex + 1}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      textAlign: "left",
                                      width: "45%",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    <div>
                                      <div
                                        className="shining-sheet-student"
                                        dangerouslySetInnerHTML={{
                                          __html: batchShiningSheet.description,
                                        }}
                                      ></div>

                                      {batchShiningSheet?.notes && (
                                        <div>
                                          <MoreButtonShow
                                            text={batchShiningSheet?.notes}
                                            titleText="Notes"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td
                                    style={{
                                      width: "157.34px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {dateFormate(
                                      batchShiningSheet.planned_start_date
                                    )}
                                  </td>
                                  <td style={{ width: "157.34px" }}>
                                    <table className="gx-mx-auto sub-table">
                                      <tbody>
                                        <>
                                          {studentAttendanceDetails &&
                                            studentAttendanceDetails.map(
                                              (
                                                studentData: IStudentActualDateAndPresent
                                              ) => {
                                                if (
                                                  studentData.batch_singing_sheet_id ===
                                                  batchShiningSheet.id
                                                ) {
                                                  return (
                                                    <>
                                                      {studentData.actual_date_new?.map(
                                                        (
                                                          actual_date: Date,
                                                          index: number
                                                        ) => (
                                                          <tr
                                                            key={`row-${index}`}
                                                          >
                                                            <td>
                                                              {dateFormate(
                                                                moment(
                                                                  actual_date
                                                                ).format(
                                                                  "YYYY-MM-DD"
                                                                )
                                                              )}
                                                              <span className="faculty-time">
                                                                {`(${
                                                                  convertTimeFromNumeric(
                                                                    studentData?.attedance_start_time?.[
                                                                      index
                                                                    ]?.toFixed(
                                                                      2
                                                                    )
                                                                  ) ?? "-"
                                                                })`}
                                                              </span>
                                                            </td>
                                                          </tr>
                                                        )
                                                      )}
                                                    </>
                                                  );
                                                }
                                                return null;
                                              }
                                            )}
                                        </>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td
                                    align="center"
                                    style={{ width: "157.34px" }}
                                  >
                                    <table className="gx-mx-auto sub-table">
                                      <tbody>
                                        <>
                                          {studentAttendanceDetails &&
                                            studentAttendanceDetails.map(
                                              (
                                                studentData: IStudentActualDateAndPresent
                                              ) => {
                                                if (
                                                  studentData.batch_singing_sheet_id ===
                                                  batchShiningSheet.id
                                                ) {
                                                  return studentData.present_absent.map(
                                                    (
                                                      present_absent: boolean
                                                    ) => (
                                                      <tr>
                                                        <td>
                                                          {present_absent ===
                                                          true ? (
                                                            <Badge
                                                              count={
                                                                PresentAndAbsentType.Present
                                                              }
                                                              className="present-badge"
                                                            />
                                                          ) : (
                                                            <Badge
                                                              count={
                                                                PresentAndAbsentType.Absent
                                                              }
                                                            />
                                                          )}
                                                        </td>
                                                      </tr>
                                                    )
                                                  );
                                                }
                                              }
                                            )}
                                        </>
                                      </tbody>
                                    </table>
                                  </td>
                                  <td style={{ width: "157.34px" }}>
                                    <table className="gx-mx-auto sub-table">
                                      <tbody>
                                        <>
                                          {studentAttendanceDetails &&
                                            studentAttendanceDetails.map(
                                              (
                                                studentData: IStudentActualDateAndPresent
                                              ) => {
                                                if (
                                                  studentData.batch_singing_sheet_id ===
                                                  batchShiningSheet.id
                                                ) {
                                                  return studentData?.feedback?.map(
                                                    (feed_back: IFeedBack) => (
                                                      <>
                                                        <tr
                                                          className={
                                                            feed_back?.feedback ===
                                                            "A"
                                                              ? "sub-table great"
                                                              : feed_back?.feedback ===
                                                                "B"
                                                              ? "sub-table good"
                                                              : feed_back?.feedback ===
                                                                "C"
                                                              ? "sub-table average"
                                                              : feed_back?.feedback ===
                                                                "D"
                                                              ? "sub-table poor"
                                                              : ""
                                                          }
                                                        >
                                                          <td>
                                                            {feed_back?.feedback !==
                                                            "NULL"
                                                              ? feed_back?.feedback
                                                              : "-"}
                                                            {feed_back.is_auto ===
                                                            true ? (
                                                              <ReloadOutlined title="Auto Feedback" />
                                                            ) : (
                                                              ""
                                                            )}
                                                          </td>
                                                        </tr>
                                                      </>
                                                    )
                                                  );
                                                }
                                              }
                                            )}
                                        </>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        </>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ border: "none" }}>
                        <div>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Skeleton>
      </div>
    </>
  );
}

export default StudentShiningSheet;
