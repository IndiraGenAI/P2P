import { Select, Col, Row, SliderSingleProps, Form, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { IUserData } from "src/services/user/user.model";
import { useAppSelector } from "src/state/app.hooks";
import { AppDispatch } from "src/state/app.model";
import { searchBranchData } from "src/state/branch/branch.action";
import { branchSelector } from "src/state/branch/branch.reducer";
import { searchUserData } from "src/state/users/user.action";
import { userSelector } from "src/state/users/user.reducer";
import { searchZoneData } from "src/state/zone/zone.action";
import { zoneSelector } from "src/state/zone/zone.reducer";
import { ZoneType } from "src/utils/constants/constant";
import { facultyDataByBranchId } from "src/utils/helperFunction";
import {
  FilterStateAndMethod,
  INewFilterStateData,
} from "./AnalysisFilter.model";
import RangeInputWithToggle from "../RangeInputWithToggle";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useWatch } from "antd/lib/form/Form";
import { IZoneDetails } from "src/services/zone/zone.model";

const { Option } = Select;

const trimObject = (obj: any) => {
  const trimmedObj: any = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      trimmedObj[key] = obj[key].trim();
    } else {
      trimmedObj[key] = obj[key];
    }
  }
  return trimmedObj;
};

const AnalysisFilter = (props: FilterStateAndMethod) => {
  const {
    analysisSelectedRange,
    setAnalysisSelectedRange,
    step,
    filterState,
    setFilterState,
    formValues,
  } = props;

  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { userData } = useAppSelector(userSelector);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [onlineBranchId, setOnlineBranchId] = useState<number | null>(null);
  const [isOnlineFilter, setIsOnlineFilter] = useState<boolean>(false);
  const [isOfflineFilter, setIsOfflineFilter] = useState<boolean>(false);
  const [isBranchOnline, setIsBranchOnline] = useState(false);

  const marks: SliderSingleProps["marks"] = {
    0: { label: <strong>0</strong> },
    80: { label: <strong>80</strong> },
    100: {
      label: <strong>100</strong>,
    },
  };

  const branchState = useAppSelector(branchSelector);
  const userState = useAppSelector(userSelector);
  const zoneState = useAppSelector(zoneSelector);
  const selectedZoneIds = useWatch("zone_id", form);
  const selectedBranchIds = useWatch("branch_id", form);

  const storageID: string | null = localStorage.getItem("myStorageID");
  const currentUserZone = userData.data.user_roles.find(
    (role) => role.id === Number(storageID)
  )?.zone;

 useEffect(() => {
    if (branchState.branchesData.data.rows.length > 0) {
      if (
        branchState.branchesData.data.rows.length === 1 &&
        branchState.branchesData.data.rows[0].is_online === true
      ) {
        setIsBranchOnline(false);
        return;
      }
      const isOnline = branchState.branchesData.data.rows.some(
        (branch) => branch.is_online === true
      );
      setIsBranchOnline(isOnline);
    }
  }, [branchState.branchesData.data.rows, currentUserZone]);

  const handleOnlineFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("skip");

    if (!isOnlineFilter && onlineBranchId) {
      params.set("online_branch_id", String(onlineBranchId));
      params.delete("is_offline");
    } else {
      params.delete("online_branch_id");
    }

    setSearchParams(params);
    setIsOnlineFilter(!isOnlineFilter);
    setIsOfflineFilter(false);
  };

  const handleOfflineFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("skip");

    if (!isOfflineFilter) {
      params.set("is_offline", "true");
      params.delete("online_branch_id");
    } else {
      params.delete("is_offline");
    }

    setSearchParams(params);
    setIsOfflineFilter(!isOfflineFilter);
    setIsOnlineFilter(false);
  };

  useEffect(() => {
    if (branchState?.branchesData?.data?.rows) {
      const onlineBranch = branchState.branchesData.data.rows.find(
        (branch) => branch.is_online === true
      );
      if (onlineBranch) {
        setOnlineBranchId(onlineBranch.id);
      }
    }
  }, [branchState?.branchesData?.data?.rows]);


  useEffect(() => {
    if (searchParams.get("online_branch_id")) {
      setIsOnlineFilter(true);
    } else {
      setIsOnlineFilter(false);
    }

    if (searchParams.get("is_offline")) {
      setIsOfflineFilter(true);
    } else {
      setIsOfflineFilter(false);
    }

    if (searchParams.get("online_branch_id") && searchParams.get("is_offline")) {
      const params = new URLSearchParams(searchParams);
      params.delete("is_offline");
      setSearchParams(params);
      setIsOfflineFilter(false);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(
      searchZoneData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        type: ZoneType.PUBLIC,
        parent_id: currentUserZone?.id,
      })
    );
    dispatch(
      searchBranchData({
        noLimit: true,
        orderBy: "name",
        order: "ASC",
        isZoneOnly: true,
        isOnline: true
      })
    );
    dispatch(
      searchUserData({ nolimit: true, orderBy: "first_name", order: "ASC" })
    );
  }, []);

  const branchData = useMemo(() => {
    return (
      branchState.branchesData.data.rows
        .filter((branch) =>
          selectedZoneIds?.length > 0
            ? selectedZoneIds.includes(branch.zone?.parent_id[0].id)
            : branch
        ) || []
    );
  }, [branchState.branchesData.data.rows, selectedZoneIds]);

  const facultyDataByZone =
    facultyDataByBranchId(
      branchData
        .filter((branch) =>
          selectedBranchIds?.length > 0
            ? selectedBranchIds?.includes(branch.id)
            : branch
        )
        .map((branch) => branch.id),
      userState.usersData.data,
      branchState.branchesData.data
    ) || [];

  const setQueryParams = (data: INewFilterStateData) => {
    const newData = { ...data };
    let queryString = Object.entries(trimObject(newData))
      ?.filter(([key, values]) => {
        return (
          values !== undefined &&
          values !== "" &&
          (Array.isArray(values)
            ? values.filter((date) => date !== null).length > 0
            : values)
        );
      })
      .map(([key, values]) => key + "=" + encodeURIComponent(values as string))
      .join("&");

    const params = new URLSearchParams(queryString);
    if (isOnlineFilter && onlineBranchId) {
      params.set("online_branch_id", String(onlineBranchId));
      params.delete("is_offline");
    }

    if (isOfflineFilter) {
      params.set("is_offline", "true");
      params.delete("online_branch_id");
    }

    setSearchParams(params);
  };

  const onChangeFilterValue = (value: INewFilterStateData) => {
    if ("start_range" in value || "end_range" in value) return;
    const [[fieldKey, fieldValue]] = Object.entries(value);
    let updatedData = {
      ...filterState,
      [fieldKey]: fieldValue,
    };
    // If zone_id is being updated and is now empty, reset dependent fields
    if (fieldKey === "zone_id" && (!fieldValue || fieldValue.length === 0)) {
      updatedData.branch_id = undefined;
      updatedData.user_id = undefined;
      form.setFieldValue("branch_id", undefined);
      form.setFieldValue("user_id", undefined);
    }
    setFilterState && setFilterState(updatedData);
    setQueryParams(updatedData);
  };

  useEffect(() => {
    const data = {
      ...filterState,
      range: analysisSelectedRange?.some((range: number) => range)
        ? analysisSelectedRange
        : [],
    };
    if (!analysisSelectedRange?.some((range: number) => range > 100)) {
      setFilterState && setFilterState(data);
      setQueryParams(data);
    }
  }, [analysisSelectedRange]);

  const onZoneFilterChange = () => {
    form.setFieldValue("branch_id", undefined);
    form.setFieldValue("user_id", undefined);
  };

  return (
    <>
      <div>
        <Form
          id="myForm"
          className="dash-board-filter"
          form={form}
          onValuesChange={onChangeFilterValue}
          initialValues={{ ...formValues }}
        >
          <Row
            justify={"end"}
            className="gx-justify-content-sm-start gx-justify-content-xl-end gx-justify-content-lg-end gx-justify-content-sm-end"
          >
            {isBranchOnline && (
              <>
                <Col>
                  <Button
                    className="gx-w-30"
                    icon={<SearchOutlined />}
                    onClick={handleOnlineFilter}
                  >
                    {isOnlineFilter ? "Remove Online" : "Search Online"}
                  </Button>
                </Col>
                <Col>
                  <Button
                    className="gx-w-30"
                    icon={<SearchOutlined />}
                    onClick={handleOfflineFilter}
                  >
                    {isOfflineFilter ? "Remove Offline" : "Search Offline"}
                  </Button>
                </Col>
              </>
            )}
            {currentUserZone?.type !== ZoneType.PRIVATE &&
              zoneState.zonesData.data.rows.length > 0 && (
                <Col xs={12} sm={8} md={5} lg={5} xl={5} className="gx-pr-1">
                  <Form.Item name="zone_id">
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      allowClear
                      placeholder={"Select Zone"}
                      showSearch
                      style={{ width: "100%", textAlign: "left" }}
                      showArrow
                      mode="multiple"
                      size="large"
                      filterOption={(value, option) =>
                        (option?.children?.toString() || "")
                          .toLowerCase()
                          .includes(value.toLowerCase().trim())
                      }
                      onChange={() => onZoneFilterChange()}
                    >
                      {zoneState.zonesData.data.rows
                        .filter(
                          (zone: IZoneDetails) =>
                            zone?.id === currentUserZone?.id ||
                            zone?.parent_id === currentUserZone?.id
                        )
                        .filter((zoneDetails) => zoneDetails.status === true)
                        .map((zoneDetails) => (
                          <Option value={zoneDetails.id}>
                            {zoneDetails.code + "-" + zoneDetails.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            {currentUserZone?.type !== ZoneType.PRIVATE && (
              <Col
                xs={zoneState.zonesData.data.rows.length > 0 ? 12 : 24}
                sm={8}
                md={zoneState.zonesData.data.rows.length > 0 ? 5 : 7}
                lg={zoneState.zonesData.data.rows.length > 0 ? 5 : 7}
                xl={5}
                className="gx-pr-sm-1"
              >
                <Form.Item name="branch_id">
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    allowClear
                    className="dash_input"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      marginBottom: "10px",
                    }}
                    placeholder={"Select Branch"}
                    showSearch
                    showArrow
                    mode="multiple"
                    size="large"
                    filterOption={(value, option) =>
                      (option?.children?.toString() || "")
                        .toLowerCase()
                        .includes(value.toLowerCase().trim())
                    }
                    onChange={() => {
                      form.setFieldValue("user_id", undefined);
                    }}
                  >
                    {branchData
                      .filter((branch) => branch.status === true)
                      .map((branch) => (
                        <Option value={branch.id}>{branch.code}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
            <Col
              xs={24}
              sm={8}
              md={zoneState.zonesData.data.rows.length > 0 ? 5 : 7}
              lg={zoneState.zonesData.data.rows.length > 0 ? 5 : 7}
              xl={5}
              className="gx-pr-lg-1"
            >
              <Form.Item name="user_id">
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  allowClear
                  className="dash_input"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                  }}
                  placeholder={"Select Faculty"}
                  showSearch
                  showArrow
                  size="large"
                  filterOption={(value, option) =>
                    (option?.children?.toString() || "")
                      .toLowerCase()
                      .includes(value.toLowerCase().trim())
                  }
                >
                  {facultyDataByZone.length > 0 &&
                    facultyDataByZone.map((facultyDetails: IUserData) => {
                      return (
                        <Option value={facultyDetails?.id?.toString()}>
                          {`${facultyDetails?.first_name}  ${facultyDetails?.last_name}`}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Col>
            <Col
              xs={14}
              sm={16}
              md={zoneState.zonesData.data.rows.length > 0 ? 9 : 14}
              lg={zoneState.zonesData.data.rows.length > 0 ? 9 : 14}
              xl={9}
            >
              <RangeInputWithToggle
                selectedRange={analysisSelectedRange}
                setSelectedRange={setAnalysisSelectedRange}
                marks={marks}
                step={step}
                form={form}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default AnalysisFilter;