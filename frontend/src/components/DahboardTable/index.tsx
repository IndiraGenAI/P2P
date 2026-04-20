import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Row,
  Select,
  Form,
  Slider,
  SliderSingleProps,
} from "antd";
import TableComponent from "../DataTable";
import { IDashboardTableProps } from "./DashboardTable.model";
import {
  Dashboard_Card_Type,
  RoleType,
  SessionType,
  TopicType,
  Url_Type,
  UserBatchStatusType,
} from "src/utils/constants/constant";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FilterFilled,
  CalendarOutlined,
} from "@ant-design/icons";
import DrawerComponent from "../Drawer";
import CompanyVisitField from "src/pages/CompanyVisitUpdateCard/CompanyVisitField";
import { userBatchSelector } from "src/state/userBatch/userBatch.reducer";
import { useAppSelector } from "src/state/app.hooks";
import {
  GetSortOrder,
  bufferURLEncode,
  getFacultyByZone,
  openInNewTab,
} from "src/utils/helperFunction";
import { userSelector } from "src/state/users/user.reducer";
import { CSVLink } from "react-csv";
import { studentListSelector } from "src/state/studentList/studentList.reducer";

import { PerformanceRange } from "src/services/studentList/studentList.model";

import DashboardFilter from "../DashboardFilter";
import moment, { Moment } from "moment";
import ReportExpertSessionField from "src/pages/ExpertSessionUpdate/ReportExpertSessionField";
import ReportInterviewSessionField from "src/pages/InterviewSessionUpdate/ReportInterviewSessionField";
import { MasterDahsboardFilterContext } from "src/contexts/MasterDashboardFilterContext";

