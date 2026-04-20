import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Row,
  message,
  Drawer,
  Form,
  Select,
  Input,
  DatePicker,
} from "antd";
import {
  StepForwardOutlined,
  CheckOutlined,
  UsergroupAddOutlined,
  EyeOutlined,
  DotChartOutlined,
  LaptopOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import ContainerHeader from "src/components/ContainerHeader";
import TableComponent from "src/components/DataTable";
import { useAppSelector } from "src/state/app.hooks";
import {
  IUserBatch,
  IUserBatchData,
} from "src/services/userBatch/userBatch.model";
import {
  clearRemoveMessageForUserBatch,
  userBatchSelector,
} from "src/state/userBatch/userBatch.reducer";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  batchStartByStatus,
  countBatchData,
  reGenerateBatchSiningSheet,
  searchUserBatchData,
} from "src/state/userBatch/userBatch.action";
import { AppDispatch } from "src/state/app.model";
import { useDispatch, useSelector } from "react-redux";
import { FilterFilled } from "@ant-design/icons";
import { ILevel, IUserFilterDate } from "./UserWiseBatch.model";
import {
  GetSortOrder,
  bufferURLEncode,
  dateFormate,
  showTooltip,
  trimObject,
} from "src/utils/helperFunction";
import UserActionWrapper from "src/components/ActionWrapper/UserActionWrapper";
import {
  Admission_Recurring_type,
  Batch_Type,
  Common,
  UserBatchStatusType,
  UserStatus,
  ZoneType,
} from "src/utils/constants/constant";
import CommonActionConfirmComponent from "src/components/CommonActionConfirm";
import { IStudentByBatch } from "src/state/userBatch/userBatch.model";
import { Can } from "src/ability/can";
import { ability } from "src/ability";
import { setIsSignIn } from "src/state/templateSignningsheet/templateSignningsheet.reducer";
import moment, { Moment } from "moment";
import FloatLabel from "src/components/Form/FloatLabel";
import { courseSelector } from "src/state/course/course.reducer";
import { Course } from "../Batch/batches.model";
import { ISubCourseDetails } from "src/services/subCourse/subCourse.model";
import { subcourseSelector } from "src/state/subCourse/subCourse.reducer";
import { searchSubCourseData } from "src/state/subCourse/subCourse.action";
import { searchCourseData } from "src/state/course/course.action";
import { userSelector } from "src/state/users/user.reducer";
import { searchStudentsListData } from "src/state/studentList/studentList.action";
import { branchSelector } from "src/state/branch/branch.reducer";
import { zoneSelector } from "src/state/zone/zone.reducer";
import { useWatch } from "antd/lib/form/Form";
import { loginSelector } from "src/state/Login/login.reducer";
import { searchZoneData } from "src/state/zone/zone.action";
import { searchBranchData } from "src/state/branch/branch.action";
import { searchUserData } from "src/state/users/user.action";
import ModalComponent from "src/components/Modal";
import { editBatchById } from "src/state/batch/batch.action";
import { clearRemoveMessage } from "src/state/batch/batch.reducer";
import { IStartBatchModelData } from "./BatchWiseStudentDetails.model";
import TheorySelectionModalForm from "src/components/TheorySelectionModalForm";
import {
  ISelectedBatchData,
  ITheorySelectionModalFormValue,
} from "src/components/TheorySelectionModalForm/TheorySelectionModalForm.model";
import { slotDetails } from "./AssignLab/AssignLab.model";
import { BatchEventCreate } from "src/components/BatchEventCreate/BatchEventCreate";
const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

