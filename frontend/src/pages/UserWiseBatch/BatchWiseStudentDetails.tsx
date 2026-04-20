import { useState, useEffect } from "react";
import {
  Form,
  Switch,
  message,
  Input,
  Button,
  Row,
  Col,
  Tooltip,
  Card,
  Select,
} from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { AppDispatch } from "src/state/app.model";
import FloatLabel from "src/components/Form/FloatLabel";
import { useDispatch } from "react-redux";
import {
  ILocationData,
  IStudentAttendance,
  IStudentAttendancePayload,
  IStudentAttendenceTimeAdd,
  IStudentAttendenceValue,
  IStudentRecord,
} from "./BatchWiseStudentDetails.model";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  addNewTopicInSigningSheet,
  batchSessionAttendence,
  facultyStudentAttendence,
  searchUserBatchData,
} from "src/state/userBatch/userBatch.action";
import { useAppSelector } from "src/state/app.hooks";
import { userSelector } from "src/state/users/user.reducer";
import {
  ISessionAttendenceData,
  IUserBatchRecord,
} from "src/services/userBatch/userBatch.model";
import {
  clearRemoveMessageForUserBatch,
  userBatchSelector,
} from "src/state/userBatch/userBatch.reducer";
import {
  CreateBatchSigningSheetTopic,
  TemplateShiningSheetTopic,
  batch_faculty_student_attendances,
} from "./UserWiseBatch.model";
import {
  AdmissionSubcourseStatus,
  FeedBackType,
  SessionType,
  TopicType,
} from "src/utils/constants/constant";
import {
  GetSortOrderWithoutLowercase,
  bufferURLDecode,
  bufferURLEncode,
  generateTimeForTenMinGapArray,
  showTooltip,
  trimObject,
} from "src/utils/helperFunction";
import moment from "moment";
import { searchStudentsListData } from "src/state/studentList/studentList.action";
import TextEditor from "src/components/TextEditor";
import ModalComponent from "src/components/Modal";
import { Option } from "antd/lib/mentions";
import {
  BatchStudentAttendance,
  IStudentDetails,
} from "src/services/studentList/studentList.model";

const BatchWiseStudentDetailsComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useAppSelector(userSelector);
  const userBatchState = useAppSelector(userBatchSelector);
  const { batch_id } = useParams();
  const location = useLocation();
  const stateType = location.state as ILocationData;
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [isTopicCompleteStudent, setIsTopicCompleteStudent] = useState<
    number[]
  >([]);
  const [hourModalOpen, sethourModalOpen] = useState(false);
  const [
    isTopicCompleteStudentPresentAbsent,
    setIsTopicCompleteStudentPresentAbsent,
  ] = useState<IStudentAttendancePayload[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [attendenceSlot, setAttendenceSlot] =
    useState<ISessionAttendenceData>();
  const [studentDetails, setStudentDetails] = useState<IStudentDetails[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [presentStudentData, setPresentStudentData] = useState<
    IStudentDetails[]
  >([]);
  const [absentStudentData, setAbsentStudentData] = useState<IStudentDetails[]>(
    []
  );
  const [editorValue, setEditorValue] = useState("");
  const [startTimeData, setstartTimeData] =
    useState<batch_faculty_student_attendances>();
  const [studentBasicAttData, setStudentBasicAttData] =
    useState<IStudentAttendance>();
  let absentStudentRecord: IStudentDetails[] = [];
  let presentStudentRecord: IStudentDetails[] = [];
  const [form] = Form.useForm();
  const [btn, setBtn] = useState(false);

  const rules = {
    start_time: [
      { required: true, message: "Please Enter Name" },
      { min: 3 },
      {
        pattern: new RegExp(/^\s*.{1,255}\s*$/),
        message: "Name must be less than or equal to 255 characters",
      },
    ],
  };

  const getUpdatedBatchStudentAttendances = (
    batchStudentAttendances: BatchStudentAttendance[]
  ): BatchStudentAttendance[] => {
    const selectedTopics = getSelectedTopics();

    const updatedBatchStudentAttendances = batchStudentAttendances.filter(
      (x: BatchStudentAttendance) => {
        for (const selectedTopic of selectedTopics) {
          if (x.batch_singing_sheet_id === selectedTopic.id) {
            return true;
          }
        }
        return false;
      }
    );
    return updatedBatchStudentAttendances;
  };

  const getLatestCommonTopicWiseStudentList = (
    studentData: BatchStudentAttendance[]
  ) => {
    const latestTopicAttendanceData: {
      [key: string]: BatchStudentAttendance;
    } = {};
    studentData.forEach((item) => {
      const key = `${item.admission_id}-${item.batch_singing_sheet_id}`;
      if (
        !latestTopicAttendanceData[key] ||
        item.batch_faculty_attendance_id >
          latestTopicAttendanceData[key].batch_faculty_attendance_id
      ) {
        latestTopicAttendanceData[key] = item;
      }
    });
    return Object.values(latestTopicAttendanceData).sort(
      (a, b) => b.batch_faculty_attendance_id - a.batch_faculty_attendance_id
    );
  };

  useEffect(() => {
    if (batch_id) {
      const payload = {
        batch_id: Number(batch_id),
        noLimit: true,
      };
      dispatch(
        searchStudentsListData(
          payload as { batch_id: string | number | URLSearchParams }
        )
      ).then((res: any) => {
        const totalStudentsData = res.payload?.data?.rows?.filter(
          (x: IStudentDetails) =>
            x.subcourse_status !== AdmissionSubcourseStatus.COMPLETED &&
            x.subcourse_status !== AdmissionSubcourseStatus.CANCELLED
        );
        if (totalStudentsData.length > 0) {
          let admissionIds: number[] = [];
          totalStudentsData.map((studentDetails: IStudentDetails) => {
            if (
              stateType?.type === SessionType.REGULAR ||
              stateType?.type === SessionType.REVISION ||
              stateType?.type === SessionType.ADD_NEW_TOPIC
            ) {
              setTotalCount(totalStudentsData.length);
              setPresentCount(totalStudentsData.length);
              setStudentDetails(totalStudentsData);
            } else {
              setStudentDetails(res.payload?.data?.rows);
              if (studentDetails?.admission?.batchStudentAttendances) {
                const studentAttendanceDetails = [
                  ...getUpdatedBatchStudentAttendances(
                    studentDetails.admission?.batchStudentAttendances
                  ),
                ]?.sort(GetSortOrderWithoutLowercase("id", "DESC"));

                const getStudentAttendanceDetails =
                  getLatestCommonTopicWiseStudentList(studentAttendanceDetails);

                if (getStudentAttendanceDetails.length > 0) {
                  if (
                    getStudentAttendanceDetails[0]?.is_present === false ||
                    getStudentAttendanceDetails[0]?.feedback ===
                      FeedBackType.C ||
                    getStudentAttendanceDetails[0]?.feedback === FeedBackType.D
                  ) {
                    absentStudentRecord.push(studentDetails);
                  } else {
                    presentStudentRecord.push(studentDetails);
                  }
                } else {
                  absentStudentRecord.push(studentDetails);
                }
                // else {
                //   const getStudentAttendanceDetails =
                //     getLatestCommonTopicWiseStudentList(
                //       studentAttendanceDetails
                //     );
                //   for (let i = 0; i < getStudentAttendanceDetails.length; i++) {
                //     if (
                //       getStudentAttendanceDetails[i]?.feedback ===
                //         FeedBackType.A ||
                //       getStudentAttendanceDetails[i]?.feedback ===
                //         FeedBackType.B
                //     ) {
                //       if (
                //         !admissionIds.includes(
                //           getStudentAttendanceDetails[i].admission_id
                //         )
                //       ) {
                //         presentStudentRecord.push(studentDetails);
                //         admissionIds.push(
                //           getStudentAttendanceDetails[i].admission_id
                //         );
                //       }
                //     } else {
                //       absentStudentRecord.push(studentDetails);
                //       if (
                //         admissionIds.includes(
                //           getStudentAttendanceDetails[i].admission_id
                //         )
                //       ) {
                //         presentStudentRecord = [];
                //       }
                //       break;
                //     }
                //   }
                // }
              }
            }
          });
          if (absentStudentRecord.length > 0) {
            setTotalCount(absentStudentRecord.length);
            setPresentCount(absentStudentRecord.length);
            setAbsentStudentData(absentStudentRecord);
          }
          if (presentStudentRecord.length > 0) {
            setTotalCount(absentStudentRecord.length);
            setPresentCount(absentStudentRecord.length);
            setPresentStudentData(presentStudentRecord);
          }
          if (
            stateType?.type === SessionType.REGULAR ||
            stateType?.type === SessionType.ADD_NEW_TOPIC
          ) {
            if (absentStudentRecord.length > 0) {
              setTotalCount(absentStudentRecord.length);
              setAbsentCount(absentStudentRecord.length);
              setAbsentStudentData(absentStudentRecord);
            }
          }
        } else {
          setDisable(true);
        }
      });

      dispatch(searchUserBatchData(searchParams)).then((res: any) => {
        if (res.payload) {
          const data = res.payload.data.rows.filter(
            (x: IUserBatchRecord) => x.id === Number(batch_id)
          );
          let userBatchOldTime = JSON.parse(
            localStorage.getItem("userBatchTime") as string
          );

          const allValue = {
            start_time: Number(
              parseFloat(userBatchOldTime?.start_time)?.toFixed(2)
            )
              ? Number(parseFloat(userBatchOldTime?.start_time).toFixed(2))
              : parseFloat(data[0]?.batch_time),
            batch_end_time: parseFloat(data[0]?.batch_time) + 1.0,
            actual_date: userBatchOldTime?.actual_date || data[0]?.start_date,
            end_time: Number(parseFloat(userBatchOldTime?.end_time).toFixed(2))
              ? Number(parseFloat(userBatchOldTime?.end_time).toFixed(2))
              : Number((parseFloat(data[0]?.batch_time) + 1.0).toFixed(2)),
          };
          setAttendenceSlot(allValue);
        }
      });
    }
  }, [batch_id]);

  const getSelectedTopics = (): TemplateShiningSheetTopic[] => {
    const selectedTopics = stateType?.data.filter(
      (value: TemplateShiningSheetTopic) => value.status === true
    );
    const shinning_sheetFilter = selectedTopics.map(
      (x: TemplateShiningSheetTopic) => {
        return {
          ...x,
          sub_topics: x.sub_topics?.filter((y) => y.status !== false),
        };
      }
    );
    const topicsArray: TemplateShiningSheetTopic[] = [];
    shinning_sheetFilter?.map((item: TemplateShiningSheetTopic) => {
      item.sub_topics?.map((x: TemplateShiningSheetTopic) => {
        topicsArray.push(x);
      });
    });
    return topicsArray;
  };

  const onNextStudentAttendence = (values: IStudentAttendenceValue) => {
    let data: ISessionAttendenceData;
    const currentTimestamp = Date.now();
    const todayDate = moment(currentTimestamp).format("YYYY-MM-DD");
    if (stateType.isCAndDLecture === true) {
      data = {
        batch_id: Number(batch_id),
        actual_date: todayDate,
        start_time: 7,
        end_time: 8,
      };
    } else {
      data = {
        batch_id: Number(batch_id),
        actual_date: attendenceSlot?.actual_date || todayDate,
        start_time: Number(attendenceSlot && attendenceSlot.start_time),
        end_time: Number(attendenceSlot && attendenceSlot.end_time),
      };
    }

    const isremarkBlank: boolean[] = [];
    Object.values(values).filter((data) => {
      if (data.hasOwnProperty("remarks")) {
        const remarkTrim = data.remarks?.replace(/\s+/g, " ")?.split("<p> ");
        data.remarks =
          remarkTrim?.length === 1
            ? remarkTrim[0]
            : remarkTrim
            ? "<p>" + remarkTrim[1].trim()
            : "";
        if (data?.remarks === "<p></p>") {
          isremarkBlank.push(false);
        }
      }
    });

    if (isremarkBlank.length > 0) {
      message.error("Remarks should not consist of only spaces");
      setDisable(false);
    } else {
      if (data.start_time && data.end_time) {
        setDisable(true);
        dispatch(batchSessionAttendence(trimObject(data))).then((res: any) => {
          if (res.payload?.data?.count === 0) {
            const { admissionId, ...rest } = values;
            const newValue = Object.entries(rest);

            const filteredData = Object.entries(values?.admissionId).filter(
              ([key, value]) => typeof value !== "undefined"
            );
            const admissionIds = Object.fromEntries(filteredData);
            const allData = Object.fromEntries(newValue);

            let finalStudentAttendenceData: IStudentAttendancePayload[] = [];
            const studentAttendenceData: IStudentAttendancePayload[] = [];

            Object.keys(allData).map((shiningSheetId) => {
              const isFindSheetID = Object.keys(admissionIds).find(
                (id) => id === shiningSheetId
              );
              if (isFindSheetID) {
                studentAttendenceData.push({
                  ...allData[shiningSheetId],
                  admission_id: Number(
                    admissionIds[isFindSheetID].admission_id
                  ),
                });
              }
            });

            if (stateType.type === SessionType.REPEAT) {
              const finalStudentData = studentAttendenceData?.filter(
                (student) =>
                  !presentStudentData.some(
                    (presentStudent) =>
                      student?.admission_id &&
                      presentStudent.admission_id === student?.admission_id
                  )
              );

              const presentStudents =
                isTopicCompleteStudentPresentAbsent.filter(
                  (presentStudent) =>
                    !isTopicCompleteStudent.includes(
                      presentStudent.admission_id
                    )
                );
              const finalStd = studentAttendenceData.filter((std) =>
                isTopicCompleteStudent.includes(std.admission_id)
              );

              finalStudentAttendenceData = [
                ...presentStudents,
                ...finalStudentData,
                ...finalStd,
              ];
            }

            if (
              stateType.topicData.name &&
              stateType.topicData.subTopics.length > 0
            ) {
              if (batch_id) {
                const matchType =
                  stateType.topicData.type === TopicType.EXAM_PRACTICAL ||
                  stateType.topicData.type === TopicType.EXAM_THEORY;

                if (matchType) {
                  sethourModalOpen(true);
                  setStudentBasicAttData({
                    user_id: userState && userState?.userData?.data?.id,
                    actual_date: (data && data?.actual_date) || new Date(),
                    start_time:
                      (data && data.start_time && data.start_time) ||
                      (attendenceSlot && attendenceSlot.start_time) ||
                      new Date().getHours(),
                    end_time:
                      (data && data.end_time && data.end_time) ||
                      (attendenceSlot && attendenceSlot.end_time) ||
                      new Date().getHours() + 1,
                    type: "REGULAR",
                    batch_student_attendances:
                      stateType.type === SessionType.REPEAT
                        ? finalStudentAttendenceData
                        : studentAttendenceData,
                  });
                } else {
                  sethourModalOpen(false);
                  const addTopicPayLoad: CreateBatchSigningSheetTopic = {
                    batch_id: Number(batch_id),
                    name: `Updated Topic: ${stateType.topicData.name}`,
                    type: stateType.topicData.type,
                    subTopics: stateType.topicData.subTopics,
                    duration: stateType.topicData.duration,
                    marks: stateType.topicData.marks,
                    questionBank: stateType.topicData.questionBank,
                    planned_start_date: moment(
                      data && data.actual_date
                        ? data.actual_date
                        : attendenceSlot?.actual_date
                    ).format("YYYY-MM-DD"),
                  };
                  dispatch(addNewTopicInSigningSheet(addTopicPayLoad)).then(
                    (res: any) => {
                      const newAddTopicValue: TemplateShiningSheetTopic[] = [];
                      res.payload.data.forEach(
                        (resItem: { id: number; parent_id: number }) => {
                          if (resItem.parent_id) {
                            const newArray = {
                              batch_singing_sheet_id: Number(resItem?.id),
                              user_id:
                                userState && userState?.userData?.data?.id,
                              actual_date:
                                data && data.actual_date
                                  ? data.actual_date
                                  : attendenceSlot &&
                                    attendenceSlot.actual_date,
                              start_time:
                                data && data.start_time
                                  ? data.start_time
                                  : attendenceSlot && attendenceSlot.start_time,
                              end_time:
                                data && data.end_time
                                  ? data.end_time
                                  : attendenceSlot && attendenceSlot.end_time,
                              type: "REGULAR",
                              batch_student_attendances:
                                stateType.type === SessionType.REPEAT
                                  ? finalStudentAttendenceData?.map(
                                      (values) => ({
                                        ...values,
                                        remarks: values.remarks
                                          ? values.remarks.replace(/\s+/g, " ")
                                          : values.remarks,
                                        batch_singing_sheet_id: Number(
                                          resItem?.id
                                        ),
                                      })
                                    )
                                  : studentAttendenceData?.map((values) => ({
                                      ...values,
                                      remarks: values.remarks
                                        ? values.remarks.replace(/\s+/g, " ")
                                        : values.remarks,
                                      batch_singing_sheet_id: Number(
                                        resItem?.id
                                      ),
                                    })),
                            };
                            if (newArray.batch_student_attendances.length > 0) {
                              newAddTopicValue.push(newArray);
                            }
                          }
                        }
                      );

                      if (newAddTopicValue.length > 0) {
                        const newAddTopicFinalData: batch_faculty_student_attendances =
                          {
                            batch_faculty_student_attendances: newAddTopicValue,
                          };

                        dispatch(
                          facultyStudentAttendence(newAddTopicFinalData)
                        ).then((res: any) => {
                          if (res?.payload?.data) {
                            navigate(`${stateType?.batch_page_url}`, {
                              replace: true,
                            });
                          }
                        });
                      }
                    }
                  );
                }
              }
            } else {
              const topicValue: IStudentAttendance[] = [];
              const topicsArray: TemplateShiningSheetTopic[] =
                getSelectedTopics();

              topicsArray.map(
                (templateSingingSheetTopic: TemplateShiningSheetTopic) => {
                  const newArray: IStudentAttendance = {
                    batch_singing_sheet_id: Number(
                      templateSingingSheetTopic.id
                    ),
                    user_id: userState && userState?.userData?.data?.id,
                    actual_date: (data && data?.actual_date) || new Date(),
                    start_time:
                      (data && data.start_time && data.start_time) ||
                      (attendenceSlot && attendenceSlot.start_time) ||
                      new Date().getHours(),
                    end_time:
                      (data && data.end_time && data.end_time) ||
                      (attendenceSlot && attendenceSlot.end_time) ||
                      new Date().getHours() + 1,
                    type: stateType["type"],
                    batch_student_attendances:
                      stateType.type === SessionType.REPEAT
                        ? finalStudentAttendenceData?.map((values) => ({
                            ...values,
                            remarks: values.remarks
                              ? values.remarks.replace(/\s+/g, " ")
                              : values.remarks,
                            batch_singing_sheet_id: Number(
                              templateSingingSheetTopic.id
                            ),
                            is_remark_added : values.remarks !== "" ? true : false
                          }))
                        : studentAttendenceData?.map((values) => ({
                            ...values,
                            remarks: values.remarks
                              ? values.remarks.replace(/\s+/g, " ")
                              : values.remarks,
                            batch_singing_sheet_id: Number(
                              templateSingingSheetTopic.id
                            ),
                            is_remark_added : values.remarks !== "" ? true : false
                          })),
                  };
                  topicValue.push(newArray);
                }
              );
              const finalData: batch_faculty_student_attendances = {
                batch_faculty_student_attendances: topicValue,
              };
              if (
                topicValue &&
                topicValue[0].batch_student_attendances.length > 0
              ) {
                const batchSingingSheetIds =
                  finalData.batch_faculty_student_attendances
                    .map(
                      (attendance: TemplateShiningSheetTopic) =>
                        attendance?.batch_singing_sheet_id
                    )
                    .filter((id) => id !== undefined);

                const matchedEntries = batchSingingSheetIds.flatMap((id) => {
                  const matchedEntry = stateType.data.find((entry) =>
                    entry.sub_topics?.some((subTopic) => subTopic.id === id)
                  );
                  return matchedEntry ? [matchedEntry] : [];
                });

                const matchType = matchedEntries.some(
                  (data) =>
                    data.type === TopicType.EXAM_PRACTICAL ||
                    data.type === TopicType.EXAM_THEORY
                );

                if (matchType) {
                  sethourModalOpen(true);
                  setstartTimeData(finalData);
                } else {
                  sethourModalOpen(false);
                  dispatch(facultyStudentAttendence(finalData)).then(
                    (res: any) => {
                      if (res?.payload?.data) {
                        if (stateType?.batch_page_url) {
                          navigate(`${stateType?.batch_page_url}`, {
                            replace: true,
                          });
                        } else {
                          navigate(`/batch`, { replace: true });
                        }
                      }
                    }
                  );
                }
              } else {
                setDisable(false);
                message.error(
                  "Please select at least one student as absent or present!"
                );
              }
            }
          }
        });
      }
    }
  };

  const timeOnSubmit = (value: IStudentAttendenceTimeAdd) => {
    setBtn(true);
    const updatedstartTimeData = {
      ...startTimeData,
      start_time: value?.start_time,
    } as batch_faculty_student_attendances;

    if (stateType.topicData.name && stateType.topicData.subTopics.length > 0) {
      const addTopicPayLoad: CreateBatchSigningSheetTopic = {
        batch_id: Number(batch_id),
        name: `Updated Topic: ${stateType.topicData.name}`,
        type: stateType.topicData.type,
        subTopics: stateType.topicData.subTopics,
        duration: stateType.topicData.duration,
        marks: stateType.topicData.marks,
        questionBank: stateType.topicData.questionBank,
        planned_start_date: moment(
          studentBasicAttData?.actual_date
            ? studentBasicAttData.actual_date
            : attendenceSlot?.actual_date
        ).format("YYYY-MM-DD"),
      };
      dispatch(addNewTopicInSigningSheet(addTopicPayLoad)).then((res: any) => {
        const newAddTopicValue: TemplateShiningSheetTopic[] = [];
        res.payload.data.forEach(
          (resItem: { id: number; parent_id: number }) => {
            if (resItem.parent_id) {
              const newArray = {
                batch_singing_sheet_id: Number(resItem?.id),
                ...studentBasicAttData,
                batch_student_attendances:
                  studentBasicAttData?.batch_student_attendances?.map(
                    (values) => ({
                      ...values,
                      remarks: values.remarks
                        ? values.remarks.replace(/\s+/g, " ")
                        : values.remarks,
                      batch_singing_sheet_id: Number(resItem?.id),
                    })
                  ),
              };
              if (
                newArray?.batch_student_attendances &&
                newArray?.batch_student_attendances?.length > 0
              ) {
                newAddTopicValue.push(newArray);
              }
            }
          }
        );

        if (newAddTopicValue.length > 0) {
          const newAddTopicFinalData: batch_faculty_student_attendances = {
            batch_faculty_student_attendances: newAddTopicValue,
            start_time: value?.start_time,
          };

          dispatch(facultyStudentAttendence(newAddTopicFinalData)).then(
            (res: any) => {
              if (res?.payload?.data) {
                navigate(`${stateType?.batch_page_url}`, {
                  replace: true,
                });
              }
            }
          );
        }
      });
    } else {
      dispatch(facultyStudentAttendence(updatedstartTimeData)).then(
        (res: any) => {
          if (res?.payload?.data) {
            setBtn(false);
            if (stateType?.batch_page_url) {
              navigate(`${stateType?.batch_page_url}`, { replace: true });
            } else {
              navigate(`/batch`, { replace: true });
            }
          }
        }
      );
    }
  };

  useEffect(() => {
    if (userBatchState.facultyStudentAttendence.message) {
      if (userBatchState.facultyStudentAttendence.hasErrors) {
        message.error(userBatchState.facultyStudentAttendence.message);
      } else {
        message.success(userBatchState.facultyStudentAttendence.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.facultyStudentAttendence.message]);

  useEffect(() => {
    if (userBatchState.batchSessionAttendence.message) {
      if (userBatchState.batchSessionAttendence.hasErrors) {
        message.error(userBatchState.batchSessionAttendence.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.batchSessionAttendence.message]);

  const handleStatus = (
    record: any,
    fieldName: "is_present" | "is_leave",
    checked: boolean
  ) => {
    const recordId = record.id !== undefined ? record.id : "";
    const isPresentValue = form.getFieldValue([recordId, "is_present"]);
    const isLeaveValue = form.getFieldValue([recordId, "is_leave"]);

    const updateCounts = (isIncreaseAbsent: boolean) => {
      setAbsentCount((aCount) => aCount + (isIncreaseAbsent ? 1 : -1));
      setPresentCount((pCount) => pCount + (isIncreaseAbsent ? -1 : 1));
    };

    if (fieldName === "is_present") {
      if (isLeaveValue) {
        form.setFieldValue([recordId, "is_leave"], !isLeaveValue);
        updateCounts(false);
      } else {
        updateCounts(!checked);
      }
    } else if (fieldName === "is_leave" && isPresentValue) {
      form.setFieldValue([recordId, "is_present"], !isPresentValue);
      updateCounts(true);
    }
  };
  const valueChange = () => {};

  const admissionIds: number[] = [];
  const handleStatusNew = (
    data: IStudentRecord,
    fieldName: "is_present" | "is_leave",
    checked: boolean
  ) => {
    if (!isTopicCompleteStudent.includes(data.admission_id)) {
      setIsTopicCompleteStudent((prevAdmissionIds) => [
        ...prevAdmissionIds,
        data.admission_id,
      ]);
    }
    const existingIndex = isTopicCompleteStudentPresentAbsent.findIndex(
      (item) => item.admission_id === data.admission_id
    );
    if (existingIndex !== -1) {
      const updatedArray = [...isTopicCompleteStudentPresentAbsent];
      updatedArray[existingIndex].is_present = checked;
      setIsTopicCompleteStudentPresentAbsent(updatedArray);
    } else {
      setIsTopicCompleteStudentPresentAbsent((prevAdmission) => [
        ...prevAdmission,
        {
          is_present: checked,
          remarks: undefined,
          admission_id: data.admission_id,
        },
      ]);
    }
    const recordId = data.id !== undefined ? data.id : "";
    const isPresentValue = form.getFieldValue([recordId, "is_present"]);
    const isLeaveValue = form.getFieldValue([recordId, "is_leave"]);

    if (
      stateType?.type === SessionType.REGULAR ||
      stateType?.type === SessionType.ADD_NEW_TOPIC ||
      stateType?.type === SessionType.REVISION
    ) {
      const updateCounts = (isIncreaseAbsent: boolean) => {
        setAbsentCount((aCount) => aCount + (isIncreaseAbsent ? 1 : -1));
        setPresentCount((pCount) => pCount + (isIncreaseAbsent ? -1 : 1));
      };

      if (fieldName === "is_present") {
        if (isLeaveValue) {
          form.setFieldValue([recordId, "is_leave"], !isLeaveValue);
          updateCounts(false);
        } else {
          updateCounts(!checked);
        }
      } else if (fieldName === "is_leave" && isPresentValue) {
        form.setFieldValue([recordId, "is_present"], !isPresentValue);
        updateCounts(true);
      }
    }

    if (stateType?.type === SessionType.REPEAT) {
      if (fieldName === "is_present") {
        if (isLeaveValue) {
          form.setFieldValue([recordId, "is_leave"], !isLeaveValue);
        }
        if (checked) {
          setTotalCount(totalCount + 1);
          setPresentCount(presentCount + 1);
        } else {
          setTotalCount(totalCount - 1);
          setPresentCount(presentCount - 1);
        }
      } else if (fieldName === "is_leave" && isPresentValue) {
        form.setFieldValue([recordId, "is_present"], !isPresentValue);
        if (checked === true) {
          setTotalCount(totalCount - 1);
          setPresentCount(presentCount - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (admissionIds.length > 0) {
      setIsTopicCompleteStudent(admissionIds);
    }
  }, [admissionIds]);

  const handleCancle = () => {
    sethourModalOpen(false);
    setDisable(false);
  };

  const backURL = bufferURLEncode(`${location.pathname}${location.search}`);

  const newColumnsBatchWiseStudents: ColumnsType<any> = [
    {
      title: "No",
      render: (text, record, index) => index + 1,
      width: "8%",
      align: "center",
    },
    {
      title: "GR ID",
      dataIndex: "gr_id",
      width: "8%",
      align: "center",
      render: (_, record) => {
        return <>{record.admission.gr_id}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      width: "10%",
      render: (_, record) => {
        const maxLength = 40;
        return (
          <span>
            {showTooltip(
              `${record?.admission?.first_name.toLowerCase()} ${" "} ${record?.admission?.middle_name
                .charAt(0)
                .toUpperCase()}${" "} ${record?.admission?.last_name}`,
              maxLength
            )}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      width: "15%",
      render: (_, record) => {
        return (
          <>
            <Tooltip placement="topLeft" title={record?.admission?.email}>
              <span style={{ textTransform: "none" }}>
                {record?.admission?.email.length > 20
                  ? `${record?.admission?.email
                      .replace(/\n/g, " ")
                      .slice(0, 30)}...`
                  : record?.admission?.email.replace(/\n/g, " ")}
              </span>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Mobile No",
      dataIndex: "mobile_no",
      width: "10%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.admission?.mobile_no}</span>;
      },
    },
    {
      title: "Attendance",
      dataIndex: "status",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_present"]}
              label=""
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                defaultChecked={true}
                onClick={(e) => {
                  handleStatus(record, "is_present", e);
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Weekly schedule",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_weekly_schedule"]}
              label=""
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                defaultChecked={true}
                onClick={(e) => {
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Leave",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_leave"]}
              label=""
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                defaultChecked={false}
                onClick={(e) => {
                  handleStatus(record, "is_leave", e);
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      align: "center",
      width: "30%",
      render: (_, record, index) => {
        return (
          <>
            <span className="studentAttendenceRemark">
              <FloatLabel
                label="Remarks"
                placeholder="Remarks"
                name={[record.id, "remarks"]}
              >
                <Form.Item name={[record.id, "remarks"]}>
                  <Input
                    placeholder=""
                    onChange={(e) => setEditorValue(e.target.value)}
                    value={editorValue}
                  />
                </Form.Item>
              </FloatLabel>

              <Form.Item
                name={["admissionId", record.id, "admission_id"]}
                style={{ display: "none" }}
                initialValue={record.admission_id}
              >
                <Input />
              </Form.Item>
            </span>
          </>
        );
      },
    },
  ];

  const newColumnsBatchWiseStudentsNew: ColumnsType<any> = [
    {
      title: "No",
      align: "center",
      width: "8%",
      render: (text, record, index) => index + 1,
    },
    {
      title: "GR ID",
      dataIndex: "gr_id",
      align: "center",
      width: "8%",
      render: (_, record) => {
        return <>{record.admission.gr_id}</>;
      },
    },
    {
      title: "Name",
      dataIndex: "user",
      key: "user",
      width: "10%",
      render: (_, record) => {
        const maxLength = 40;
        return (
          <span>
            {showTooltip(
              `${record?.admission?.first_name.toLowerCase()} ${" "} ${record?.admission?.middle_name
                .charAt(0)
                .toUpperCase()}${" "} ${record?.admission?.last_name}`,
              maxLength
            )}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      width: "15%",
      render: (_, record) => {
        return (
          <>
            <Tooltip placement="topLeft" title={record?.admission?.email}>
              <span style={{ textTransform: "none" }}>
                {record?.admission?.email.length > 20
                  ? `${record?.admission?.email
                      .replace(/\n/g, " ")
                      .slice(0, 30)}...`
                  : record?.admission?.email.replace(/\n/g, " ")}
              </span>
            </Tooltip>
          </>
        );
      },
    },
    {
      title: "Mobile No",
      dataIndex: "mobile_no",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return <span>{record?.admission?.mobile_no}</span>;
      },
    },
    {
      title: "Attendance",
      dataIndex: "status",
      align: "center",
      width: "5%",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_present"]}
              label=""
              valuePropName="checked"
              initialValue={
                stateType?.type === SessionType.ADD_NEW_TOPIC ||
                stateType?.type === SessionType.REVISION ||
                stateType?.type === SessionType.REGULAR
                  ? true
                  : false
              }
            >
              <Switch
                defaultChecked={
                  stateType?.type === SessionType.ADD_NEW_TOPIC ||
                  stateType?.type === SessionType.REGULAR
                    ? true
                    : false
                }
                onClick={(e) => {
                  handleStatusNew(record, "is_present", e);
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Weekly schedule",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_weekly_schedule"]}
              label=""
              valuePropName="checked"
              initialValue={true}
            >
              <Switch
                defaultChecked={true}
                onClick={(e) => {
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Leave",
      width: "5%",
      align: "center",
      render: (_, record, index) => {
        return (
          <>
            <Form.Item
              name={[record.id, "is_leave"]}
              label=""
              valuePropName="checked"
              initialValue={false}
            >
              <Switch
                defaultChecked={false}
                onClick={(e) => {
                  handleStatusNew(record, "is_leave", e);
                  message.destroy();
                }}
              />
            </Form.Item>
          </>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      align: "center",
      width: "30%",
      render: (_, record, index) => {
        return (
          <>
            <span className="studentAttendenceRemark">
              <FloatLabel
                label="Remarks"
                placeholder="Remarks"
                name={[record.id, "remarks"]}
              >
                <Form.Item name={[record.id, "remarks"]}>
                  <Input
                    placeholder=""
                    onChange={(e) => setEditorValue(e.target.value)}
                    value={editorValue}
                  />
                </Form.Item>
              </FloatLabel>

              <Form.Item
                name={["admissionId", record.id, "admission_id"]}
                style={{ display: "none" }}
                initialValue={record.admission_id}
              >
                <Input />
              </Form.Item>
            </span>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="gx-d-flex gx-justify-content-end mb-20">
        <Button
          key="back"
          className="btn-cancel"
          onClick={() => {
            const url = searchParams.get("r");
            if (url) {
              const backURL = bufferURLDecode(url);
              navigate(backURL, {
                state: stateType,
              });
            } else {
              navigate(`/batch/${batch_id}/shiningSheet?r=${backURL}`, {
                state: stateType,
              });
            }
          }}
        >
          <i className="fa fa-arrow-left back-icon"></i>
          <span className="gx-d-none gx-d-sm-inline-block">Back</span>
        </Button>
        <Button
          className="btn-submit"
          key="submit"
          type="primary"
          htmlType="submit"
          form="myForm"
          disabled={disable}
        >
          <span className="gx-d-none gx-d-sm-inline-block">Save</span>{" "}
          <i className="fa fa-check back-icon gx-mr-0 gx-ml-2"></i>
        </Button>
      </div>
      {studentDetails || presentStudentData || absentStudentData ? (
        <div style={{ height: "auto" }}>
          <Card className="attendance-table">
            <Row
              gutter={22}
              style={{ textAlign: "center" }}
              className="erp-button-group total-attendance px-0 gx-mb-2"
            >
              <Col span={8}>
                <h3 className="bg-blue total-stud">
                  Total Students: {totalCount}
                </h3>
              </Col>
              <Col span={8}>
                <h3 className="bg-success">Present : {presentCount}</h3>
              </Col>
              <Col span={8}>
                <h3 className="bg-danger">Absent : {absentCount}</h3>
              </Col>
            </Row>
            <Form
              id="myForm"
              name="basic"
              autoComplete="off"
              onFinish={onNextStudentAttendence}
              form={form}
            >
              {/* absent */}
              {stateType?.type === SessionType.REPEAT && (
                <>
                  <Table
                    className="attendence-table"
                    columns={newColumnsBatchWiseStudents}
                    pagination={false}
                    dataSource={absentStudentData || []}
                    loading={loading}
                  />
                  <hr />
                </>
              )}

              {/* presnt  */}
              <Table
                className="attendence-table"
                columns={newColumnsBatchWiseStudentsNew}
                pagination={false}
                dataSource={
                  stateType?.type === SessionType.REPEAT
                    ? presentStudentData || []
                    : (studentDetails && studentDetails) || []
                }
                loading={loading}
              />
            </Form>
          </Card>
        </div>
      ) : (
        "No Data"
      )}
      {hourModalOpen && (
        <ModalComponent
          className="sheet-note admission-filter"
          title={" Please Enter Exam Start Time"}
          showModal={hourModalOpen}
          onCancel={() => {
            sethourModalOpen(false);
            setDisable(false);
          }}
          modelWidth={550}
          component={
            <>
              <Form
                id="myForm"
                name="basic"
                autoComplete="off"
                onFinish={(values) => {
                  timeOnSubmit(values);
                }}
                form={form}
              >
                <FloatLabel
                  label="Exam Start Time"
                  placeholder="Enter Exam Start Time"
                  name="start_time"
                  required
                >
                  <>
                    <Form.Item name="start_time" rules={rules.start_time}>
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
                        {generateTimeForTenMinGapArray(7, 22)?.map(
                          ([value, label]) => (
                            <Option value={value}>{label}</Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </>
                </FloatLabel>
              </Form>
            </>
          }
          footer={[
            <Button key="back" onClick={handleCancle}>
              Cancel
            </Button>,
            <Button
              className="btn-apply-filter"
              key="submit"
              type="primary"
              htmlType="submit"
              form="myForm"
              disabled={btn}
            >
              Submit
            </Button>,
          ]}
        ></ModalComponent>
      )}
    </>
  );
};

export default BatchWiseStudentDetailsComponent;
