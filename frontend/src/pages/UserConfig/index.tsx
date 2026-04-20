import {
  Button,
  Card,
  Col,
  Form,
  message,
  Radio,
  Row,
  Select,
  Skeleton,
} from "antd";
import ContainerHeader from "src/components/ContainerHeader";
import {
  IConfigUserData,
  IConfigData,
  ICourseData,
  IDepartmentData,
  ISelectCourse,
  ISelectDepartment,
  IUserConfifRecord,
  IUserConfigData,
} from "./UserConfig.model";
import { SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getUserDetailsById,
  searchUserData,
  updateUserConfig,
} from "src/state/users/user.action";
import { AppDispatch } from "src/state/app.model";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "src/state/app.hooks";
import { clearRemoveMessage, userSelector } from "src/state/users/user.reducer";
import FloatLabel from "src/components/Form/FloatLabel";
import {
  AvailabilityType,
  RoleType,
  UserStatus,
  ZoneType,
} from "src/utils/constants/constant";
import { searchDepartmentData } from "src/state/department/department.action";
import { searchCourseData } from "src/state/course/course.action";
import {
  IBranch_id,
  IDepartmentDetails,
} from "src/services/departments/departments.model";
import { ICourseDetails } from "src/services/course/course.model";
import {
  IUserConfig,
  IUserRole,
  IUserRoleData,
} from "src/services/user/user.model";
import { departmentSelector } from "src/state/department/department.reducer";
import { courseSelector } from "src/state/course/course.reducer";
import { subcourseSelector } from "src/state/subCourse/subCourse.reducer";
import { ISubCourseDetails } from "src/services/subCourse/subCourse.model";
import { searchSubCourseData } from "src/state/subCourse/subCourse.action";
import { searchSubDepartmentData } from "src/state/subDepartment/subDepartment.action";
import { subdepartmentSelector } from "src/state/subDepartment/subDepartment.reducer";