const UserWiseBatch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<IUserBatch>();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const userBatchState = useAppSelector(userBatchSelector);
  const branchState = useAppSelector(branchSelector);
  const zoneState = useAppSelector(zoneSelector);
  const [IsPublicFilterZoneId, setIsPublicFilterZoneId] = useState<number>(0);
  const userState = useAppSelector(userSelector);
  const courseState = useAppSelector(courseSelector);
  const subCourseState = useAppSelector(subcourseSelector);
  const [formValues, setFormValues] = useState({});
  const [ongoing, setOngoingCount] = useState(0);
  const [upComing, setUpComing] = useState(0);
  const [hold, setHoldCount] = useState(0);
  const [cancelled, setCancelledCount] = useState(0);
  const [completed, setCompletedCount] = useState(0);
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState<number>(0);
  const [myBatchStatus, setMyBatchStatus] = useState<string>("");
  const [dynamicSubCourse, setDynamicSubCourse] = useState<ISubCourseDetails[]>(
    []
  );
  const [selectBranch, setSelectBranch] = useState<number | null>(null);
  const [formModelOpen, setFormModelOpen] = useState(false);
  const [selectedBatchRecordData, setSelectedBatchRecordData] =
    useState<ISelectedBatchData>();
  const { userRoleId } = useSelector(loginSelector);
  const zoneId = useWatch("parent_id", form);
  const [IsPublicZoneFilterShow, setIsPublicZoneFilterShow] =
    useState<boolean>(false);
  const [page, setPage] = useState(
    searchParams.get("skip") && searchParams.get("take")
      ? Number(searchParams.get("skip")) / Number(searchParams.get("take")) + 1
      : 1
  );
  const [show, setShow] = useState<boolean>(false);
  const [batchIds, setBatchIds] = useState<number[]>([]);
  const [drawerName, setDrawerName] = useState<Admission_Recurring_type>(
    Admission_Recurring_type.CV
  );
  const [bulkCvCreate, setBulkCvCreate] = useState<boolean>(false);
  const { userData } = useAppSelector(userSelector);
  const storageID: string | null = localStorage.getItem("myStorageID");
  const currentUserZone = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.zone;

  
  useEffect(() => {
    dispatch(
      searchZoneData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        type: ZoneType.PUBLIC,
        isFilter: true,
      })
    );
    dispatch(
      searchBranchData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        isZoneOnly: true,
      })
    );
    dispatch(
      searchSubCourseData({ noLimit: true, orderBy: "name", order: "ASC" })
    );
    dispatch(
      searchCourseData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        isZoneOnly: true,
      })
    );
    dispatch(
      searchUserData({ noLimit: true, orderBy: "first_name", order: "ASC" })
    );
  }, []);

  const isOnlineAccess = branchState.branchesData.data.rows.some(
    (branch) => branch.is_online === true
  );
  const zoneChange = (value: string) => {
    form.setFieldValue("branch_ids", undefined);
  };
  const branchChange = (value: number[]) => {
    form.setFieldValue("user_id", undefined);
  };

  useEffect(() => {
    if (userBatchState.searchData.data) {
      setData(userBatchState.searchData.data);
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
  }, [userBatchState.searchData.data]);
  useEffect(() => {
    const isFindZonePublic = userState.userData.data.user_roles.find(
      (x) => x.id === userRoleId && x.zone.type === ZoneType.PUBLIC
    );
    if (isFindZonePublic) {
      const zoneData = zoneState.zonesData.data.rows.filter(
        (z) => isFindZonePublic.zone.id === z?.parent_id
      );

      if (zoneData.length === 0) {
        setIsPublicZoneFilterShow(false);
      } else {
        setIsPublicZoneFilterShow(true);
        setIsPublicFilterZoneId(isFindZonePublic.zone.id);
      }
    }
  }, [userState, zoneState]);
  useEffect(() => {
    dispatch(countBatchData(dataConvertFromSearchParm())).then((res: any) => {
      res?.payload?.data?.map((level: ILevel) => {
        switch (level.batches_status) {
          case UserBatchStatusType.ONGOING:
            setOngoingCount(level.count);
            break;
          case UserBatchStatusType.UP_COMING:
            setUpComing(level.count);
            break;
          case UserBatchStatusType.ON_HOLD:
            setHoldCount(level.count);
            break;
          case UserBatchStatusType.CANCELLED:
            setCancelledCount(level.count);
            break;
          case UserBatchStatusType.COMPLETED:
            setCompletedCount(level.count);
            break;
        }
      });
    });
  }, [searchParams, filterDrawer]);

  useEffect(() => {
    const data: { batches_status?: [] } = {
      ...setFormValues,
      ...dataConvertFromSearchParm(),
    };
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      if (key === "batches_status") {
        setMyBatchStatus(value);
      } else if (key === "branch_ids") {
        Object.assign(data, {
          ["branch_ids"]: value.split(",").map((branch) => Number(branch)),
        });
      } else {
        Object.assign(data, {
          [key]: value,
        });
      }
    }
    const urlData = Object.fromEntries(new URLSearchParams(searchParams));
    if (urlData && urlData?.start_date && urlData?.end_date) {
      Object.assign(data, {
        ["date"]: [moment(urlData?.start_date), moment(urlData?.end_date)],
      });
    }
    if (urlData && urlData?.complete_start_date && urlData?.complete_end_date) {
      Object.assign(data, {
        ["complete_date"]: [
          moment(urlData?.complete_start_date),
          moment(urlData?.complete_end_date),
        ],
      });
    }
    setFormValues(data);
  }, [searchParams]);

  useEffect(() => {
    const data: IUserFilterDate = {
      ...setFormValues,
      start_date: "",
      end_date: "",
      complete_start_date: "",
      complete_end_date: "",
    };
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      if (key === "batches_status") {
        Object.assign(data, {
          [key]: value.split(","),
        });
      } else if (key === "branch_ids") {
        Object.assign(data, {
          ["branch_ids"]: value.split(",").map((branch) => Number(branch)),
        });
      } else {
        Object.assign(data, {
          [key]: value,
        });
      }
    }
    if (data && data?.start_date && data?.end_date) {
      Object.assign(data, {
        ["date"]: [moment(data?.start_date), moment(data?.end_date)],
      });
    }
    if (data && data?.complete_start_date && data?.complete_end_date) {
      Object.assign(data, {
        ["complete_date"]: [
          moment(data?.complete_start_date),
          moment(data?.complete_end_date),
        ],
      });
    }
    setFormValues(data);
  }, []);

  const onReset = () => {
    setSearchParams({});
    setDynamicSubCourse([]);
    setFormValues(" ");
    setTimeout(() => form.resetFields());
  };

  const onFinish = (values: IUserBatchData) => {
    if (values.date && values.date != null) {
      values.date = values.date.map((date) => {
        let dates = moment(date).format("YYYY-MM-DD");
        return dates;
      });
    }
    let newDateData: string[] = [];
    let data = Object.fromEntries(
      new URLSearchParams(trimObject(searchParams))
    );
    if (values.date) {
      newDateData = values.date;
      let date = {
        start_date: newDateData[0],
        end_date: newDateData[1],
      };
      data = date;
    }

    //Completed Date
    if (values.complete_date && values.complete_date != null) {
      values.complete_date = values.complete_date.map((complete_date) => {
        let dates = moment(complete_date).format("YYYY-MM-DD");
        return dates;
      });
    }
    let newCompletedData: string[] = [];
    let completedData = Object.fromEntries(
      new URLSearchParams(trimObject(searchParams))
    );
    if (values.complete_date) {
      newCompletedData = values.complete_date;
      let date = {
        complete_start_date: newCompletedData[0],
        complete_end_date: newCompletedData[1],
      };
      completedData = date;
    }

    values = { ...data, ...completedData, ...values };
    const { date, complete_date, ...rest } = values;
    const newData = Object.assign(rest);
    Object.keys(newData).forEach(
      (key) =>
        (newData[key] === undefined || newData[key].length <= 0) &&
        delete newData[key]
    );
    const queryString = Object.entries(trimObject(newData))
      .filter(([key, newData]) => newData !== undefined && newData !== "")
      .map(([key, newData]) => key + "=" + newData)
      .join("&");
    setSearchParams(queryString.trim());
    setFilterDrawer(false);
  };

  const onchangeValue = (value: Course) => {
    if (value.course_id) {
      form.setFieldValue("subcourse_id", "");
      setDynamicSubCourse(
        subCourseState.searchData.data.rows.filter(
          (item: ISubCourseDetails) =>
            item.course_id === Number(value?.course_id)
        )
      );
    }
  };

  const resetSelectBatch = () => {
    setSelectBranch(null);
    setBatchIds([]);
  };

  useEffect(() => {
    const data = Object.fromEntries(new URLSearchParams(searchParams));
    setDynamicSubCourse(
      subCourseState.searchData.data.rows.filter(
        (item: ISubCourseDetails) => item.course_id === Number(data.course_id)
      )
    );
  }, [subCourseState.searchData.data]);

  useEffect(() => {
    if (
      ability.can(
        Common.Actions.CAN_ADD,
        Common.Modules.ACADEMIC.ACADEMIC_CV_RANDOM_GENERATE
      ) ||
      ability.can(
        Common.Actions.CAN_ADD,
        Common.Modules.ACADEMIC.ACADEMIC_ES_RANDOM_GENERATE
      ) ||
      ability.can(
        Common.Actions.CAN_ADD,
        Common.Modules.ACADEMIC.ACADEMIC_PIS_RANDOM_GENERATE
      )
    ) {
      const paramsData = Object.fromEntries(new URLSearchParams(searchParams));
      if (paramsData?.batches_status === "CANCELLED") {
        setBulkCvCreate(false);
      } else {
        setBulkCvCreate(true);
      }
    }

    dispatch(searchUserBatchData(dataConvertFromSearchParm())).then(() =>
      setLoading(false)
    );
    localStorage.removeItem("userBatchTime");
  }, [searchParams]);

  useEffect(() => {
    let sum = 0;
    const data = Object.fromEntries(new URLSearchParams(searchParams));
    for (const [key, value] of Object.entries(data)) {
      if (
        key !== "orderBy" &&
        key !== "order" &&
        key !== "skip" &&
        key !== "take" &&
        key !== "is_my_batch" &&
        data[key] !== ""
      ) {
        sum += 1;
      }
    }
    setCount(sum);
  }, [window.location.search]);

  const dataConvertFromSearchParm = () => {
    let data = {};
    for (const entry of Array.from(searchParams.entries())) {
      const [key, value] = entry;
      if (value == "") {
        // setSearchParams("");
        data = "";
      } else if (key === "batches_status") {
        Object.assign(data, {
          [key]: value.split(","),
        });
      } else if (key === "branch_ids") {
        Object.assign(data, {
          [key]: value.split(",").map((branch) => Number(branch)),
        });
      } else if (key === "start_date") {
        Object.assign(data, {
          ["start_date"]: moment(value).format("YYYY-MM-DD"),
        });
      } else if (key === "end_date") {
        Object.assign(data, {
          ["end_date"]: moment(value).format("YYYY-MM-DD"),
        });
      } else if (key === "complete_start_date") {
        Object.assign(data, {
          ["complete_start_date"]: moment(value).format("YYYY-MM-DD"),
        });
      } else if (key === "complete_end_date") {
        Object.assign(data, {
          ["complete_end_date"]: moment(value).format("YYYY-MM-DD"),
        });
      } else {
        Object.assign(data, {
          [key]: value,
        });
      }
    }
    Object.assign(data, { is_my_batch: true });
    return data;
  };

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      form.resetFields();
    }
  }, [formValues]);

  const handleCancel = () => {
    setFilterDrawer(false);
  };

  const handleStartBatch = (data: IStartBatchModelData) => {
    data.batches_status = UserBatchStatusType.ONGOING;
    dispatch(batchStartByStatus(trimObject(data))).then((res) => {
      if (searchParams) {
        dispatch(searchUserBatchData(dataConvertFromSearchParm()));
      }
    });
  };
  const handleSubmitStartBatchForm = (data: ISelectedBatchData) => {
    setSelectedBatchRecordData(data);
    setFormModelOpen(true);
  };

  useEffect(() => {
    if (userBatchState.batchStartByStatus.message) {
      if (userBatchState.batchStartByStatus.hasErrors) {
        message.error(userBatchState.batchStartByStatus.message);
      } else {
        message.success(userBatchState.batchStartByStatus.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.batchStartByStatus.message]);

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
    if (userBatchState.reGenerateBatchSiningSheet.message) {
      if (userBatchState.reGenerateBatchSiningSheet.hasErrors) {
        message.error(userBatchState.reGenerateBatchSiningSheet.message);
      } else {
        message.success(userBatchState.reGenerateBatchSiningSheet.message);
      }
      dispatch(clearRemoveMessageForUserBatch());
    }
  }, [userBatchState.reGenerateBatchSiningSheet.message]);

  const backURL = bufferURLEncode(`${location.pathname}${location.search}`);
  const getStudentDetails = (record: IStudentByBatch) => {
    if (record) {
      dispatch(searchStudentsListData({ batch_id: record.id as number }));
    }
  };

  const gotocheckAttendence = (record: IUserBatchData) => {
    dispatch(setIsSignIn([]));
  };

  const reGenerateSingingSheet = (batch_id: number) => {
    dispatch(reGenerateBatchSiningSheet(batch_id)).then(() => {
      dispatch(searchUserBatchData(dataConvertFromSearchParm()));
    });
  };

  const columns: ColumnsType<IUserBatchData> = [
    {
      title: "No.",
      render: (text, record, index) => (
        <>{(page - 1) * Number(searchParams.get("take")) + index + 1}</>
      ),
      align: "center",
      width: "5%",
    },
    {
      title: "Batch Name",
      dataIndex: "name",
      key: "name",
      width: "25%",
      render: (_, record) => {
        const maxLength = 50;
        return (
          <>
            <span>{showTooltip(record?.name, maxLength)}</span>
            <small
              className={`gx-d-block faculty-name ${
                record?.user?.status === UserStatus.DISABLE
                  ? "inactive-status"
                  : ""
              }`}
            >{`${record?.user?.first_name} ${record?.user?.last_name} `}</small>
          </>
        );
      },
    },
    {
      title: "Course/SubCourse  Name",
      dataIndex: ["course", "name"],
      key: "course_name",
      render: (_, record) => {
        const maxLength = 30;
        return (
          <>
            <span>{showTooltip(record?.course?.name, maxLength)}</span>
            <small className="gx-d-block faculty-name">{`${record?.subcourse?.name}`}</small>
          </>
        );
      },
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
      render: (record) => {
        return <>{dateFormate(record)}</>;
      },
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
      render: (record) => {
        return <>{dateFormate(record)}</>;
      },
    },
    {
      title: "Actual Completed/Academic Date",
      key: "completed_date",
      align: "center",
      render: (record) => {
        return (
          <>
            {record?.completed_date || record?.actual_academic_date ? (
              <>
                <span>
                  {record?.completed_date
                    ? dateFormate(record?.completed_date)
                    : "-"}
                </span>
                <span className="gx-d-block faculty-name">
                  {record?.actual_academic_date
                    ? dateFormate(record?.actual_academic_date)
                    : "-"}
                </span>
              </>
            ) : (
              "-"
            )}
          </>
        );
      },
    },
    {
      title: "Batches Status",
      dataIndex: "batches_status",
      key: "batches_status",
      align: "center",
      render: (record) => {
        switch (record) {
          case UserBatchStatusType.ONGOING:
            return "Ongoing";
          case UserBatchStatusType.UP_COMING:
            return "Up Coming";
          case UserBatchStatusType.ON_HOLD:
            return "On Hold";
          case UserBatchStatusType.COMPLETED:
            return "Completed";
          case UserBatchStatusType.CANCELLED:
            return "Cancelled";
          default:
            return null;
        }
      },
    },
    {
      title: "No Of Students",

      key: "count",
      align: "center",
      render: (record) => {
        return ability.can(
          Common.Actions.CAN_VIEW,
          Common.Modules.ACADEMIC.ACADEMIC_USER_BATCH_STUDENT_VIEW
        ) ? (
          <div
            style={{ cursor: "pointer", color: "#ea5455" }}
            onClick={(e) => {
              getStudentDetails(record);
              navigate(`/batch/${record.id}/StudentDetailsList?r=${backURL}`);
            }}
          >
            {record.count ? record.count : 0}
          </div>
        ) : (
          <div>{record.count ? record.count : 0}</div>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      align: "center",
      render: (record) => {
        return (
          <>
            {record?.batches_status === UserBatchStatusType.UP_COMING ? (
              <Can
                I={Common.Actions.CAN_VIEW}
                a={Common.Modules.ACADEMIC.ACADEMIC_USER_BATCH_START_VIEW}
              >
                {record?.branch_infrastructure_id ? (
                  startBatchModelOpen(record)
                ) : (
                  <UserActionWrapper>
                    <Button
                      danger
                      type="ghost"
                      icon={<StepForwardOutlined />}
                      onClick={() =>
                        handleSubmitStartBatchForm({
                          batchData: record,
                          batches_status: record.batches_status,
                        })
                      }
                      children={"Start Batch"}
                    ></Button>
                  </UserActionWrapper>
                )}
              </Can>
            ) : (
              <>
                {ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC.ACADEMIC_USER_BATCH_ATTENDANCE_VIEW
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC
                    .ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC.ACADEMIC_STUDENT_MARKS_VIEW
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC.ACADEMIC_BATCH_COMPLETED_VIEW
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC.ACADEMIC_LAB_ASSIGN
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.MASTER
                    .REGENERATE_SYLLABUS_AND_PROGRESS_SHEET_VIEW
                ) ||
                ability.can(
                  Common.Actions.CAN_VIEW,
                  Common.Modules.ACADEMIC.ACADEMIC_EXAM
                ) ||
                ability.can(
                  Common.Actions.CAN_ADD,
                  Common.Modules.ACADEMIC.ACADEMIC_CV_RANDOM_GENERATE
                ) ||
                ability.can(
                  Common.Actions.CAN_ADD,
                  Common.Modules.ACADEMIC.ACADEMIC_ES_RANDOM_GENERATE
                ) ||
                ability.can(
                  Common.Actions.CAN_ADD,
                  Common.Modules.ACADEMIC.ACADEMIC_ATTENDANCE_VIEW
                ) ||
                (ability.can(
                  Common.Actions.CAN_ADD,
                  Common.Modules.ACADEMIC.ACADEMIC_PIS_RANDOM_GENERATE
                ) &&
                  record.singing_sheet &&
                  record.batches_status !== Batch_Type.COMPLETED) ? (
                  <UserActionWrapper>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={
                        Common.Modules.ACADEMIC
                          .ACADEMIC_USER_BATCH_ATTENDANCE_VIEW
                      }
                    >
                      {record?.batches_status !==
                        UserBatchStatusType.COMPLETED &&
                        record?.batches_status !==
                          UserBatchStatusType.CANCELLED &&
                        record?.batches_status !==
                          UserBatchStatusType.ON_HOLD && (
                          <Button
                            type="ghost"
                            className="btn_edit"
                            icon={<CheckOutlined />}
                            onClick={(e) => {
                              gotocheckAttendence(record);
                              navigate(
                                `${record.id}/checkAttendence?r=${backURL}`
                              );
                            }}
                          >
                            Check Attendance
                          </Button>
                        )}
                    </Can>
                    {/* <Can
                      I={Common.Actions.CAN_VIEW}
                      a={
                        Common.Modules.ACADEMIC.ACADEMIC_USER_BATCH_STUDENT_VIEW
                      }
                    >
                      <Button
                        type="ghost"
                        className="btn_edit"
                        icon={<UsergroupAddOutlined />}
                        onClick={(e) => {
                          getStudentDetails(record);
                          navigate(
                            `/batch/${record.id}/StudentDetailsList?r=${backURL}`
                          );
                        }}
                      >
                        Students
                      </Button>
                    </Can> */}
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={
                        Common.Modules.ACADEMIC
                          .ACADEMIC_USER_BATCH_FACULTY_SIGNING_SHEET_VIEW
                      }
                    >
                      <Button
                        className="btn_edit"
                        type="ghost"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          if (record.id) {
                            navigate(
                              `/batch/${record.id}/faculty?r=${backURL}`
                            );
                          }
                        }}
                      >
                        Syllabus & Progress Sheet
                      </Button>
                    </Can>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={Common.Modules.ACADEMIC.ACADEMIC_STUDENT_MARKS_VIEW}
                    >
                      <Button
                        type="ghost"
                        className="btn_edit"
                        icon={<UsergroupAddOutlined />}
                        onClick={(e) => {
                          getStudentDetails(record);
                          navigate(
                            `/batch/${record.id}/StudentsMarks?r=${backURL}`
                          );
                        }}
                      >
                        Students Marks
                      </Button>
                    </Can>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={Common.Modules.ACADEMIC.ACADEMIC_BATCH_COMPLETED_VIEW}
                    >
                      <Button
                        type="ghost"
                        className="btn_edit"
                        icon={<DotChartOutlined />}
                        onClick={(e) => {
                          navigate(
                            `/batch/${record.id}/batch-completed-details?r=${backURL}`
                          );
                        }}
                      >
                        Batch Completed
                      </Button>
                    </Can>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={Common.Modules.ACADEMIC.ACADEMIC_LAB_ASSIGN}
                    >
                      {record?.batches_status !==
                        UserBatchStatusType.COMPLETED &&
                        record?.batches_status !==
                          UserBatchStatusType.CANCELLED &&
                        record?.batches_status !==
                          UserBatchStatusType.ON_HOLD && !isOnlineAccess && (
                          <Button
                            type="ghost"
                            className="btn_edit"
                            icon={<LaptopOutlined />}
                            onClick={(e) => {
                              const existSlots = record?.slots?.length
                                ? record?.batchSlots?.slots
                                    .map((slot: slotDetails) => ({
                                      ...slot,
                                      total_count:
                                        slot.hold_count + slot.occupy_count,
                                    }))
                                    ?.sort(
                                      (
                                        slot: slotDetails,
                                        nextSlot: slotDetails
                                      ) =>
                                        parseFloat(slot.start_time) -
                                        parseFloat(nextSlot.start_time)
                                    )
                                : [];
                              navigate(
                                { pathname: `/batch/${record.id}/lab-assign` },
                                {
                                  state: {
                                    batch_name: record.name,
                                    backURL,
                                    branch_id: record.branch.id,
                                    batch_time: record.batch_time,
                                    existSlots,
                                  },
                                }
                              );
                            }}
                          >
                            Assign Lab
                          </Button>
                        )}
                    </Can>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={Common.Modules.ACADEMIC.ACADEMIC_EXAM}
                    >
                      <Button
                        type="ghost"
                        className="btn_edit"
                        icon={<UsergroupAddOutlined />}
                        onClick={(e) => {
                          getStudentDetails(record);
                          navigate(`/batch/${record.id}/exams?r=${backURL}`);
                        }}
                      >
                        Exams
                      </Button>
                    </Can>
                    <Can
                      I={Common.Actions.CAN_VIEW}
                      a={Common.Modules.ACADEMIC.ACADEMIC_ATTENDANCE_VIEW}
                    >
                      <Button
                        type="ghost"
                        className="btn_edit"
                        icon={<LaptopOutlined />}
                        onClick={(e) => {
                          navigate(`/batch/${record.id}/student-attendance`);
                        }}
                      >
                        Attendance
                      </Button>
                    </Can>
                  </UserActionWrapper>
                ) : (
                  ""
                )}
              </>
            )}
          </>
        );
      },
    },
  ];

  const filterDataByStatus = (userStatus: string) => {
    const urldata = Object.fromEntries(new URLSearchParams(searchParams));
    // dispatch(
    //   searchUserBatchData({ batches_status: userStatus, is_my_batch: true })
    // );
    if (userStatus) {
      Object.assign(urldata, { batches_status: userStatus });
      const { skip, ...rest } = urldata;
      setSearchParams(rest);
    } else {
      const { batches_status, ...rest } = urldata;
      setSearchParams(rest);
    }
    setMyBatchStatus(userStatus);
  };

  const courseChange = () => {
    form.setFieldValue("subcourse_id", undefined);
  };
  const allBranchIds = branchState.branchesData.data.rows.map(
    (branch) => branch.id
  );

  const startBatchModelOpen = (data: IStartBatchModelData) => {
    return (
      <UserActionWrapper>
        <CommonActionConfirmComponent
          title={"Are you sure want to start batch?"}
          cancelText={"NO"}
          okText={"YES"}
          onDelete={() =>
            handleStartBatch({
              id: data.id,
              batches_status: data.batches_status,
            })
          }
          children={"Start Batch"}
          ConfirmIcon={<StepForwardOutlined />}
          buttonIcon={<StepForwardOutlined />}
        />
      </UserActionWrapper>
    );
  };

  const onSubmitTheoryForm = (data: ITheorySelectionModalFormValue) => {
    const formatDateTime = (dateTime?: string | null | Moment) =>
      dateTime ? moment(dateTime).format("l LT") : null;
    const batchRecord = { ...selectedBatchRecordData?.batchData };

    const editBatchPayload = {
      id: batchRecord.id,
      name: batchRecord.name,
      branch_id: batchRecord.branch?.id,
      user_id: batchRecord.user?.id,
      course_id: batchRecord.course?.id,
      subcourse_id: batchRecord.subcourse?.id,
      template_id: batchRecord.template_id,
      day_one: batchRecord.day_one,
      day_two: batchRecord.day_two,
      day_three: batchRecord.day_three,
      day_four: batchRecord.day_four,
      day_five: batchRecord.day_five,
      day_six: batchRecord.day_six,
      day_seven: batchRecord.day_seven,
      number_of_days: batchRecord.number_of_days,
      batches_status: batchRecord.batches_status,
    };

    const finalEditBatchPayload = {
      ...editBatchPayload,
      start_date: formatDateTime(batchRecord?.start_date),
      end_date: formatDateTime(batchRecord?.end_date),
      batch_time: Number(batchRecord.batch_time || 0),
      branch_infrastructure_id: data.branch_infrastructure_id,
      duration: parseFloat((batchRecord?.duration as string) || "0"),
    };

    dispatch(editBatchById(finalEditBatchPayload)).then((res: any) => {
      if (res.payload) {
        setFormModelOpen(false);
        message.success(res?.payload?.message);
        dispatch(searchUserBatchData(dataConvertFromSearchParm()));
      } else {
        message.error(res?.error?.message);
      }
      dispatch(clearRemoveMessage());
    });
  };
  return (
    <>
      <div className="rnw-main-content">
        <Row
          align="middle"
          justify="space-between"
          gutter={24}
          className="mb-20"
        >
          <Col xxl={21}>
            <h2 className="rnw-page-title gx-d-flex">
              <ContainerHeader title="My Batches" />
            </h2>
          </Col>
          <Col
            lg={12}
            className="erp-filter-btn gx-d-xl-none"
            style={{ textAlign: "end" }}
          >
            {bulkCvCreate && (
              <>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_CV_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.CV);
                      setShow(true);
                    }}
                  >
                    CV
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_ES_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.ES);
                      setShow(true);
                    }}
                  >
                    ES
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_PIS_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.PIS);
                      setShow(true);
                    }}
                  >
                    PIS
                  </Button>
                </Can>
              </>
            )}
            <Button
              icon={<FilterFilled />}
              onClick={() => setFilterDrawer(true)}
            >
              Filter
            </Button>
            <Button onClick={() => setStatusModal(true)}> Status</Button>
          </Col>
        </Row>
        <Row
          align="middle"
          justify="space-between"
          gutter={24}
          className="mb-20 gx-d-none gx-d-xl-flex"
        >
          {statusModal ? (
            <Drawer
              className="admission-filter"
              title="Status Filter"
              open={statusModal}
              visible={statusModal}
              onClose={() => {
                setStatusModal(false);
              }}
            >
              <Col xxl={21} className="erp-button-group">
                <Button
                  className={
                    "bg-darkBlue " + (myBatchStatus === "" ? "active" : "")
                  }
                  onClick={(e) => {
                    filterDataByStatus("");
                    setStatusModal(false);
                  }}
                >
                  All
                  <Badge
                    overflowCount={99999}
                    count={ongoing + upComing + hold + cancelled + completed}
                    style={{ backgroundColor: "#5864bd", boxShadow: "none" }}
                    showZero
                  />
                </Button>
                <Button
                  className={
                    "bg-blue " +
                    `${
                      myBatchStatus.includes(UserBatchStatusType.ONGOING)
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={(e) => {
                    filterDataByStatus(UserBatchStatusType.ONGOING);
                    setStatusModal(false);
                  }}
                >
                  Ongoing
                  <Badge
                    overflowCount={99999}
                    count={ongoing}
                    style={{ backgroundColor: "#3abaf4", boxShadow: "none" }}
                    showZero
                  />
                </Button>
                <Button
                  className={
                    "bg-warning " +
                    `${
                      myBatchStatus.includes(UserBatchStatusType.UP_COMING)
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={(e) => {
                    filterDataByStatus(UserBatchStatusType.UP_COMING);
                    setStatusModal(false);
                  }}
                >
                  Up Coming
                  <Badge
                    overflowCount={99999}
                    count={upComing}
                    style={{ backgroundColor: "#ffa426", boxShadow: "none" }}
                    showZero
                  />
                </Button>
                <Button
                  className={
                    "bg-purple " +
                    `${
                      myBatchStatus.includes(UserBatchStatusType.ON_HOLD)
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={(e) => {
                    filterDataByStatus(UserBatchStatusType.ON_HOLD);
                    setStatusModal(false);
                  }}
                >
                  On Hold
                  <Badge
                    overflowCount={99999}
                    count={hold}
                    style={{ backgroundColor: "#9852a5", boxShadow: "none" }}
                    showZero
                  />
                </Button>
                <Button
                  className={
                    "bg-success " +
                    `${
                      myBatchStatus.includes(UserBatchStatusType.COMPLETED)
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={(e) => {
                    filterDataByStatus(UserBatchStatusType.COMPLETED);
                    setStatusModal(false);
                  }}
                >
                  Completed
                  <Badge
                    overflowCount={99999}
                    count={completed}
                    style={{ backgroundColor: "#54ca68", boxShadow: "none" }}
                    showZero
                  />
                </Button>
                <Button
                  className={
                    "bg-orange " +
                    `${
                      myBatchStatus.includes(UserBatchStatusType.CANCELLED)
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={(e) => {
                    filterDataByStatus(UserBatchStatusType.CANCELLED);
                    setStatusModal(false);
                  }}
                >
                  Cancelled
                  <Badge
                    overflowCount={99999}
                    count={cancelled}
                    style={{ backgroundColor: "#fc544b", boxShadow: "none" }}
                    showZero
                  />
                </Button>
              </Col>
            </Drawer>
          ) : (
            <Col flex="1 1 auto" className="erp-button-group">
              <Button
                className={
                  "bg-darkBlue " + (myBatchStatus === "" ? "active" : "")
                }
                onClick={(e) => filterDataByStatus("")}
              >
                All
                <Badge
                  overflowCount={99999}
                  count={ongoing + upComing + hold + cancelled + completed}
                  style={{ backgroundColor: "#5864bd", boxShadow: "none" }}
                  showZero
                />
              </Button>
              <Button
                className={
                  "bg-blue " +
                  `${
                    myBatchStatus.includes(UserBatchStatusType.ONGOING)
                      ? "active"
                      : ""
                  }`
                }
                onClick={(e) => filterDataByStatus(UserBatchStatusType.ONGOING)}
              >
                Ongoing
                <Badge
                  overflowCount={99999}
                  count={ongoing}
                  style={{ backgroundColor: "#3abaf4", boxShadow: "none" }}
                  showZero
                />
              </Button>
              <Button
                className={
                  "bg-warning " +
                  `${
                    myBatchStatus.includes(UserBatchStatusType.UP_COMING)
                      ? "active"
                      : ""
                  }`
                }
                onClick={(e) =>
                  filterDataByStatus(UserBatchStatusType.UP_COMING)
                }
              >
                Up Coming
                <Badge
                  overflowCount={99999}
                  count={upComing}
                  style={{ backgroundColor: "#ffa426", boxShadow: "none" }}
                  showZero
                />
              </Button>
              <Button
                className={
                  "bg-purple " +
                  `${
                    myBatchStatus.includes(UserBatchStatusType.ON_HOLD)
                      ? "active"
                      : ""
                  }`
                }
                onClick={(e) => filterDataByStatus(UserBatchStatusType.ON_HOLD)}
              >
                On Hold
                <Badge
                  overflowCount={99999}
                  count={hold}
                  style={{ backgroundColor: "#9852a5", boxShadow: "none" }}
                  showZero
                />
              </Button>
              <Button
                className={
                  "bg-success " +
                  `${
                    myBatchStatus.includes(UserBatchStatusType.COMPLETED)
                      ? "active"
                      : ""
                  }`
                }
                onClick={(e) =>
                  filterDataByStatus(UserBatchStatusType.COMPLETED)
                }
              >
                Completed
                <Badge
                  overflowCount={99999}
                  count={completed}
                  style={{ backgroundColor: "#54ca68", boxShadow: "none" }}
                  showZero
                />
              </Button>
              <Button
                className={
                  "bg-orange " +
                  `${
                    myBatchStatus.includes(UserBatchStatusType.CANCELLED)
                      ? "active"
                      : ""
                  }`
                }
                onClick={(e) =>
                  filterDataByStatus(UserBatchStatusType.CANCELLED)
                }
              >
                Cancelled
                <Badge
                  overflowCount={99999}
                  count={cancelled}
                  style={{ backgroundColor: "#fc544b", boxShadow: "none" }}
                  showZero
                />
              </Button>
              {/* <Button
                  className={"bg-purple " + `${bulkCvCreate ? "active" : ""}`}
                  onClick={() => {
                    setBulkCvCreate((prev) => !prev);
                  }}
                >
                  Bulk CV
                  <Badge
                    overflowCount={99999}
                    count={batchIds.length}
                    style={{ backgroundColor: "#9852a5", boxShadow: "none" }}
                    showZero
                  />
                </Button> */}
            </Col>
          )}

          <div className="filter" style={{ height: "auto" }}>
            <Drawer
              className="filter-drawer"
              title="My Batch Filter"
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
                    onClick={() => filterDataByStatus("")}
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
                form={form}
                onValuesChange={onchangeValue}
                onReset={onReset}
                initialValues={formValues}
              >
                <Row>
                  {IsPublicZoneFilterShow && (
                    <>
                      <Col xs={24}>
                        <FloatLabel
                          label="Zone"
                          placeholder="Select Zone"
                          name="parent_id"
                        >
                          <Form.Item name="parent_id">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              showSearch
                              size="large"
                              filterOption={(input, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase().trim())
                              }
                              onChange={zoneChange}
                            >
                              {zoneState.zonesData.data.rows.map((z) => (
                                <>
                                  {IsPublicFilterZoneId === z?.parent_id && (
                                    <Option value={z.id.toString()}>
                                      {z.code + "-" + z.name}
                                    </Option>
                                  )}
                                </>
                              ))}
                            </Select>
                          </Form.Item>
                        </FloatLabel>
                      </Col>
                    </>
                  )}
                  {currentUserZone?.type !== ZoneType.PRIVATE && (
                    <Col xs={24}>
                      <FloatLabel
                        label="Branch Code"
                        placeholder="Select Branch Code"
                        name="branch_ids"
                      >
                        <Form.Item name="branch_ids">
                          <Select
                            getPopupContainer={(trigger) => trigger.parentNode}
                            mode="multiple"
                            showArrow
                            allowClear
                            showSearch
                            onChange={branchChange}
                            filterOption={(input, option) =>
                              (option?.children?.toString() || "")
                                .toLowerCase()
                                .includes(input.toLowerCase().trim())
                            }
                          >
                            {branchState.branchesData.data.rows
                              .filter((item) =>
                                zoneId
                                  ? Number(item.zone?.parent_id[0].id) ===
                                    Number(zoneId)
                                  : item
                              )
                              .map((branch) => {
                                return (
                                  <Option value={branch?.id}>
                                    {branch?.code}
                                  </Option>
                                );
                              })}
                          </Select>
                        </Form.Item>
                      </FloatLabel>
                    </Col>
                  )}
                  <Col xs={24}>
                    <FloatLabel
                      label="Course"
                      placeholder="Select Course"
                      name="course_id"
                    >
                      <Form.Item name="course_id">
                        <Select
                          allowClear
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children?.toString() || "")
                              .toLowerCase()
                              .includes(input.toLowerCase().trim())
                          }
                          onChange={courseChange}
                        >
                          {courseState.coursesData.data.rows.map((b) => (
                            <Option key={b.id} value={b.id.toString()}>
                              {b.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <FloatLabel
                      label="Subcourse"
                      placeholder="Select Subcourse"
                      name="subcourse_id"
                    >
                      <Form.Item name="subcourse_id">
                        <Select
                          allowClear
                          showSearch
                          filterOption={(input, option) =>
                            (option?.children?.toString() || "")
                              .toLowerCase()
                              .includes(input.toLowerCase().trim())
                          }
                        >
                          {dynamicSubCourse.map((subCourse) => (
                            <>
                              <Option
                                key={subCourse.id}
                                value={subCourse.id.toString()}
                              >
                                {subCourse.name}
                              </Option>
                            </>
                          ))}
                        </Select>
                      </Form.Item>
                    </FloatLabel>
                  </Col>

                  <Col xs={24}>
                    <FloatLabel
                      label="Batch Name"
                      placeholder="Enter Batch Name"
                      name="name"
                    >
                      <Form.Item name="name">
                        <Input size="large" />
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <FloatLabel
                      label="Batches Status"
                      placeholder="Select Batches Status"
                      name="batches_status"
                    >
                      <Form.Item name="batches_status">
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          allowClear
                          showArrow
                          mode="multiple"
                          size="large"
                          filterOption={(input, option) =>
                            (option?.children?.toString() || "")
                              .toLowerCase()
                              .includes(input.toLowerCase().trim())
                          }
                        >
                          <Option value={UserBatchStatusType.ONGOING}>
                            On Going
                          </Option>
                          <Option value={UserBatchStatusType.UP_COMING}>
                            Up Coming
                          </Option>
                          <Option value={UserBatchStatusType.ON_HOLD}>
                            On Hold
                          </Option>
                          <Option value={UserBatchStatusType.COMPLETED}>
                            Completed
                          </Option>
                          <Option value={UserBatchStatusType.CANCELLED}>
                            Cancelled
                          </Option>
                        </Select>
                      </Form.Item>
                    </FloatLabel>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="date"
                      label="Batch Start Date"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <RangePicker
                        style={{ width: "100%" }}
                        name="date"
                        getPopupContainer={(trigger) => trigger}
                        format={dateFormat}
                        ranges={{
                          Today: [moment(), moment()],
                          Week: [
                            moment().startOf("week"),
                            moment().endOf("week"),
                          ],
                          "This Month": [
                            moment().startOf("month"),
                            moment().endOf("month"),
                          ],
                          "This Year": [
                            moment().startOf("year"),
                            moment().endOf("year"),
                          ],
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      name="complete_date"
                      label="Batch Completed Date"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <RangePicker
                        style={{ width: "100%" }}
                        name="complete_date"
                        getPopupContainer={(trigger) => trigger}
                        format={dateFormat}
                        ranges={{
                          Today: [moment(), moment()],
                          Week: [
                            moment().startOf("week"),
                            moment().endOf("week"),
                          ],
                          "This Month": [
                            moment().startOf("month"),
                            moment().endOf("month"),
                          ],
                          "This Year": [
                            moment().startOf("year"),
                            moment().endOf("year"),
                          ],
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Drawer>
          </div>

          <Col
            xxl={6}
            className=" gx-d-none gx-d-xl-inline-block"
            style={{ textAlign: "end" }}
          >
            {bulkCvCreate && (
              <>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_CV_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.CV);
                      setShow(true);
                    }}
                  >
                    CV
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_ES_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.ES);
                      setShow(true);
                    }}
                  >
                    ES
                  </Button>
                </Can>
                <Can
                  I={Common.Actions.CAN_ADD}
                  a={Common.Modules.ACADEMIC.ACADEMIC_PIS_RANDOM_GENERATE}
                >
                  <Button
                    disabled={!batchIds.length}
                    className="btn-submit gx-mt-0"
                    type="primary"
                    onClick={() => {
                      setDrawerName(Admission_Recurring_type.PIS);
                      setShow(true);
                    }}
                  >
                    PIS
                  </Button>
                </Can>
              </>
            )}
            <Button
              icon={<FilterFilled />}
              onClick={() => setFilterDrawer(true)}
            >
              Filter
              <span>
                <Badge count={count}></Badge>
              </span>
            </Button>
          </Col>
        </Row>
        <Card className="rnw-card table-card cheque-amount gx-mb-0">
          <TableComponent
            columns={columns}
            dataSource={
              data?.rows.slice().sort(GetSortOrder("start_date", "DESC")) || []
            }
            loading={loading}
            meta={data?.meta}
            rowKey="id"
            rowSelection={
              bulkCvCreate && {
                selectedRowKeys: batchIds,
                onChange: (
                  batch_check: number[],
                  selectedRows: IUserBatchData[]
                ) => {
                  if (selectedRows.length === 1) {
                    const [firstBranch] = selectedRows;
                    setSelectBranch(firstBranch.branch.id);
                  } else if (selectedRows.length === 0) {
                    setSelectBranch(null);
                  }
                  setBatchIds(batch_check);
                },
              }
            }
          />
        </Card>
        <BatchEventCreate
          show={show}
          setShow={(value) => setShow(value)}
          batchIds={batchIds}
          selectBranch={selectBranch}
          setSelectBranch={(value) => setSelectBranch(value)}
          drawerName={drawerName}
          resetSelectBatch={resetSelectBatch}
        />
      </div>

      {formModelOpen && selectedBatchRecordData && (
        <ModalComponent
          className="theory-note admission-filter"
          modelWidth={500}
          title={"Select Theory"}
          showModal={formModelOpen}
          onCancel={() => {
            setFormModelOpen(false);
          }}
          component={
            <TheorySelectionModalForm
              onSubmit={onSubmitTheoryForm}
              selectedBatchRecord={selectedBatchRecordData}
            />
          }
          footer={[
            <Button key="back" onClick={() => setFormModelOpen(false)}>
              Cancel
            </Button>,
            <Button
              className="btn-apply-filter"
              key="submit"
              type="primary"
              loading={loading}
              htmlType="submit"
              form="myFormHoldBatch"
            >
              Submit
            </Button>,
          ]}
        ></ModalComponent>
      )}
    </>
  );
};

export default UserWiseBatch;
