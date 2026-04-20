import {
  Button,
  Col,
  Row,
  Drawer,
  Select,
  Form,
  DatePicker,
  Slider,
  Radio,
  Typography,
} from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "src/state/app.hooks";
import { branchSelector } from "src/state/branch/branch.reducer";
import { userSelector } from "src/state/users/user.reducer";
import { zoneSelector } from "src/state/zone/zone.reducer";
import { RoleType, UserStatus, ZoneType } from "src/utils/constants/constant";
import {
  IDashboardFilterProps,
  IFilterFormSubmit,
  ISelectCourseData,
} from "./DashboardFilter.model";

import { FilterFilled } from "@ant-design/icons";
import { userBatchSelector } from "src/state/userBatch/userBatch.reducer";
import {
  GetSortOrder,
  facultyDataByBranchId,
  userBranchWiseStatusCheck,
} from "src/utils/helperFunction";
import moment from "moment";
import { getBranchWiseAdmissionData } from "src/state/branch/branch.action";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/state/app.model";
import { IUserData } from "src/services/user/user.model";
import { MasterDahsboardFilterContext } from "src/contexts/MasterDashboardFilterContext";
import { useWatch } from "antd/lib/form/Form";
const { RangePicker } = DatePicker;

const { Option } = Select;
const { Text } = Typography;