const UserConfig = () => {
  const rules = {
    user_role_departments: [
      { required: true, message: "Please Enter Sector" },
    ],
    availability_time: [{ required: true, message: "Please Select Time" }],
    user_role_subdepartments: [
      { required: true, message: "Please Enter Sub Department" },
    ],
    user_role_courses: [{ required: true, message: "Please Enter Course" }],
    user_role_subcourses: [
      { required: true, message: "Please Enter SubCourse" },
    ],
  };
  const [form] = Form.useForm();
  const { Option } = Select;
  const [onSelectChange, setOnSelectChange] = useState();
  const [onSelectCourseChange, setOnSelectCourseChange] = useState([]);
  const [onSelectSubCourseChange, setOnSelectSubCourseChange] = useState<
    number[]
  >([]);
  const [availabilityValue, setAvailabilityValue] = useState<IUserConfigData[]>(
    []
  );
  const [onSelectUserChange, setOnSelectUserChange] = useState([]);
  const [initData, setInitData] = useState<IUserConfigData[]>();
  const [loading, setLoading] = useState(true);
  const [buffer, setBuffer] = useState(false);
  const [btn, setBtn] = useState<boolean>(true);
  const [userData, setUserData] = useState<IUserConfifRecord>();
  const [selectedDepartment, setSelectedDepartment] = useState<
    IDepartmentDetails[] | undefined
  >();
  const [selectCourse, setSelectCourse] = useState<ICourseDetails[]>([]);
  const [selectSubCourse, setSelectSubCourse] = useState<ISubCourseDetails[]>(
    []
  );
  const [selectUser, setSelectUser] = useState<IUserRole[]>([]);
  const userState = useAppSelector(userSelector);
  const departmentState = useAppSelector(departmentSelector);
  const courseState = useAppSelector(courseSelector);
  const subCourseState = useAppSelector(subcourseSelector);
  const subDepartmentState = useAppSelector(subdepartmentSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  let course: ISelectCourse[] = [];
  let department: ISelectDepartment[] = [];
  let user: ISelectDepartment[] = [];
  useEffect(() => {
    if (Number(id)) {
      dispatch(getUserDetailsById(Number(id))).then((res) => {
        if (res) {
          setLoading(false);
        }
      });
    }
  }, [id]);

  useEffect(() => {
    dispatch(searchDepartmentData({ noLimit: true }));
    dispatch(
      searchUserData({
        noLimit: true,
        orderBy: "first_name",
        order: "ASC",
      })
    );
    dispatch(searchCourseData({ noLimit: true }));
    dispatch(
      searchSubDepartmentData({ noLimit: true, orderBy: "name", order: "ASC" })
    );
    dispatch(searchSubCourseData({ noLimit: true }));
  }, []);

  useEffect(() => {
    if (userState.updateUserConfig.message) {
      if (userState.updateUserConfig.hasErrors) {
        message.error(userState.updateUserConfig.message);
      } else {
        message.success(userState.updateUserConfig.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [userState.updateUserConfig.message]);

  useEffect(() => {
    if (departmentState.departmentsData.data) {
      setSelectedDepartment(departmentState.departmentsData.data.rows);
    }
  }, [departmentState.departmentsData.data]);

  useEffect(() => {
    if (courseState.coursesData.data) {
      setSelectCourse(courseState.coursesData.data.rows);
    }
  }, [courseState.coursesData.data]);

  useEffect(() => {
    if (subCourseState.searchData.data) {
      setSelectSubCourse(subCourseState.searchData.data.rows);
    }
  }, [subCourseState.searchData.data]);

  useEffect(() => {
    if (userState.getUserDetailsById.data) {
      setUserData(
        userState.getUserDetailsById.data as unknown as IUserConfifRecord
      );
      setSelectUser(userState.getUserDetailsById.data.user_roles);
    }
  }, [userState.getUserDetailsById.data]);

  const handleSelectChange = (value: {
    map: (arg0: (y: ISelectDepartment) => void) => SetStateAction<undefined>;
  }) => {
    setOnSelectChange(
      value.map((y: ISelectDepartment) => {
        departmentState?.departmentsData?.data?.rows?.map(
          (x: ISelectDepartment) => {
            if (x.id === Number(y)) {
              department.push({ id: x.id, name: x.name });
            }
          }
        );
      })
    );
  };

  const handleSelectCourseChange = (value: {
    map: (arg0: (y: number[]) => void) => SetStateAction<never[]>;
  }) => {
    const courseData = value.map((y: number[]) => {
      selectCourse &&
        selectCourse.map((x: ISelectCourse) => {
          if (x.id === Number(y)) {
            course.push({ id: x.id, name: x.name });
          }
        });
    });
    setOnSelectCourseChange(courseData as []);
  };

  const handleSelectSubCourseChange = (value: number[]) => {
    setOnSelectSubCourseChange(value);
  };

  const handleSelectUserChange = (value: {
    map: (arg0: (y: number) => void) => SetStateAction<never[]>;
  }) => {
    const userData =
      selectUser &&
      selectUser.map((x: ISelectCourse) => {
        if (x.id === Number(value)) {
          user.push({ id: x.id, name: x.name });
        }
      });
    setOnSelectUserChange(userData as []);
  };

  const onFinish = (value: IConfigData) => {
    setBuffer(true);
    let user_roles_department: ISelectDepartment[] = [];
    let user_roles_course: ISelectCourse[] = [];
    if (value) {
      if (userData?.user_roles) {
        for (let data of userData?.user_roles) {
          for (let payloadData of value.user_config) {
            if (payloadData.id === data.id) {
              for (let departmentId of payloadData.user_role_departments) {
                const findObj = data.user_role_departments.find(
                  (departmentDetails: ISelectDepartment) =>
                    departmentDetails.department &&
                    departmentDetails.department.id === departmentId
                );

                if (!!findObj && findObj.department) {
                  user_roles_department.push({
                    id: findObj.id,
                    department_id: findObj.department.id as number,
                    subdepartment_ids: JSON.stringify(
                      payloadData?.user_role_subdepartments.filter((id) =>
                        subDepartmentState.searchData.data.rows
                          .filter(
                            (subDepart) =>
                              subDepart.department_id ==
                              Number(findObj?.department?.id as number)
                          )
                          .map((id) => id.id)
                          .includes(id)
                      )
                    ),
                  });
                } else {
                  user_roles_department.push({
                    id: null,
                    department_id: departmentId as unknown as number,
                    subdepartment_ids: JSON.stringify(
                      subDepartmentState.searchData.data.rows
                        .filter(
                          (subDepart) =>
                            subDepart.id &&
                            payloadData?.user_role_subdepartments &&
                            payloadData.user_role_subdepartments.includes(
                              subDepart.id
                            )
                        )
                        .filter(
                          (subCourseDetails) =>
                            subCourseDetails.department_id === departmentId
                        )
                        .map((subCourseDetails) => subCourseDetails.id)
                    ),
                  });
                }
              }
              if (
                user_roles_department.length > 0 &&
                payloadData.id === data.id &&
                !!payloadData?.user_role_departments
              ) {
                payloadData.user_role_departments = user_roles_department;
                user_roles_department = [];
              }

              for (let courseId of payloadData.user_role_courses) {
                const filterData = data.user_role_courses.filter(
                  (courseDetails: ISelectCourse) =>
                    courseDetails.course && courseDetails.course.id === courseId
                );

                const selectedSubCourse = selectSubCourse.filter(
                  (subCourseDetails: ISubCourseDetails) =>
                    subCourseDetails.course_id === courseId &&
                    payloadData.user_role_subcourses?.includes(
                      subCourseDetails.id
                    )
                );

                let subcourseAdded = false;

                for (let subcourseId of payloadData.user_role_subcourses as number[]) {
                  const findObj = filterData.find((data) =>
                    data.subcourse_id
                      ? data.subcourse_id === subcourseId
                      : false
                  );

                  const findSubCourseData = selectedSubCourse.filter(
                    (subCourseDetails) => subCourseDetails.id === subcourseId
                  );

                  if (findObj && findObj.course) {
                    if (findSubCourseData.length > 0) {
                      findSubCourseData.forEach((subCourse) => {
                        user_roles_course.push({
                          id:
                            initData &&
                              initData
                                .find(
                                  (userData: IUserConfigData) =>
                                    userData?.id === payloadData?.id
                                )
                                ?.user_role_subcourses?.includes(subCourse?.id)
                              ? findObj.id
                              : null,
                          course_id: findObj?.course?.id as number,
                          subcourse_id: subCourse.id,
                        });
                      });
                      subcourseAdded = true;
                    } else {
                      user_roles_course.push({
                        id: findObj.id,
                        course_id: findObj?.course?.id as number,
                        subcourse_id: undefined,
                      });
                      subcourseAdded = true;
                    }
                  } else if (findSubCourseData.length > 0) {
                    findSubCourseData.forEach((subcourse) => {
                      user_roles_course.push({
                        id: null,
                        course_id: courseId as number,
                        subcourse_id: subcourse.id,
                      });
                    });
                    subcourseAdded = true;
                  }
                }

                if (!subcourseAdded) {
                  user_roles_course.push({
                    id: null,
                    course_id: courseId as number,
                    subcourse_id: undefined,
                  });
                }
              }
              if (
                user_roles_course.length > 0 &&
                payloadData.id === data.id &&
                !!payloadData?.user_role_courses
              ) {
                payloadData.user_role_courses = user_roles_course;
                user_roles_course = [];
              }
            }
          }
        }
      }
      const result = { user_config: value.user_config, id };
      if (result) {
        dispatch(updateUserConfig(result as unknown as IUserConfig)).then(
          (res: any) => {
            if (res?.payload?.data) {
              navigate(-1);
              setLoading(false);
              setBtn(true);
              dispatch(getUserDetailsById(Number(id)));
            }
          }
        );
      }
    }
  };

  const valueChange = (value: IConfigData, a: IConfigData) => {
    if (value) {
      setBtn(false);
    }
    setAvailabilityValue(a["user_config"]);
    if (value.hasOwnProperty("user_config")) {
      const key = value["user_config"].findIndex((x) => x);
      const data = value["user_config"][key];

      if (
        data.user_role_departments &&
        !(JSON.stringify(a["user_config"][key]) === JSON.stringify(data))
      ) {
        const currentDepartments = data.user_role_departments;
        const currentSubDepartments =
          a["user_config"][key].user_role_subdepartments;
        const currentCourses = a["user_config"][key]
          .user_role_courses as number[];
        const currentSubCourses = a["user_config"][key].user_role_subcourses;
        const resultSubDepartments: number[] = [];
        const resultCourses: number[] = [];
        const resultSubCourses: number[] = [];
        currentDepartments.forEach((departmentId) => {
          const matchingDepartment = selectedDepartment?.find(
            (d) => d.id === departmentId
          );
          if (matchingDepartment) {
            matchingDepartment?.subdepartments?.forEach((subdepartment) => {
              if (currentSubDepartments?.includes(subdepartment.id)) {
                resultSubDepartments.push(subdepartment.id);
                subdepartment.courses?.forEach((course) => {
                  if (currentCourses?.includes(course.id)) {
                    resultCourses.push(course.id);
                  }
                  course.subcourses?.forEach((subcourse) => {
                    if (currentSubCourses?.includes(subcourse.id)) {
                      resultSubCourses.push(subcourse.id);
                    }
                  });
                });
              }
            });
          }
        });

        form.setFieldValue(
          ["user_config", +key, "user_role_subdepartments"],
          resultSubDepartments
        );
        form.setFieldValue(
          ["user_config", +key, "user_role_courses"],
          resultCourses
        );
        form.setFieldValue(
          ["user_config", +key, "user_role_subcourses"],
          resultSubCourses
        );
      }

      if (
        data.user_role_subdepartments &&
        !(JSON.stringify(a["user_config"][key]) === JSON.stringify(data))
      ) {
        const currentDepartments = a["user_config"][key].user_role_departments;
        const currentSubDepartments = data.user_role_subdepartments;
        const currentCourses = a["user_config"][key]
          .user_role_courses as number[];
        const currentSubCourses = a["user_config"][key].user_role_subcourses;
        const resultCourses: number[] = [];
        const resultSubCourses: number[] = [];
        currentDepartments.forEach((departmentId) => {
          const matchingDepartment = selectedDepartment?.find(
            (d) => d.id === departmentId
          );
          if (matchingDepartment) {
            matchingDepartment?.subdepartments?.forEach((subdepartment) => {
              if (currentSubDepartments?.includes(subdepartment.id)) {
                subdepartment.courses?.forEach((course) => {
                  if (currentCourses?.includes(course.id)) {
                    resultCourses.push(course.id);
                  }
                  course.subcourses?.forEach((subcourse) => {
                    if (currentSubCourses?.includes(subcourse.id)) {
                      resultSubCourses.push(subcourse.id);
                    }
                  });
                });
              }
            });
          }
        });

        form.setFieldValue(
          ["user_config", +key, "user_role_courses"],
          resultCourses
        );
        form.setFieldValue(
          ["user_config", +key, "user_role_subcourses"],
          resultSubCourses
        );
      }

      if (
        data.user_role_courses &&
        !(JSON.stringify(a["user_config"][key]) === JSON.stringify(data))
      ) {
        const currentCourses = data.user_role_courses;
        const currentSubCourses = a["user_config"][key].user_role_subcourses;
        const result: number[] = [];
        currentCourses.forEach((courseId) => {
          const matchingCourse = selectCourse.find((c) => c.id === courseId);

          if (matchingCourse) {
            matchingCourse?.subcourses?.forEach((subcourse) => {
              if (currentSubCourses?.includes(subcourse.id)) {
                result.push(subcourse.id);
              }
            });
          }
        });
        form.setFieldValue(
          ["user_config", +key, "user_role_subcourses"],
          result
        );
      }
    }
  };

  useEffect(() => {
    if (!loading) {
      const mainData = userData?.user_roles.map((role: IConfigUserData) => {
        const depart: number[] = [];
        const subDepartments: number[] = [];
        const course: number[] = [];
        const subcourses: number[] = [];
        role.user_role_departments.map((departData: IDepartmentData) => {
          if (departData.department) {
            depart.push(departData.department.id as number);
          }
        });

        role?.user_role_departments &&
          role?.user_role_departments?.map(
            (subdepartmentData: IDepartmentData) => {
              if (
                subdepartmentData?.sub_department_ids &&
                JSON.parse(subdepartmentData.sub_department_ids as string)
                  .length > 0
              ) {
                subDepartments.push(
                  ...(JSON.parse(
                    subdepartmentData.sub_department_ids as string
                  ) as number[])
                );
              }
            }
          );

        role.user_role_courses &&
          role.user_role_courses?.map((coursData: ICourseData) => {
            if (
              coursData.course &&
              !course?.includes(coursData?.course?.id || 0)
            ) {
              course.push(coursData.course.id as number);
            }
          });

        role.user_role_courses &&
          role.user_role_courses?.map((coursData: ICourseData) => {
            if (coursData.subcourse_id) {
              subcourses.push(coursData.subcourse_id as number);
            }
          });

        const data = {
          id: role.id,
          availability: role.availability
            ? role.availability
            : AvailabilityType.FULL_TIME,
          reporting_user_id: role.reporting_user_id
            ? role.reporting_user_id
            : undefined,
          user_role_departments: depart ? depart : undefined,
          user_role_subdepartments: subDepartments ? subDepartments : undefined,
          user_role_courses: course ? course : undefined,
          user_role_subcourses: subcourses ? subcourses : undefined,
          availability_time: role.availability_time
            ? JSON.parse(role.availability_time)
            : undefined,
        };
        if (
          data.availability == AvailabilityType.FULL_TIME &&
          data.availability_time == undefined
        ) {
          const timeArray = generateTimeArray();
          data.availability_time = timeArray.map((time) => time.value);
        }
        return data;
      });
      if (mainData) {
        setInitData(mainData as IUserConfigData[] | undefined);
        setAvailabilityValue(mainData as IUserConfigData[]);
      }
    }
  }, [loading, userData]);

  useEffect(() => {
    if (initData) {
      form.resetFields();
    }
  }, [initData]);

  const userZoneRoleShow = (key: number) => {
    const name =
      userData?.user_roles[key]?.zone?.type === ZoneType.PUBLIC
        ? userData?.user_roles[key]?.zone?.name
        : userData?.user_roles[key]?.zone?.branches[0]?.code +
        "" +
        ` (${userData?.user_roles[key]?.role?.type})`;

    return name;
  };

  const userZoneRoleFacultyHeadType = (key: number) => {
    const type =
      (userData?.user_roles[key]?.role?.type === RoleType.FACULTY_HEAD ||
        userData?.user_roles[key]?.role?.type === RoleType.FACULTY) &&
      userData?.user_roles[key]?.zone?.type === ZoneType.PRIVATE;
    return type;
  };
  const userZoneRoleFacultyType = (key: number) => {
    const type =
      userData?.user_roles[key]?.role?.type === RoleType.FACULTY &&
      userData?.user_roles[key]?.zone?.type === ZoneType.PRIVATE;
    return type;
  };
  const reportingUserData = (key: number) => {
    const allData = userState.getUserDetailsById.data.user_roles
      .map((userRoleData: IUserRole) => {
        if (userRoleData.id === userData?.user_roles[key]?.id) {
          const shownUserIds: number[] = [];
          const sortedOptions = userRoleData?.zoneWiseUser
            ?.filter((useData: IUserRoleData) => {
              const userId = useData?.user?.id;
              if (!shownUserIds.includes(userId)) {
                shownUserIds.push(userId);
                return true;
              }
              return false;
            })
            ?.sort((a: IUserRoleData, b: IUserRoleData) =>
              a?.user?.first_name.localeCompare(b?.user?.first_name)
            );
          return sortedOptions;
        }
      })
      ?.filter((v) => v)[0];
    return allData;
  };

  const selectedReportingUser = (key: number) => {
    const nameArray = selectUser?.map((userRoleData: IUserRole) => {
      if (userRoleData.id === userData?.user_roles[key]?.id) {
        const name = userRoleData.zoneWiseUser?.map((useData: IUserRoleData) =>
          form?.getFieldValue("user_config")?.map(
            (
              y: {
                reporting_user_id: number;
              },
              index: number
            ) => {
              if (useData?.user.id === y?.reporting_user_id && index === key) {
                return `${useData?.user?.first_name}${" "}${useData?.user?.last_name
                  } - (${useData?.role?.name})`;
              }
            }
          )
        );
        return name;
      }
    });
    const flattenedArray = nameArray?.flat(2);
    const fullName = flattenedArray?.find((name) => name !== undefined);
    return fullName;
  };

  const generateTimeArray = () => {
    const startTime = 7; // 7 AM
    const endTime = 19; // 7 PM
    const timeArray = [];

    for (let i = startTime; i <= endTime; i++) {
      const formattedTime = i <= 12 ? `${i}:00 AM` : `${i % 12}:00 PM`;
      timeArray.push({ label: formattedTime, value: i });
    }

    return timeArray;
  };

  const timeData = generateTimeArray();

  return (
    <>
      <Skeleton loading={buffer} active avatar>
        {initData && initData?.length > 0 && !loading && (
          <div className="rnw-main-content">
            <Row
              align="middle"
              justify="space-between"
              gutter={24}
              className="mb-20"
            >
              <Col xs={18} xxl={12}>
                <h2 className="rnw-page-title gx-d-flex">
                  <ContainerHeader
                    title={
                      "User Config" +
                      " - " +
                      (userState.getUserDetailsById.data.first_name +
                        " " +
                        userState.getUserDetailsById.data.last_name)
                    }
                  />
                </h2>
              </Col>
              <Col
                xs={6}
                xxl={12}
                className="text-align-right gx-mt-2 gx-mt-md-0"
              >
                <Button
                  type="primary"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  <i className="fa fa-arrow-left back-icon"></i>{" "}
                  <span className="gx-d-none gx-d-sm-inline-block">Back</span>
                </Button>
              </Col>
            </Row>
            <Card className="rnw-card table-card gx-mb-0 user-config-table">
              <Form
                id="myForm"
                form={form}
                className="drawer-form"
                name="basic"
                autoComplete="off"
                onValuesChange={valueChange}
                initialValues={{
                  user_config: initData,
                }}
                requiredMark={true}
                onFinish={onFinish}
              >
                <Form.List name="user_config">
                  {(fields) => (
                    <>
                      {fields.map(({ key, name, ...field }) => {
                        const fieldId = form.getFieldValue([
                          "user_config",
                          name,
                          "id",
                        ]);

                        const isShow = availabilityValue.find(
                          (value) => value.id === fieldId
                        )?.availability;
                        return (
                          <>
                            {
                              <div className="user-config-select " key={key}>
                                <Row>
                                  <Col xs={24} md={10} xl={10} lg={10} xxl={4}>
                                    <p>{userZoneRoleShow(key)}</p>
                                  </Col>
                                  <Col
                                    xs={24}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    xxl={6}
                                    className="gx-mb-3 gx-mb-xl-3"
                                  >
                                    <Form.Item name={[name, "availability"]}>
                                      <Radio.Group
                                        size="small"
                                        onChange={(value) => {
                                          form.setFieldValue(
                                            [
                                              "user_config",
                                              name,
                                              "availability_time",
                                            ],
                                            value.target.value ==
                                              AvailabilityType.FULL_TIME
                                              ? timeData.map(
                                                (time) => time.value
                                              )
                                              : []
                                          );
                                        }}
                                      >
                                        <Radio
                                          value={AvailabilityType.FULL_TIME}
                                          checked={true}
                                        >
                                          Full Time
                                        </Radio>
                                        <Radio
                                          value={AvailabilityType.PART_TIME}
                                          checked={false}
                                        >
                                          Part Time
                                        </Radio>
                                        <Radio
                                          value={AvailabilityType.VISITOR}
                                          checked={false}
                                        >
                                          Visitor
                                        </Radio>
                                      </Radio.Group>
                                    </Form.Item>
                                    {isShow && (
                                      <FloatLabel
                                        label="Time"
                                        placeholder="Select Time"
                                        name={[
                                          "user_config",
                                          name,
                                          "availability_time",
                                        ]}
                                        required
                                        key={key}
                                      >
                                        <Form.Item
                                          name={[name, "availability_time"]}
                                          className="gx-mt-3"
                                          rules={rules.availability_time}
                                        >
                                          <Select
                                            getPopupContainer={(trigger) =>
                                              trigger.parentNode
                                            }
                                            mode="multiple"
                                            showArrow
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                              (
                                                option?.children?.toString() ||
                                                ""
                                              )
                                                .toLowerCase()
                                                .includes(
                                                  input.toLowerCase().trim()
                                                )
                                            }
                                          >
                                            <>
                                              {timeData?.map((time) => {
                                                return (
                                                  <Option
                                                    key={time.value}
                                                    value={time.value}
                                                  >
                                                    {time.label}
                                                  </Option>
                                                );
                                              })}
                                            </>
                                          </Select>
                                        </Form.Item>
                                      </FloatLabel>
                                    )}
                                  </Col>

                                  <Col
                                    xs={24}
                                    xl={20}
                                    md={20}
                                    xxl={7}
                                    className="gx-mt-3 gx-mt-md-0 gx-mb-3 gx-mb-xl-0"
                                  >
                                    {userZoneRoleFacultyHeadType(key) && (
                                      <Row>
                                        <Col
                                          xs={24}
                                          md={12}
                                          className="gx-mb-3 gx-mb-xl-3"
                                        >
                                          <FloatLabel
                                            label="Sector"
                                            placeholder="Select Sector"
                                            name={[
                                              "user_config",
                                              name,
                                              "user_role_departments",
                                            ]}
                                            required
                                          >
                                            <Form.Item
                                              name={[
                                                name,
                                                "user_role_departments",
                                              ]}
                                              rules={
                                                rules.user_role_departments
                                              }
                                              {...field}
                                            >
                                              <Select
                                                getPopupContainer={(trigger) =>
                                                  trigger.parentNode
                                                }
                                                mode="multiple"
                                                showArrow
                                                allowClear
                                                showSearch
                                                onChange={handleSelectChange}
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.children?.toString() ||
                                                    ""
                                                  )
                                                    .toLowerCase()
                                                    .includes(
                                                      input.toLowerCase().trim()
                                                    )
                                                }
                                              >
                                                <>
                                                  {selectedDepartment &&
                                                    selectedDepartment
                                                      ?.filter(
                                                        (department) =>
                                                          department.status ===
                                                          true
                                                      )
                                                      .map((item) => {
                                                        return item.branch_departments?.map(
                                                          (
                                                            branch: IBranch_id
                                                          ) => {
                                                            if (
                                                              userData &&
                                                              branch?.branch_id ===
                                                              userData
                                                                .user_roles[
                                                                key
                                                              ].zone
                                                                ?.branches[0]
                                                                ?.id
                                                            ) {
                                                              return (
                                                                <Option
                                                                  key={item?.id}
                                                                  value={
                                                                    item?.id
                                                                  }
                                                                >
                                                                  {item?.name}
                                                                </Option>
                                                              );
                                                            }
                                                          }
                                                        );
                                                      })}
                                                </>
                                              </Select>
                                            </Form.Item>
                                          </FloatLabel>
                                          <Row
                                            className={
                                              selectedDepartment &&
                                                selectedDepartment?.length > 0
                                                ? "department-selected"
                                                : ""
                                            }
                                          >
                                            <>
                                              {selectedDepartment &&
                                                selectedDepartment.map(
                                                  (departmentData) => {
                                                    return form
                                                      .getFieldValue(
                                                        "user_config"
                                                      )
                                                      .map(
                                                        (
                                                          user_config: {
                                                            user_role_departments: number[];
                                                          },
                                                          index: number
                                                        ) => {
                                                          return user_config?.user_role_departments?.map(
                                                            (
                                                              userRoleId: number
                                                            ) => {
                                                              if (
                                                                departmentData.id ===
                                                                userRoleId &&
                                                                index == key
                                                              ) {
                                                                return (
                                                                  <Col
                                                                    xs={24}
                                                                    md={12}
                                                                    lg={12}
                                                                    xl={
                                                                      departmentData
                                                                        .name
                                                                        ?.length >
                                                                        8
                                                                        ? 24
                                                                        : 12
                                                                    }
                                                                    xxl={24}
                                                                  >
                                                                    {
                                                                      departmentData.name
                                                                    }
                                                                  </Col>
                                                                );
                                                              }
                                                            }
                                                          );
                                                        }
                                                      );
                                                  }
                                                )}
                                            </>
                                          </Row>
                                        </Col>

                                        <Col
                                          xs={24}
                                          md={12}
                                          className="gx-mb-3 gx-mb-xl-3"
                                        >
                                          <FloatLabel
                                            label="Sub-Sector"
                                            placeholder="Select Sub-Sector"
                                            name={[
                                              "user_config",
                                              name,
                                              "user_role_subdepartments",
                                            ]}
                                            required
                                          >
                                            <Form.Item
                                              name={[
                                                name,
                                                "user_role_subdepartments",
                                              ]}
                                              rules={
                                                rules.user_role_subdepartments
                                              }
                                              {...field}
                                            >
                                              <Select
                                                getPopupContainer={(trigger) =>
                                                  trigger.parentNode
                                                }
                                                mode="multiple"
                                                showArrow
                                                allowClear
                                                showSearch
                                                onChange={
                                                  handleSelectCourseChange
                                                }
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.children?.toString() ||
                                                    ""
                                                  )
                                                    .toLowerCase()
                                                    .includes(
                                                      input.toLowerCase().trim()
                                                    )
                                                }
                                              >
                                                {form
                                                  .getFieldValue([
                                                    "user_config",
                                                    name,
                                                    "user_role_departments",
                                                  ])
                                                  ?.map(
                                                    (user_depart: number) => {
                                                      return (
                                                        subDepartmentState
                                                          .searchData.data
                                                          .rows &&
                                                        subDepartmentState.searchData.data.rows
                                                          .filter(
                                                            (item) =>
                                                              item.department_id ==
                                                              user_depart
                                                          )
                                                          ?.map((sub) => {
                                                            return (
                                                              <Option
                                                                value={sub?.id}
                                                              >
                                                                {sub?.name}
                                                              </Option>
                                                            );
                                                          })
                                                      );
                                                    }
                                                  )}
                                              </Select>
                                            </Form.Item>
                                          </FloatLabel>
                                          <Row
                                            className={
                                              subDepartmentState.searchData.data
                                                .rows &&
                                                subDepartmentState.searchData.data
                                                  .rows?.length > 0
                                                ? "department-selected"
                                                : ""
                                            }
                                          >
                                            <>
                                              {subDepartmentState.searchData
                                                .data.rows &&
                                                subDepartmentState.searchData.data.rows.map(
                                                  (course) => {
                                                    return form
                                                      .getFieldValue(
                                                        "user_config"
                                                      )
                                                      .map(
                                                        (
                                                          config: {
                                                            user_role_subdepartments: number[];
                                                          },
                                                          index: number
                                                        ) => {
                                                          return (
                                                            config?.user_role_subdepartments &&
                                                            config?.user_role_subdepartments?.map(
                                                              (
                                                                role_subdepartments: number
                                                              ) => {
                                                                if (
                                                                  course.id ===
                                                                  role_subdepartments &&
                                                                  index == key
                                                                ) {
                                                                  return (
                                                                    <Col
                                                                      xs={24}
                                                                      md={12}
                                                                      lg={12}
                                                                      xl={12}
                                                                      xxl={24}
                                                                    >
                                                                      {
                                                                        course.name
                                                                      }
                                                                    </Col>
                                                                  );
                                                                }
                                                              }
                                                            )
                                                          );
                                                        }
                                                      );
                                                  }
                                                )}
                                            </>
                                          </Row>
                                        </Col>
                                      </Row>
                                    )}
                                  </Col>
                                  {userZoneRoleFacultyType(key) && (
                                    <Col
                                      xs={24}
                                      xl={20}
                                      md={20}
                                      xxl={7}
                                      className="gx-mt-3 gx-mt-md-0 gx-mb-3 gx-mb-xl-0 gx-ms-0"
                                    >
                                      <Row>
                                        <Col
                                          xs={24}
                                          md={12}
                                          className="gx-mb-3 gx-mb-xl-3"
                                        >
                                          <FloatLabel
                                            label="Courses"
                                            placeholder="Select Course"
                                            name={[
                                              "user_config",
                                              name,
                                              "user_role_courses",
                                            ]}
                                            required
                                          >
                                            <Form.Item
                                              name={[name, "user_role_courses"]}
                                              rules={rules.user_role_courses}
                                              {...field}
                                            >
                                              <Select
                                                getPopupContainer={(trigger) =>
                                                  trigger.parentNode
                                                }
                                                mode="multiple"
                                                showArrow
                                                allowClear
                                                showSearch
                                                onChange={
                                                  handleSelectCourseChange
                                                }
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.children?.toString() ||
                                                    ""
                                                  )
                                                    .toLowerCase()
                                                    .includes(
                                                      input.toLowerCase().trim()
                                                    )
                                                }
                                              >
                                                {(() => {
                                                  const selectedSubDepartments =
                                                    form.getFieldValue([
                                                      "user_config",
                                                      name,
                                                      "user_role_subdepartments",
                                                    ]) || [];
                                                  const uniqueCourseIds =
                                                    new Set<number>();
                                                  const courseOptions =
                                                    selectedSubDepartments.flatMap(
                                                      (subDepartId: number) =>
                                                        (selectCourse || [])
                                                          .filter(
                                                            (course) =>
                                                              course.subdepartment_id ===
                                                              subDepartId &&
                                                              course.status ===
                                                              true &&
                                                              !uniqueCourseIds.has(
                                                                course.id
                                                              )
                                                          )
                                                          .map((course) => {
                                                            uniqueCourseIds.add(
                                                              course.id
                                                            );
                                                            return (
                                                              <Option
                                                                key={course.id}
                                                                value={
                                                                  course.id
                                                                }
                                                              >
                                                                {course.name}
                                                              </Option>
                                                            );
                                                          })
                                                    );

                                                  return courseOptions.length >
                                                    0
                                                    ? courseOptions
                                                    : null;
                                                })()}
                                              </Select>
                                            </Form.Item>
                                          </FloatLabel>
                                          <Row
                                            className={
                                              selectCourse &&
                                                selectCourse?.length > 0
                                                ? "department-selected"
                                                : ""
                                            }
                                          >
                                            <>
                                              {selectCourse &&
                                                selectCourse.map((course) => {
                                                  return form
                                                    .getFieldValue(
                                                      "user_config"
                                                    )
                                                    .map(
                                                      (
                                                        config: {
                                                          user_role_courses: number[];
                                                        },
                                                        index: number
                                                      ) => {
                                                        return (
                                                          config?.user_role_courses &&
                                                          config?.user_role_courses?.map(
                                                            (
                                                              role_course: number
                                                            ) => {
                                                              if (
                                                                course.id ===
                                                                role_course &&
                                                                index == key &&
                                                                course?.status ===
                                                                true
                                                              ) {
                                                                return (
                                                                  <Col
                                                                    xs={24}
                                                                    md={12}
                                                                    lg={12}
                                                                    xl={12}
                                                                    xxl={24}
                                                                  >
                                                                    {
                                                                      course.name
                                                                    }
                                                                  </Col>
                                                                );
                                                              }
                                                            }
                                                          )
                                                        );
                                                      }
                                                    );
                                                })}
                                            </>
                                          </Row>
                                        </Col>
                                        <Col
                                          xs={24}
                                          md={12}
                                          className="gx-mb-3 gx-mb-xl-3"
                                        >
                                          <FloatLabel
                                            label="Sub Course"
                                            placeholder="Select Sub Course"
                                            name={[
                                              "user_config",
                                              name,
                                              "user_role_subcourses",
                                            ]}
                                            required
                                          >
                                            <Form.Item
                                              name={[
                                                name,
                                                "user_role_subcourses",
                                              ]}
                                              rules={rules.user_role_subcourses}
                                              {...field}
                                            >
                                              <Select
                                                getPopupContainer={(trigger) =>
                                                  trigger.parentNode
                                                }
                                                mode="multiple"
                                                showArrow
                                                allowClear
                                                showSearch
                                                onChange={
                                                  handleSelectSubCourseChange
                                                }
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.children?.toString() ||
                                                    ""
                                                  )
                                                    .toLowerCase()
                                                    .includes(
                                                      input.toLowerCase().trim()
                                                    )
                                                }
                                              >
                                                {form
                                                  .getFieldValue([
                                                    "user_config",
                                                    name,
                                                    "user_role_courses",
                                                  ])
                                                  ?.map(
                                                    (role_course: number) => {
                                                      return (
                                                        selectSubCourse &&
                                                        selectSubCourse
                                                          .filter(
                                                            (subCourse) =>
                                                              subCourse.course_id ==
                                                              role_course &&
                                                              subCourse?.status ===
                                                              true &&
                                                              subCourse?.subcourse_branches &&
                                                              subCourse?.subcourse_branches?.some(
                                                                (branch) =>
                                                                  branch.branch_id ===
                                                                  userData
                                                                    ?.user_roles?.[
                                                                    key
                                                                  ]?.zone
                                                                    ?.branches?.[0]
                                                                    ?.id
                                                              )
                                                          )
                                                          ?.map((sub) => {
                                                            return (
                                                              <Option
                                                                value={sub?.id}
                                                              >
                                                                {sub?.name}
                                                              </Option>
                                                            );
                                                          })
                                                      );
                                                    }
                                                  )}
                                              </Select>
                                            </Form.Item>
                                          </FloatLabel>
                                          <Row
                                            className={
                                              selectSubCourse &&
                                                selectSubCourse?.length > 0
                                                ? "department-selected"
                                                : ""
                                            }
                                          >
                                            <>
                                              {selectSubCourse &&
                                                selectSubCourse.map(
                                                  (sub_course) => {
                                                    return form
                                                      .getFieldValue(
                                                        "user_config"
                                                      )
                                                      .map(
                                                        (
                                                          user_config: {
                                                            user_role_subcourses: number[];
                                                          },
                                                          index: number
                                                        ) => {
                                                          return (
                                                            user_config?.user_role_subcourses &&
                                                            user_config?.user_role_subcourses?.map(
                                                              (
                                                                role_sub_course: number
                                                              ) => {
                                                                if (
                                                                  sub_course.id ===
                                                                  role_sub_course &&
                                                                  index ==
                                                                  key &&
                                                                  sub_course?.status ===
                                                                  true
                                                                ) {
                                                                  return (
                                                                    <Col
                                                                      xs={24}
                                                                      md={12}
                                                                      lg={12}
                                                                      xl={12}
                                                                      xxl={24}
                                                                    >
                                                                      {
                                                                        sub_course.name
                                                                      }
                                                                    </Col>
                                                                  );
                                                                }
                                                              }
                                                            )
                                                          );
                                                        }
                                                      );
                                                  }
                                                )}
                                            </>
                                          </Row>
                                        </Col>
                                        <Col
                                          xs={24}
                                          md={12}
                                          className="gx-mb-3 gx-mb-xl-3"
                                        >
                                          <FloatLabel
                                            label="Reporting User"
                                            placeholder="Reporting Person"
                                            name={[
                                              "user_config",
                                              name,
                                              "reporting_user_id",
                                            ]}
                                          >
                                            <Form.Item
                                              name={[name, "reporting_user_id"]}
                                              {...field}
                                            >
                                              <Select
                                                getPopupContainer={(trigger) =>
                                                  trigger.parentNode
                                                }
                                                showArrow
                                                allowClear
                                                showSearch
                                                onChange={
                                                  handleSelectUserChange
                                                }
                                                filterOption={(input, option) =>
                                                  (
                                                    option?.children?.toString() ||
                                                    ""
                                                  )
                                                    .toLowerCase()
                                                    .includes(
                                                      input.toLowerCase().trim()
                                                    )
                                                }
                                              >
                                                <>
                                                  {reportingUserData(key)?.map(
                                                    (item) => {
                                                      return (
                                                        <Option
                                                          key={item?.user?.id}
                                                          value={item?.user?.id}
                                                          className={`${item?.user
                                                            ?.status ===
                                                            UserStatus.DISABLE
                                                            ? "inactive-status"
                                                            : ""
                                                            }`}
                                                          disabled={
                                                            item?.user
                                                              ?.status ===
                                                            UserStatus.DISABLE
                                                          }
                                                        >
                                                          {
                                                            item?.user
                                                              ?.first_name
                                                          }{" "}
                                                          {
                                                            item?.user
                                                              ?.last_name
                                                          }{" "}
                                                          - {item?.role?.name}
                                                        </Option>
                                                      );
                                                    }
                                                  )}
                                                </>
                                              </Select>
                                            </Form.Item>
                                          </FloatLabel>
                                          <Row
                                            className={
                                              selectedReportingUser(key)
                                                ? "department-selected"
                                                : ""
                                            }
                                          >
                                            <>
                                              <Col
                                                xs={24}
                                                md={12}
                                                lg={12}
                                                xl={12}
                                                xxl={24}
                                              >
                                                {selectedReportingUser(key)}
                                              </Col>
                                            </>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                  )}
                                </Row>
                              </div>
                            }
                          </>
                        );
                      })}
                    </>
                  )}
                </Form.List>

                <Form.Item style={{ width: "100%" }}>
                  <Row className="gx-justify-content-end">
                    <Col xs={12} md={3}>
                      <div className="gx-px-1 gx-px-md-0">
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={btn}
                          className="gx-p-2 gx-m-0 gx-w-100"
                        >
                          Update
                        </Button>
                      </div>
                    </Col>
                    <Col xs={12} md={3}>
                      <div className="gx-px-1 gx-px-md-0">
                        <Button
                          className="btn-cancel gx-p-2  gx-m-0 gx-w-100"
                          onClick={() => {
                            navigate(-1);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Card>
          </div>
        )}
      </Skeleton>
    </>
  );
};

export default UserConfig;