const { Option } = Select;
const DashboardTable = (props: IDashboardTableProps) => {
  const {
    columns,
    csvColumns,
    className,
    dataSource,
    loading,
    meta,
    status,
    setSorter,

    facultyFilterShow,
    CardTitle,
    dataCount,
    selectShow,
    isCountShow,
    showCreateCVBtn,
    showPTMViewBtn,
    showCreatePISBtn,
    showReportedCVList,
    selectedBatch,
    setSelectedBatch,
    showBatchSelector,
    url,

    setSelectedFaculty,
    csvFileName,
    isProjectTypeFilter,
    setProjectType,
    projectType,
    setIsLinkSubmitted,
    isLinkSubmitted,
    setBranchFilter,
    setZoneFilter,
    showBatchFilter,
    responsiveFilter,
    isShowDateFilter,
    setStartDateAndEndDate_date,
    isShowDateDashboard,
    isShowDateRange,
    showCreateESBtn,
    isStudentLowPerformanceFilter,
    performanceRange,
    setperformanceRange,
    csvData,
    fetchData,
    lastElementRef,
  } = props;
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const userState = useAppSelector(userSelector);
  const userBatchState = useAppSelector(userBatchSelector);
  const StudentListState = useAppSelector(studentListSelector);
  const navigate = useNavigate();
  const backURL = bufferURLEncode(`/batch`);
  const [show, setShow] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<
    [Moment | null, Moment | null] | null
  >();
  const [isShowDate, setIsShowDate] = useState<boolean>(true);
  const [isShowBatch, setIsShowBatch] = useState<boolean>(true);
  const [isShowLowPerformance, setIsShowLowPerformance] =
    useState<boolean>(true);

  const { userData } = useAppSelector(userSelector);
  const storageID: string | null = localStorage.getItem("myStorageID");
  const {
    masterSelectedFaculty,
    masterSelectedDate,
    masterSelectedBranch,
    masterSelectedZone,
  } = useContext(MasterDahsboardFilterContext);

  const { RangePicker } = DatePicker;
  const dateFormat = "DD/MM/YYYY";

  const currentUserZone = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.zone;
  const currentUserRole = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.role;
  const dateFiltervalue = (value: [Moment | null, Moment | null] | null) => {
    setDateFilter(value);
    setStartDateAndEndDate_date && setStartDateAndEndDate_date(value);

    window.innerWidth <= 991 && setIsShowDate(false);
  };

  useEffect(() => {
    setDateFilter(masterSelectedDate);
  }, [masterSelectedBranch, masterSelectedZone, masterSelectedDate]);

  useEffect(() => {
    const storedOption = localStorage.getItem("selectedOption");
    if (storedOption) {
      try {
        setSelectedOption(JSON.parse(storedOption));
      } catch (error) {
        localStorage.removeItem("selectedOption");
      }
    }
  }, []);
  const handleBatchChange = (value: string[]) => {
    setSelectedOption(value);
    if (value) {
      status && status(value);
    }
  };
  const handleProjectTypeChange = (value: string) => {
    setProjectType && setProjectType(value);
  };
  const handleLinkSubmitted = (value: boolean | string) => {
    setIsLinkSubmitted && setIsLinkSubmitted(value);
  };
  const handleFacultyChange = (value: number) => {
    setSelectedFaculty && setSelectedFaculty(value);
  };

  const handleBatchName = (value: number) => {
    setSelectedBatch && setSelectedBatch(value);
  };
  const handleRangeFilter = (value: PerformanceRange) => {
    setperformanceRange && setperformanceRange(value);
  };
  const returnLengthOfBatch = (type: string) => {
    return userBatchState.searchData.data.rows.filter(
      (d) => d.batches_status === type
    ).length;
  };

  const returnProjectType = (type: string) => {
    return StudentListState.studentPendingMarks.data.rows.filter(
      (p) => p.type === type
    ).length;
  };

  const facultyData = currentUserZone
    ? getFacultyByZone(userState.usersData.data, currentUserZone?.id)
    : [];

  const projectOption = (
    <>
      <Option value={TopicType.PROJECT}>
        Project ({returnProjectType(TopicType.PROJECT)})
      </Option>
      <Option value={TopicType.VIVA}>
        Viva ({returnProjectType(TopicType.VIVA)})
      </Option>
      <Option value={TopicType.EXAM_PRACTICAL}>
        Exam Practical ({returnProjectType(TopicType.EXAM_PRACTICAL)})
      </Option>
      <Option value={TopicType.EXAM_THEORY}>
        Exam Theory ({returnProjectType(TopicType.EXAM_THEORY)})
      </Option>
    </>
  );

  const rangeFilter: SliderSingleProps["marks"] = {
    0: { label: <strong>0</strong> },
    60: { label: <strong>60</strong> },
    100: { label: <strong>100</strong> },
  };

  const batchStatusOption = (
    <>
      <Option value={UserBatchStatusType.ONGOING}>
        On Going ({returnLengthOfBatch(UserBatchStatusType.ONGOING)})
      </Option>
      <Option value={UserBatchStatusType.UP_COMING}>
        Up Coming ({returnLengthOfBatch(UserBatchStatusType.UP_COMING)})
      </Option>
      <Option value={UserBatchStatusType.ON_HOLD}>
        On Hold ({returnLengthOfBatch(UserBatchStatusType.ON_HOLD)})
      </Option>
    </>
  );
  const btnName = showCreateESBtn ? "ES" : showCreateCVBtn ? "CV" : "PIS";

  const drawerName = showCreateESBtn
    ? "Expert Session"
    : showCreateCVBtn
    ? "Company Visit"
    : "Placement Interview Session";

  const handleResize = () => {
    setIsShowBatch(window.innerWidth <= 991 ? false : true);
    setIsShowDate(window.innerWidth <= 991 ? false : true);
  };
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Card className="faculty-dashboard-card gx-mt-2">
        <div className="card-header gx-d-flex gx-justify-content-between gx-align-items-center">
          <h5
            className={`
            ${isCountShow === true ? "gx-ml-2 gx-mb-0 gx-d-flex" : ""} 
            ${
              window.innerWidth <= 991 && isShowDate && isShowBatch
                ? "gx-d-none"
                : "gx-d-xl-flex"
            }}`}
          >
            <p className="gx-d-flex gx-align-items-center gx-mb-0">
              <p className="gx-mb-0">
                {CardTitle} {dataCount ? `(${dataCount})` : ""}
                <span
                  className={isCountShow === true ? "gx-ml-1 " : "gx-d-none"}
                >
                  {dataSource.length === 0 ? "" : `(${dataSource.length})`}
                </span>
                {currentUserRole?.type === RoleType.FACULTY && (
                  <span
                    className={
                      showBatchSelector && selectedBatch && url
                        ? "dashboardInfoBtn gx-mx-1"
                        : "gx-d-none"
                    }
                    onClick={() => {
                      const backURLForShiningSheet = bufferURLEncode(
                        `/batch/${selectedBatch}/checkAttendence?r=${backURL}`
                      );

                      url === Url_Type.SHINING_SHEET
                        ? openInNewTab(
                            `/batch/${selectedBatch}/${url}?r=${backURLForShiningSheet}?type=${SessionType.REVISION}`
                          )
                        : openInNewTab(
                            `/batch/${selectedBatch}/${url}?r=${backURL}`
                          );
                    }}
                  >
                    <InfoCircleOutlined />
                  </span>
                )}
              </p>
            </p>
          </h5>

          <div className="gx-d-flex gx-align-items-center">
            {csvFileName && (
              <CSVLink
                className="gx-mr-2"
                filename={csvFileName}
                data={csvData ? csvData : dataSource}
                headers={
                  csvColumns
                    ? csvColumns
                    : columns
                        .filter((colName) => colName.title !== "Action")
                        .map((colName) => {
                          return {
                            label: colName.title as string,
                            key: colName.className as string,
                          };
                        })
                }
              >
                <div className="action-icon">
                  <DownloadOutlined style={{ fontSize: "20px" }} />
                </div>{" "}
              </CSVLink>
            )}

            {showPTMViewBtn && (
              <a
                href="javascript:;"
                onClick={(e) => navigate(`/view-ptm-list`)}
                className="gx-mr-2"
              >
                ALL
              </a>
            )}

            {currentUserRole?.type !== RoleType.FACULTY && isShowDateRange && (
              <RangePicker
                className="gx-mr-2 gx-ml-1"
                style={{
                  width:
                    CardTitle === Dashboard_Card_Type.LOW_ATTENDANCE ||
                    CardTitle === Dashboard_Card_Type.OVERDUE_BRANCHES ||
                    CardTitle ===
                      Dashboard_Card_Type.BELOW_EIGHTY_PERCENTAGE_STUDENT_REPORT ||
                    CardTitle ===
                      Dashboard_Card_Type.CANCEL_TERMINATED_STUDENT_LIST
                      ? "100%"
                      : "70%",
                }}
                name="installment_date"
                format={dateFormat}
                value={dateFilter || [moment().subtract(30, "days"), moment()]}
                ranges={{
                  Today: [moment(), moment()],
                  Week: [moment().startOf("week"), moment().endOf("week")],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                  "This Year": [
                    moment().startOf("year"),
                    moment().endOf("year"),
                  ],
                }}
                onChange={dateFiltervalue}
              />
            )}
            {(currentUserRole?.type !== RoleType.FACULTY || responsiveFilter) &&
            !(
              CardTitle === Dashboard_Card_Type.CONTINUOUSLY_ABSENT &&
              currentUserRole?.type === RoleType.FACULTY_HEAD
            ) &&
            !(
              CardTitle === Dashboard_Card_Type.OVERDUE_BRANCHES &&
              currentUserRole?.type !== RoleType.SUPER_ADMIN
            ) ? (
              <DashboardFilter
                CardTitle={CardTitle}
                setBranchFilter={setBranchFilter}
                setZoneFilter={setZoneFilter}
                selectShow={selectShow}
                selectedOption={selectedOption}
                handleChange={handleBatchChange}
                isProjectTypeFilter={isProjectTypeFilter}
                projectOption={projectOption}
                handleProjectTypeChange={handleProjectTypeChange}
                batchStatusOption={batchStatusOption}
                facultyData={facultyData}
                facultyFilterShow={facultyFilterShow}
                handleFacultyChange={handleFacultyChange}
                handleBatchName={handleBatchName}
                showBatchFilter={showBatchFilter}
                isShowDateFilter={isShowDateFilter}
                setInstallment_date={dateFiltervalue}
                isStudentLowPerformanceFilter={isStudentLowPerformanceFilter}
                rangeFilter={rangeFilter}
                handleRangeFilter={handleRangeFilter}
                handleLinkSubmitted={handleLinkSubmitted}
                fetchData={fetchData}
              />
            ) : (
              <div className="gx-d-flex gx-mr-2">
                {isStudentLowPerformanceFilter && isShowLowPerformance ? (
                  <>
                    <Form.Item
                      name="behaviour_with_faculty"
                      className="gx-mb-0 gx-ml-4 gx-mr-4"
                    >
                      <Slider
                        range
                        style={{ width: "80px" }}
                        marks={rangeFilter}
                        onChange={handleRangeFilter}
                        defaultValue={[0, 60]}
                        min={0}
                        max={100}
                      />
                    </Form.Item>
                  </>
                ) : (
                  isStudentLowPerformanceFilter && (
                    <Button
                      className="filter-icon-btn"
                      icon={<FilterFilled />}
                      onClick={() => setIsShowLowPerformance(true)}
                    ></Button>
                  )
                )}
                {(currentUserRole?.type === RoleType.SUPER_ADMIN ||
                  currentUserRole?.type === RoleType.FACULTY) &&
                isShowDateDashboard &&
                isShowDate ? (
                  <RangePicker
                    className="gx-mr-2 gx-ml-1"
                    style={{
                      width:
                        CardTitle === Dashboard_Card_Type.OVERDUE_BRANCHES
                          ? "100%"
                          : "70%",
                    }}
                    name="installment_date"
                    format={dateFormat}
                    value={
                      CardTitle === Dashboard_Card_Type.LOW_ATTENDANCE ||
                      CardTitle === Dashboard_Card_Type.OVERDUE_BRANCHES ||
                      CardTitle ===
                        Dashboard_Card_Type.BELOW_EIGHTY_PERCENTAGE_STUDENT_REPORT ||
                      CardTitle ===
                        Dashboard_Card_Type.CANCEL_TERMINATED_STUDENT_LIST
                        ? dateFilter || [
                            moment().subtract(30, "days"),
                            moment(),
                          ]
                        : dateFilter
                    }
                    ranges={{
                      Today: [moment(), moment()],
                      Week: [moment().startOf("week"), moment().endOf("week")],
                      "This Month": [
                        moment().startOf("month"),
                        moment().endOf("month"),
                      ],
                      "This Year": [
                        moment().startOf("year"),
                        moment().endOf("year"),
                      ],
                    }}
                    onChange={dateFiltervalue}
                  />
                ) : (
                  isShowDateDashboard &&
                  currentUserRole?.type === RoleType.SUPER_ADMIN && (
                    <Button
                      className="filter-icon-btn"
                      icon={<CalendarOutlined />}
                      onClick={() => setIsShowDate(true)}
                    ></Button>
                  )
                )}
                {selectShow && (
                  <Select
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder={"Select batch status"}
                    showSearch
                    showArrow
                    size="large"
                    mode="multiple"
                    value={selectedOption}
                    onChange={handleBatchChange}
                    style={{ width: "250px" }}
                    filterOption={(value, option) =>
                      (option?.children?.toString() || "")
                        .toLowerCase()
                        .includes(value.replace("_", " ").toLowerCase().trim())
                    }
                  >
                    {batchStatusOption}
                  </Select>
                )}
                {showBatchSelector && isShowBatch ? (
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    allowClear
                    placeholder={"Select Batch Name"}
                    showSearch
                    showArrow
                    onClear={() =>
                      window.innerWidth <= 991 && setIsShowBatch(false)
                    }
                    size="large"
                    value={selectedBatch}
                    onChange={(value) => {
                      handleBatchName(value);
                      fetchData && fetchData(true);
                    }}
                    filterOption={(value, option) =>
                      (option?.children?.toString() || "")
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
                    style={{ width: "250px" }}
                  >
                    {userBatchState.searchData.data.rows
                      .slice()
                      .sort(GetSortOrder("name", "ASC"))
                      .map((d) => {
                        return <Option value={d.id}>{d.name}</Option>;
                      })}
                  </Select>
                ) : (
                  showBatchSelector && (
                    <Button
                      className="filter-icon-btn"
                      icon={<FilterFilled />}
                      onClick={() => setIsShowBatch(true)}
                    ></Button>
                  )
                )}
              </div>
            )}

            {(showCreateCVBtn || showCreateESBtn || showCreatePISBtn) && (
              <Button
                type="primary"
                onClick={() => setShow(true)}
                icon={<PlusOutlined />}
              >
                <span className="gx-d-none gx-d-sm-inline-block gx-ml-1 gx-mr-1">
                  {`Create ${btnName}`}
                </span>
              </Button>
            )}
            {/* {showReportedCVList && (
              <Button type="primary">View Report List</Button>
            )} */}
          </div>
        </div>

        <div className="card-body faculty-dashboard">
          <TableComponent
            rowClassName={(record) => {
              return className === "cvList"
                ? "dueListRow"
                : className === "ptmList"
                ? "ptmListRow"
                : CardTitle === Dashboard_Card_Type.CONTINUOUSLY_ABSENT &&
                  record &&
                  record?.is_15day_remark === true
                ? "absent-remark"
                : " ";
            }}
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            meta={meta}
            setSorter={setSorter}
            lastElementRef={lastElementRef}
          />
        </div>
      </Card>
      <Row>
        <Col span={24}>
          <>
            <div className="filter" style={{ height: "auto" }}>
              <Drawer
                width="1000"
                visible={show}
                onClose={() => {
                  setShow(false);
                  form.resetFields();
                }}
              ></Drawer>
            </div>
            <div className="filter" style={{ height: "auto" }}>
              <DrawerComponent
                title={`Create ${drawerName}`}
                onClose={() => {
                  setShow(false);
                  form.resetFields();
                }}
                visible={show}
                className="cv-details"
                footer={true}
                label={"Submit"}
              >
                {showCreateESBtn ? (
                  <ReportExpertSessionField
                    isDrawer={true}
                    form={form}
                    setShow={(value) => setShow(value)}
                    isEdit={false}
                  />
                ) : showCreateCVBtn ? (
                  <CompanyVisitField
                    isDrawer={true}
                    form={form}
                    setShow={(value) => setShow(value)}
                    isEdit={false}
                  />
                ) : (
                  <ReportInterviewSessionField
                    isDrawer={true}
                    form={form}
                    setShow={(value) => setShow(value)}
                    isEdit={false}
                  />
                )}
              </DrawerComponent>
            </div>
          </>
        </Col>
      </Row>
    </>
  );
};

export default DashboardTable;
