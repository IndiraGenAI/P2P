import React, { useEffect, useState } from "react";
import { searchUserBatchData } from "src/state/userBatch/userBatch.action";
import { useAppSelector } from "src/state/app.hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/state/app.model";
import { searchStudentsListData } from "src/state/studentList/studentList.action";
import { Button, Col, Form, Row, Select, Skeleton, message } from "antd";
import {
  GetSortOrderWithoutLowercase,
  bufferURLDecode,
  calculateTimeDifference,
  generateTimeArray,
} from "src/utils/helperFunction";
import { searchBranchInfrastructureData } from "src/state/BranchInfrastructure/branchInfrastructure.action";
import { LectureType } from "src/utils/constants/constant";
import {
  bulkCreateSlotData,
  bulkUpdateSlotData,
  searchSlotsData,
} from "src/state/slots/slots.action";
import { IStudentDetails } from "src/services/studentList/studentList.model";
import {
  ISearchSlotsData,
  ISlotsPlacesData,
} from "src/services/slots/slots.model";
import { IBranchInfrastructureDetails } from "src/services/BranchInfrastructure/branchInfrastructure.model";
import { IFormInitialValue, slotDetails } from "./AssignLab.model";
import LabDetailsShow from "./Add";
import FloatLabel from "src/components/Form/FloatLabel";
import { ISlotAPICreateEditPayloadData } from "./Add/Add.model";
import { IUserBatchData } from "src/services/userBatch/userBatch.model";
import {
  clearRemoveMessage,
  studentListSelector,
} from "src/state/studentList/studentList.reducer";
const { Option } = Select;