function DashboardFilter(props: IDashboardFilterProps) {
  const {
    setZoneFilter,
    CardTitle,
    setBranchFilter,
    selectShow,
    selectedOption,
    handleChange,
    isProjectTypeFilter,
    handleProjectTypeChange,
    projectType,
    projectOption,
    batchStatusOption,
    facultyData,
    facultyFilterShow,
    handleFacultyChange,
    handleBatchName,
    isShowDateFilter,
    showBatchFilter,
    setInstallment_date,
    isBranchFilter,
    isStudentLowPerformanceFilter,
    rangeFilter,
    handleRangeFilter,
    isUserStatusWiseFilter,
    handleUserStatus,
    finalUserData,
    handleSubcourseChange,
    matchedSubdepartments,
    handleSubdepartmentChange,
    handleLinkSubmitted,
    fetchData,
  } = props;
  const dispatch = useDispatch<AppDispatch>();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const branchState = useAppSelector(branchSelector);
  const zoneState = useAppSelector(zoneSelector);
  const { userData } = useAppSelector(userSelector);
  const userState = useAppSelector(userSelector);

  const storageID: string | null = localStorage.getItem("myStorageID");
  const currentUserRole = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.role;
  const currentUserZone = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.zone;

  const [form] = Form.useForm();
  const userBatchState = useAppSelector(userBatchSelector);
  const dateFormat = "DD/MM/YYYY";
  const zoneIds = useWatch("Zone", form);
  const branchIds = useWatch("BranchCode", form);
  const facultyIds = useWatch("FacultyName", form);
  const {
    masterSelectedFaculty,
    masterSelectedDate,
    masterSelectedBranch,
    masterSelectedZone,
  } = useContext(MasterDahsboardFilterContext);


  

  const onReset = () => {
    setZoneFilter && setZoneFilter([]);
    setBranchFilter && setBranchFilter([]);
    handleFacultyChange && handleFacultyChange(0);
    handleBatchName && handleBatchName(0);
    handleChange && handleChange([]);
    handleProjectTypeChange && handleProjectTypeChange("");
    handleLinkSubmitted && handleLinkSubmitted("");
    handleRangeFilter && handleRangeFilter([0, 60]);
    setInstallment_date && setInstallment_date(null);
    handleUserStatus && handleUserStatus("");
    handleSubcourseChange && handleSubcourseChange(0);
    handleSubdepartmentChange && handleSubdepartmentChange(0);
    fetchData && fetchData(true);
    if (isBranchFilter) {
      dispatch(getBranchWiseAdmissionData({}));
    }
  };

  const getFacultyData = (branch_id: number[], zoneData?: number[]) => {
    const branchData =
      branchState.branchesData.data.rows.filter((branch) =>
        zoneData && zoneData.length > 0
          ? zoneData?.includes(branch.zone?.parent_id[0].id)
          : branch_id.includes(branch.id)
      ) || [];

    const facultyData = facultyDataByBranchId(
      branchData.map((branch) => branch.id),
      userState.usersData.data,
      branchState.branchesData.data
    );
    return userBranchWiseStatusCheck(
      branchData.map((branch) => branch.zone_id),
      facultyData,
      RoleType.FACULTY
    );
  };

  const dynamicBranch = useMemo(() => {
    const branchesList = branchState.branchesData.data.rows.filter((branch) =>
      zoneIds?.length ? zoneIds.includes(branch.zone?.parent_id[0].id) : branch
    );
    return branchesList;
  }, [zoneIds, branchState.branchesData]);

  const dynamicFaculty = useMemo(() => {
    const facultyDataByBranch =
      branchIds?.length > 0
        ? branchIds
        : (branchState?.branchesData?.data?.rows || [])
          .filter((branch) =>
            zoneIds?.length
              ? zoneIds.includes(branch.zone?.parent_id?.[0]?.id)
              : true
          )
          .map((branch) => branch.id);

    return getFacultyData(facultyDataByBranch);
  }, [
    branchIds,
    zoneIds,
    branchState?.branchesData?.data?.rows,
    userState?.usersData?.data?.rows,
  ]);

  const dynamicBatch = useMemo(() => {
    const batchDataBranchWise = userBatchState.searchData.data.rows.filter(
      (batch) =>
        branchIds && branchIds.length > 0
          ? branchIds.includes(batch.branch.id)
          : zoneIds && zoneIds.length > 0
            ? zoneIds.includes(batch?.branch.zone?.parent_id)
            : batch
    );
    if (facultyIds) {
      return batchDataBranchWise.filter(
        (batch) => batch.user.id === facultyIds
      );
    } else {
      return batchDataBranchWise;
    }
  }, [branchIds, zoneIds, facultyIds, userBatchState.searchData]);

  const extractedData: { id: number; name: string }[] = [];
  finalUserData?.forEach((item: { subcourseData: ISelectCourseData[] }) => {
    if (item.subcourseData && item.subcourseData.length > 0) {
      item.subcourseData.forEach((subData: ISelectCourseData) => {
        Object.keys(subData)?.forEach((key) => {
          if (Array.isArray(subData[key])) {
            subData[key]?.forEach((obj: { id: number; name: string }) => {
              if (
                obj.id !== undefined &&
                obj.name !== undefined &&
                !extractedData.some(
                  (data) => data.id === obj.id && data.name === obj.name
                )
              ) {
                extractedData.push({ id: obj.id, name: obj.name });
              }
            });
          }
        });
      });
    }
  });

  const zoneData = useMemo(() => {
    return zoneState?.zonesData?.data.rows;
  }, [zoneState]);

  const onFinish = (values: IFilterFormSubmit) => {
    Promise.all([
      setInstallment_date && setInstallment_date(values.installment_date),
      setZoneFilter && setZoneFilter(values.Zone || []),
      setBranchFilter && setBranchFilter(values.BranchCode || []),
      handleFacultyChange && handleFacultyChange(values.FacultyName),
      handleBatchName && handleBatchName(values.BatchName),
      handleChange && handleChange(values.BatchStatus),
      handleProjectTypeChange && handleProjectTypeChange(values.ProjectType),
      handleLinkSubmitted && handleLinkSubmitted(values.is_link_submitted),
      handleRangeFilter && handleRangeFilter(values.range || [0, 60]),
      handleUserStatus && handleUserStatus(values.UserStatus),
      handleSubcourseChange && handleSubcourseChange(values.SubcourseName),
      handleSubdepartmentChange &&
      handleSubdepartmentChange(values.SubdepartmentName),
    ]).then(() => {
      fetchData && fetchData(true);
      setFilterModalOpen(false);
    });
  };
  const handleCancel = () => {
    setFilterModalOpen(false);
  };

  const onChangeValue = (values: IFilterFormSubmit) => {
    if (values.Zone) {
      form.setFieldValue("BranchCode", undefined);
      form.setFieldValue("BatchName", undefined);
      form.setFieldValue("FacultyName", undefined);
    }
    if (values.BranchCode) {
      form.setFieldValue("BatchName", undefined);
      form.setFieldValue("FacultyName", undefined);
    }
    if (values.FacultyName) {
      form.setFieldValue("BatchName", undefined);
    }
  };
  useEffect(() => {
    form.setFieldValue("FacultyName", masterSelectedFaculty);
  }, [masterSelectedFaculty]);

  useEffect(() => {
    form.setFieldValue("installment_date", masterSelectedDate);
    form.setFieldValue("BranchCode", masterSelectedBranch);
    form.setFieldValue("Zone", masterSelectedZone);
  }, [masterSelectedBranch, masterSelectedZone, masterSelectedDate]);
  return (
    <div>
      <Button
        className="filter-icon-btn"
        icon={<FilterFilled />}
        onClick={() => setFilterModalOpen(true)}
      ></Button>
      <Row>
        <Col span={24}>
          <>
            {filterModalOpen && (
              <Drawer
                title={`${CardTitle} Filter`}
                placement="right"
                closable={false}
                onClose={handleCancel}
                visible={filterModalOpen}
                footer={[
                  <div className="gx-d-flex gx-justify-content-center">
                    <Button
                      key="back"
                      className="cancel-filter gx-mr-0"
                      onClick={handleCancel}
                    >
                      <span className="gx-d-none gx-d-sm-block">Cancel</span>
                      <i className="fa fa-close gx-d-sm-none"></i>
                    </Button>
                    <Button
                      className="btn-apply-filter gx-mx-2"
                      key="submit"
                      type="primary"
                      htmlType="submit"
                      form="myForm"
                    >
                      Apply Filter
                    </Button>
                    <Button
                      type="default"
                      className="reset-filter"
                      htmlType="reset"
                      form="myForm"
                    >
                      <span className="gx-d-none gx-d-sm-block">Reset</span>
                      <i className="fa fa-refresh gx-d-sm-none"></i>
                    </Button>
                  </div>,
                ]}
              >
                <>
                  <Form
                    id="myForm"
                    className="dash-board-filter"
                    form={form}
                    onFinish={onFinish}
                    onReset={onReset}
                    onValuesChange={onChangeValue}
                  >
                    <>
                      {currentUserZone?.type !== ZoneType.PRIVATE &&
                        zoneState.zonesData.data.rows.length > 0 && (
                          <Form.Item name="Zone">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              placeholder={"Select Zone"}
                              showSearch
                              showArrow
                              mode="multiple"
                              size="large"
                              // className="gx-mr-2"
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(value.toLowerCase().trim())
                              }
                            >
                              {zoneData
                                .filter(
                                  (zone) =>
                                    zone?.id === currentUserZone?.id ||
                                    zone?.parent_id === currentUserZone?.id
                                )
                                .filter((z) => z.status === true)
                                .map((z) => (
                                  <Option value={z.id}>
                                    {z.code + "-" + z.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        )}

                      {!(currentUserRole?.type === RoleType.FACULTY) &&
                        currentUserZone?.type !== ZoneType.PRIVATE && (
                          <Form.Item name="BranchCode">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              placeholder={"Select Branch"}
                              showSearch
                              showArrow
                              mode="multiple"
                              size="large"
                              // className="gx-mr-2"
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(value.toLowerCase().trim())
                              }
                            >
                              {dynamicBranch &&
                                dynamicBranch
                                  .filter((branch) => branch.status === true)
                                  .map((branch) => (
                                    <Option value={branch.id}>
                                      {branch.code}
                                    </Option>
                                  ))}
                            </Select>
                          </Form.Item>
                        )}
                    </>
                    <>
                      {!(currentUserRole?.type === RoleType.FACULTY) &&
                        facultyData &&
                        facultyFilterShow !== false && (
                          <Form.Item name="FacultyName">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              placeholder={"Select Faculty Name"}
                              showSearch
                              showArrow
                              size="large"
                              // className="gx-mr-2"
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(value.toLowerCase().trim())
                              }
                            >
                              {dynamicFaculty &&
                                dynamicFaculty.map((user: IUserData) => {
                                  return (
                                    <Option
                                      key={user.id}
                                      value={user?.id}
                                      className={
                                        user.status === UserStatus.DISABLE
                                          ? "inactive-status"
                                          : ""
                                      }
                                    >{`${user?.first_name}  ${user?.last_name}`}</Option>
                                  );
                                })}
                            </Select>
                          </Form.Item>
                        )}
                      {isUserStatusWiseFilter && (
                        <>
                          <Form.Item name="UserStatus">
                            <Select
                              size="large"
                              allowClear
                              placeholder={"Select Status"}
                            >
                              <Option value={`${UserStatus.DISABLE}`}>
                                Disable
                              </Option>
                              <Option value={`${UserStatus.ENABLE}`}>
                                Enable
                              </Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name="SubcourseName">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              placeholder={"Select SubCourse"}
                              showSearch
                              showArrow
                              size="large"
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(value.toLowerCase().trim())
                              }
                            >
                              {extractedData &&
                                extractedData.map(
                                  (fd: { id: number; name: string }) => {
                                    return (
                                      <Option value={fd?.id}>{fd?.name}</Option>
                                    );
                                  }
                                )}
                            </Select>
                          </Form.Item>
                          <Form.Item name="SubdepartmentName">
                            <Select
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              allowClear
                              placeholder={"Select Sub-Sector"}
                              showSearch
                              showArrow
                              size="large"
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(value.toLowerCase().trim())
                              }
                            >
                              {matchedSubdepartments &&
                                matchedSubdepartments.map(
                                  (fd: { id: number; name: string }) => {
                                    return (
                                      <Option value={fd?.id}>{fd?.name}</Option>
                                    );
                                  }
                                )}
                            </Select>
                          </Form.Item>
                        </>
                      )}
                      {showBatchFilter !== false && (
                        <Form.Item name="BatchName">
                          <Select
                            allowClear
                            getPopupContainer={(trigger) => trigger.parentNode}
                            placeholder={"Select Batch Name"}
                            showSearch
                            showArrow
                            size="large"
                            filterOption={(value, option) =>
                              (option?.children?.toString() || "")
                                .toLowerCase()
                                .includes(value.toLowerCase().trim())
                            }
                          >
                            {dynamicBatch
                              .slice()
                              .sort(GetSortOrder("name", "ASC"))
                              .map((d) => {
                                return <Option value={d.id}>{d.name}</Option>;
                              })}
                          </Select>
                        </Form.Item>
                      )}
                      {selectShow && (
                        <Form.Item name="BatchStatus">
                          <Select
                            allowClear
                            getPopupContainer={(trigger) => trigger.parentNode}
                            placeholder={"Select batch status"}
                            showSearch
                            showArrow
                            size="large"
                            mode="multiple"
                            value={selectedOption}
                            filterOption={(value, option) =>
                              (option?.children?.toString() || "")
                                .toLowerCase()
                                .includes(
                                  value.replace("_", " ").toLowerCase().trim()
                                )
                            }
                          >
                            {batchStatusOption}
                          </Select>
                        </Form.Item>
                      )}
                      {!(currentUserRole?.type === RoleType.FACULTY) &&
                        isProjectTypeFilter &&
                        projectOption && (
                          <Form.Item name="ProjectType">
                            <Select
                              allowClear
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              placeholder={"Select Type"}
                              showSearch
                              showArrow
                              size="large"
                              // className="gx-mr-2"
                              value={projectType}
                              filterOption={(value, option) =>
                                (option?.children?.toString() || "")
                                  .toLowerCase()
                                  .includes(
                                    value.replace("_", " ").toLowerCase().trim()
                                  )
                              }
                            >
                              {projectOption}
                            </Select>
                          </Form.Item>
                        )}

                      {isShowDateFilter && (
                        <Form.Item name="installment_date">
                          <RangePicker
                            size="large"
                            style={{ width: "100%" }}
                            name="installment_date"
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
                      )}

                      {isProjectTypeFilter && (
                        <Form.Item name="Is Link Submitted">
                          <Text strong style={{ display: "block" }}>
                            Is Link Submitted
                          </Text>
                          <Form.Item name="is_link_submitted">
                            <Radio.Group>
                              <Radio value={true}>Yes</Radio>
                              <Radio value={false}>No</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Form.Item>
                      )}

                      {isStudentLowPerformanceFilter && (
                        <Form.Item
                          name="range"
                          className="gx-mb-0 range"
                          label="Range Filter"
                        >
                          <Slider
                            range
                            style={{ width: "200px" }}
                            marks={rangeFilter}
                            defaultValue={[0, 60]}
                            min={0}
                            max={100}
                          />
                        </Form.Item>
                      )}
                    </>
                  </Form>
                </>{" "}
              </Drawer>
            )}
          </>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardFilter;