const AssignLab = () => {
  const { batch_id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  let location = useLocation();
  const locationState = location.state;
  const [loading, setLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState<boolean>(false);
  const [count, setCount] = useState<number>(1);
  const [batchInOldSlotRecords, setBatchInOldSlotRecords] = useState<
    slotDetails[]
  >([]);
  const [
    branchInfrastructureWisePlacesData,
    setBranchInfrastructureWisePlacesData,
  ] = useState<ISearchSlotsData[]>();
  const [batchStudentList, setBatchStudentList] = useState<IStudentDetails[]>();
  const [labFormInitialValue, setLabFormInitialValue] =
    useState<IFormInitialValue>();
  const [labBranchInfrastructureData, setLabBranchInfrastructureData] =
    useState<IBranchInfrastructureDetails[]>([]);
  const [currentBatchDetails, setCurrentBatchDetails] =
    useState<IUserBatchData>();
  const [dateForm] = Form.useForm();
  let labStartTime = Form.useWatch("start_time", dateForm);
  let labEndTime = Form.useWatch("end_time", dateForm);
  const studentState = useAppSelector(studentListSelector);

  const rules = {
    start_time: [{ required: true, message: "Please Select Start Time" }],
    end_time: [
      {
        validator: (_: any, value: string) => {
          if (!value) {
            return Promise.reject("Please Select End Time");
          }

          const startTimeFloat = parseFloat(labStartTime);
          const endTimeFloat = parseFloat(value);
          if (startTimeFloat < endTimeFloat) {
            if (endTimeFloat - startTimeFloat < 1) {
              return Promise.reject("The lab time must be at least 1 hour");
            }
          } else if (startTimeFloat >= endTimeFloat) {
            return Promise.reject(
              "Please enter an end time greater than the start time"
            );
          }
          return Promise.resolve();
        },
      },
    ],
  };

  const setSlotStartTimeAndEndTime = async (data: {
    start_time: string;
    end_time: string;
  }) => {
    await dateForm?.setFieldsValue({
      start_time: data?.start_time,
      end_time: data?.end_time,
    });
  };

  useEffect(() => {
    if (currentBatchDetails) {
      if (currentBatchDetails?.batchSlots?.slots?.length) {
        const slots: slotDetails[] | [] =
          currentBatchDetails?.batchSlots?.slots || [];

        const existAllSlots = slots
          ?.map((slot: slotDetails) => ({
            ...slot,
            total_count: slot.hold_count + slot.occupy_count,
          }))
          .sort(
            (slot, nextSlot) =>
              parseFloat(slot.start_time) - parseFloat(nextSlot.start_time)
          );

        const existSlot = existAllSlots[0];
        setBatchInOldSlotRecords(existAllSlots);

        setCount(0);
        if (locationState && !locationState?.labTime) {
          const labStartTime = parseFloat(existSlot.start_time).toFixed(2);
          const labEndTime = parseFloat(existSlot.end_time).toFixed(2);
          dateForm.setFieldValue("start_time", labStartTime);
          dateForm.setFieldValue("end_time", labEndTime);
        } else {
          dateForm.setFieldValue(
            "start_time",
            locationState?.labTime?.start_time
          );
          dateForm.setFieldValue("end_time", locationState?.labTime?.end_time);
        }
      } else if (locationState?.batch_time) {
        const startTime = parseFloat(locationState.batch_time) + 1.0;
        const endTime = (startTime + 1.0).toFixed(2);
        setSlotStartTimeAndEndTime({
          start_time: startTime.toFixed(2),
          end_time: endTime,
        });
        setCount(1);
      }
    }
  }, [locationState, currentBatchDetails]);
  useEffect(() => {
    if (count > 0 && labStartTime) {
      if (labStartTime) {
        let endTime = Number(labStartTime) + 1;
        dateForm.setFieldValue("end_time", endTime.toFixed(2));
        dateForm.setFields([{ name: "end_time", errors: [] }]);
      } else {
        dateForm.setFieldValue("end_time", undefined);
      }
    }
    // eslint-disable-next-line
  }, [labStartTime]);

  useEffect(() => {
    if (studentState.searchData.message) {
      if (studentState.searchData.hasErrors) {
        message.error(studentState.searchData.message);
      }
      dispatch(clearRemoveMessage());
    }
  }, [studentState.searchData.message]);

  useEffect(() => {
    if (batch_id) {
      dispatch(searchUserBatchData({ noLimit: true })).then((res: any) => {
        if (res.payload.data) {
          const currentBatchData = res.payload.data.rows.find(
            (batchData: { id: number }) => batchData.id === Number(batch_id)
          );
          setCurrentBatchDetails(currentBatchData);
        }
      });

      dispatch(searchStudentsListData({ batch_id })).then((res: any) => {
        if (res?.payload) {
          setBatchStudentList(res?.payload?.data?.rows || []);
        }
      });

      dispatch(
        searchBranchInfrastructureData({
          noLimit: true,
          orderBy: "name",
          order: "ASC",
          branch_id: locationState?.branch_id,
        })
      )?.then((res: any) => {
        if (res?.payload) {
          const labInfrastructureData = res?.payload?.data?.rows?.filter(
            (branchInfrastructureDetails: IBranchInfrastructureDetails) =>
              branchInfrastructureDetails?.type === LectureType?.LAB
          );
          setLabBranchInfrastructureData(labInfrastructureData || []);
        }
      });
    }
    setLoading(false);
    // eslint-disable-next-line
  }, [batch_id]);

  const fetchSlotDataBetweenStartTimeAndTime = () => {
    if (batchStudentList) {
      dispatch(
        searchSlotsData({
          noLimit: true,
          orderBy: "name",
          order: "ASC",
          branch_id: locationState?.branch_id,
          start_time: parseFloat(labStartTime),
          end_time: parseFloat(labEndTime),
        })
      )?.then((res: any) => {
        if (res?.payload?.data?.rows) {
          const payloadData = [...res?.payload?.data?.rows];
          const batchStudentIds = batchStudentList?.map(
            (studentDetails: IStudentDetails) => studentDetails?.admission_id
          );

          const formInitialValue = {};
          res?.payload?.data?.rows?.forEach(
            (branchInfra: ISearchSlotsData, index: number) => {
              const allAssignAndUnOccupyPlaces: ISlotsPlacesData[] = [];
              if (branchInfra?.data) {
                branchInfra?.data?.filter((place: ISlotsPlacesData) => {
                  if (place?.slots?.length) {
                    const isExistRecord = batchStudentIds?.some(
                      (id: number) => id == place?.slots[0]?.admission_id
                    );

                    if (isExistRecord) {
                      allAssignAndUnOccupyPlaces?.push(place);
                      const slotsData = place?.slots[0];
                      const studentName = `${
                        slotsData?.admission?.first_name +
                        " " +
                        slotsData?.admission?.middle_name +
                        " " +
                        slotsData?.admission?.last_name
                      }`;
                      Object.assign(formInitialValue, {
                        [`admission_id_${slotsData?.place_id}`]:
                          `${slotsData?.admission?.gr_id}-${studentName}`.toUpperCase(),
                      });
                    } else {
                      if (place?.slots[0]?.admission === null) {
                        allAssignAndUnOccupyPlaces?.push(place);
                      }
                    }
                  } else {
                    allAssignAndUnOccupyPlaces?.push(place);
                  }
                });
                payloadData[index].data = [...allAssignAndUnOccupyPlaces].sort(
                  GetSortOrderWithoutLowercase("id", "ASC")
                );
              }
            }
          );
          Object.assign(formInitialValue);
          setLabFormInitialValue(formInitialValue);
          setBranchInfrastructureWisePlacesData(payloadData);
        }
      });
    }
    setCount(1);
  };
  useEffect(() => {
    // fetch slot data when change slot time
    if (labStartTime && labEndTime && batchStudentList) {
      setLabFormInitialValue(undefined);
      fetchSlotDataBetweenStartTimeAndTime();
    }
    // eslint-disable-next-line
  }, [labEndTime, batchStudentList]);

  const onFinishSlotAssignForm = async (
    data: ISlotAPICreateEditPayloadData
  ) => {
    const { createPayload, updatePayload } = data;
    setDisable(true);
    let responseSuccessfully = true;
    const actionsToDispatch = [];

    if (createPayload.length > 0) {
      actionsToDispatch.push(
        dispatch(bulkCreateSlotData({ slots: createPayload }))
      );
    }

    if (updatePayload.length > 0) {
      actionsToDispatch.push(
        dispatch(bulkUpdateSlotData({ slots: updatePayload }))
      );
    }

    await Promise.all([...actionsToDispatch])?.then((res: any) => {
      res.forEach((result: any) => {
        const payload = result?.payload;
        const error = result?.error;
        const messageText = payload ? payload.message : error?.message;
        if (!payload) {
          responseSuccessfully = false;
          message.error(messageText);
        }
      });
    });

    if (responseSuccessfully) {
      message.success("Slot Generated Successfully");
      const url = locationState?.backURL;
      const backURL = bufferURLDecode(url);
      navigate(backURL);
    } else {
      setTimeout(() => {
        setDisable(false);
      }, 3000);
    }
  };

  const onFinishDateForm = (data: ISlotAPICreateEditPayloadData) => {
    dateForm
      .validateFields()
      .then(() => {
        if (labEndTime && labStartTime) {
          const hours = [labStartTime, labEndTime];
          const timeDuration = calculateTimeDifference({
            start_time: labStartTime,
            end_time: labEndTime,
          });
          // Update payload data with hours and duration
          [data.createPayload, data.updatePayload].forEach((payload) => {
            if (payload && payload.length) {
              payload.forEach((slotData) => {
                slotData.hours = hours;
                slotData.duration = parseFloat(timeDuration);
              });
            }
          });
          onFinishSlotAssignForm(data);
        }
      })
      .catch(() => {});
  };

  return (
    <div>
      <Skeleton active loading={loading} avatar>
        <Row
          align="middle"
          justify="space-between"
          gutter={24}
          className="mb-20"
        >
          <Col xs={20} xxl={12}>
            <h2 className="rnw-page-title">
              <span className="gx-ml-2">{locationState?.batch_name}</span>
            </h2>
            {currentBatchDetails?.subcourse.name && (
              <small className="signingSheet-gr gx-mt-2 gx-d-block gx-ml-2">
                ({currentBatchDetails?.subcourse.name})
              </small>
            )}
          </Col>
          <Col xs={4} xxl={12} className="text-align-right gx-mt-2 gx-md-mt-0">
            <Button
              type="primary"
              onClick={() => {
                const url = locationState?.backURL;
                if (url) {
                  const backURL = bufferURLDecode(url);
                  navigate(backURL);
                } else {
                  navigate("/batch");
                }
              }}
            >
              <i className="fa fa-arrow-left back-icon"></i>{" "}
              <span className="gx-d-none gx-d-sm-inline-block">Back</span>
            </Button>
          </Col>
        </Row>

        <div className="ant-card-body gx-bg-white gx-pb-0 lab-card">
          <>
            <Form
              id="myForm"
              name="dateForm"
              autoComplete="off"
              layout="vertical"
              onFinish={onFinishDateForm}
              form={dateForm}
            >
              <Row gutter={24}>
                <Col xs={12}>
                  <FloatLabel
                    label="Start Time"
                    placeholder="Enter Start Time"
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
                          {generateTimeArray(7, 19)?.map(
                            ([value, label], index) => (
                              <Option key={index + 1} value={value}>
                                {label}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </>
                  </FloatLabel>
                </Col>

                <Col xs={12}>
                  <FloatLabel
                    label="End Time"
                    placeholder="Enter End Time"
                    name="end_time"
                    required
                  >
                    <>
                      <Form.Item
                        className="gx-mb-0"
                        name="end_time"
                        rules={rules.end_time}
                      >
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
                          {generateTimeArray(8, 20)?.map(
                            ([value, label], index) => (
                              <Option key={index + 1} value={value}>
                                {label}
                              </Option>
                            )
                          )}
                        </Select>
                      </Form.Item>
                    </>
                  </FloatLabel>
                </Col>
              </Row>
            </Form>

            <LabDetailsShow
              batchStudentList={batchStudentList}
              labBranchInfrastructureData={labBranchInfrastructureData}
              branchInfrastructureWisePlacesData={
                branchInfrastructureWisePlacesData
              }
              labFormInitialValue={labFormInitialValue}
              onFinishDateForm={onFinishDateForm}
              disable={disable}
              setSlotStartTimeAndEndTime={setSlotStartTimeAndEndTime}
              batchInOldSlotRecords={batchInOldSlotRecords}
            />
          </>
        </div>
      </Skeleton>
    </div>
  );
};

export default AssignLab;
