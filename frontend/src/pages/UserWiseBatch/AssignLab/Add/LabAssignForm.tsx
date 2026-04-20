import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Select, Tabs } from "antd";
import TabPane from "antd/lib/tabs/TabPane";
import {
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router-dom";
import FloatLabel from "src/components/Form/FloatLabel";
import { Slot_Type } from "src/utils/constants/constant";

import {
  IFormSubmitValue,
  ILabAssignForm,
  ISelectedStudentRecord,
  ISlotAPICreateEditPayloadData,
} from "./Add.model";
import { IStudentDetails } from "src/services/studentList/studentList.model";
import {
  ISearchSlotsData,
  ISlotsPlacesData,
} from "src/services/slots/slots.model";
import { IBranchInfrastructureDetails } from "src/services/BranchInfrastructure/branchInfrastructure.model";
import { bufferURLDecode, showTooltip } from "src/utils/helperFunction";
const { Option } = Select;

const LabAssignForm = (props: ILabAssignForm) => {
  const {
    onSubmit,
    labBranchInfrastructureData,
    studentListData,
    allBatchStudentRecord,
    branchInfrastructureWisePlacesData,
    labFormInitialValue,
    disable,
    setStudentListDataMethod,
  } = props;

  const [form] = Form.useForm();
  const { batch_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams("1");
  const data = Object.fromEntries(new URLSearchParams(searchParams));
  const [tabIndex, setTabIndex] = useState<string>(
    data.currentTab ? data.currentTab : "1"
  );
  const navigate = useNavigate();
  let location = useLocation();
  const locationState = location.state;
  const [selectStudent, setSelectStudent] = useState<ISelectedStudentRecord[]>(
    []
  );
  const [placesData, setPlacesData] = useState<ISlotsPlacesData[]>([]);
  const [oldSelectedStudentRecord, setOldSelectedStudentRecord] = useState<
    ISelectedStudentRecord[]
  >([]);
  const [existRecord, setExistRecord] = useState<ISelectedStudentRecord[]>([]);

  const callback = (value: string) => {
    setTabIndex(value);
  };

  useEffect(() => {
    const selectedId = selectStudent?.map(
      (studentDetails: ISelectedStudentRecord) => studentDetails?.admission_id
    );
    const notSelectedData: IStudentDetails[] =
      allBatchStudentRecord?.filter(
        (studentDetails: IStudentDetails) =>
          !selectedId?.includes(studentDetails?.admission_id)
      ) || [];
    setStudentListDataMethod(notSelectedData);
    // eslint-disable-next-line
  }, [selectStudent]);

  useEffect(() => {
    if (branchInfrastructureWisePlacesData) {
      const assignData: ISelectedStudentRecord[] = [];
      const allExistsRecord: ISelectedStudentRecord[] = [];
      const allPlaceData: ISlotsPlacesData[][] = [];
      const batchSelectedStudentIds = allBatchStudentRecord?.map(
        (studentDetails: IStudentDetails) => studentDetails?.admission_id
      );

      branchInfrastructureWisePlacesData?.forEach(
        (infrastructureData: ISearchSlotsData) => {
          allPlaceData?.push([...infrastructureData?.data]);
          infrastructureData?.data?.forEach((placeData: ISlotsPlacesData) => {
            const place = placeData?.slots[0];
            const data = {
              admission_id: place?.admission_id,
              branch_infrastructure_id: place?.branch_infrastructure_id,
              place_id: place?.place_id,
              id: place?.id,
              status: place?.status,
              batch_id: Number(batch_id),
            };
            if (placeData?.slots?.length) {
              allExistsRecord?.push(data);
            }
            if (
              placeData?.slots?.length &&
              batchSelectedStudentIds?.includes(
                placeData?.slots[0]?.admission_id
              )
            ) {
              assignData?.push(data);
            }
          });
        }
      );

      setPlacesData(allPlaceData?.flat());
      const uniqueRecords = [...selectStudent, ...assignData].filter(
        (record, index, self) =>
          index === self.findIndex((r) => r.place_id === record.place_id)
      );
      setSelectStudent(uniqueRecords);
      setOldSelectedStudentRecord(assignData);
      setExistRecord(allExistsRecord);
    }
    // eslint-disable-next-line
  }, [branchInfrastructureWisePlacesData]);

  const studentChange = (student: string, place_id: number) => {
    const admission_id =
      student !== undefined
        ? Number(student?.split("-$name$-")[0]?.split("$gr_id$")[1])
        : student;
    const student_name =
      student !== undefined ? student?.split("-$name$-")[1] : student;

    const admissionIdValue = student
      ? `${student.split("-$name$-")[0]?.split("$gr_id$")[0]}-${student_name}`
      : undefined;

    form.setFieldValue(
      `admission_id_${place_id}`,
      admissionIdValue ? admissionIdValue?.toUpperCase() : admissionIdValue
    );

    const data = [...selectStudent];
    const isAssignRecord = data?.findIndex(
      (record: ISelectedStudentRecord) => record?.place_id === place_id
    );

    if (isAssignRecord !== -1) {
      if (admission_id === undefined) {
        data?.splice(isAssignRecord, 1);
      } else {
        data[isAssignRecord].admission_id = admission_id;
      }
      setSelectStudent(data);
    } else {
      const selectedPlaceRecord = placesData?.find(
        (placeData: ISlotsPlacesData) => placeData.id === place_id
      );
      const record: ISelectedStudentRecord = {
        branch_infrastructure_id: selectedPlaceRecord?.branch_infrastructure_id,
        place_id: selectedPlaceRecord?.id,
        admission_id: admission_id,
        status: Slot_Type.OCCUPY,
        batch_id: Number(batch_id),
      };

      if (selectedPlaceRecord?.slots[0]?.id) {
        record.id = selectedPlaceRecord?.slots[0]?.id;
      }

      data?.push(record);
      setSelectStudent(data);
    }
  };

  const showTabHeading = (tabHeading?: string, labId?: number) => {
    const labData = branchInfrastructureWisePlacesData?.find(
      (slotData) => slotData?.branch_infrastructure_id === labId
    );
    const maxLength = 25;
    return (
      <div>
        <span className="gx-mb-3">
          {tabHeading && showTooltip(tabHeading, maxLength)}
        </span>
        <p>
          <table
            style={{ background: "#fff4f4" }}
            className="gx-rounded-base gx-mt-2 gx-w-100"
          >
            <thead style={{ borderBottom: "1px solid #ea545533" }}>
              <tr>
                <td className="gx-p-2">Total</td>
                <td className="gx-p-2">Available</td>
                <td className="gx-p-2">Booked</td>
                <td className="gx-p-2">Hold</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td align="center" className="gx-p-2">
                  {labData?.total ? labData?.total : "0"}
                </td>
                <td align="center" className="gx-p-2">
                  {labData?.available ? labData?.available : "0"}
                </td>
                <td align="center" className="gx-p-2">
                  {labData?.booked ? labData?.booked : "0"}
                </td>
                <td align="center" className="gx-p-2">
                  {labData?.hold ? labData?.hold : "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </p>
      </div>
    );
  };
  return (
    <div>
      <Form
        name="basic"
        className="drawer-form"
        initialValues={labFormInitialValue}
        onFinish={(values: IFormSubmitValue) => {
          const finalPayload: ISlotAPICreateEditPayloadData = {
            createPayload: [],
            updatePayload: [],
          };

          if (oldSelectedStudentRecord?.length) {
            //edit
            oldSelectedStudentRecord?.forEach(
              (oldStudentDetails: ISelectedStudentRecord) => {
                const found = selectStudent?.some(
                  (student: ISelectedStudentRecord) =>
                    student?.admission_id === oldStudentDetails?.admission_id
                );
                if (!found) {
                  finalPayload.updatePayload.push({
                    ...oldStudentDetails,
                    admission_id: null,
                    status: Slot_Type.UN_OCCUPY,
                  });
                } else {
                  const found = selectStudent?.some(
                    (student: ISelectedStudentRecord) =>
                      student?.place_id === oldStudentDetails?.place_id
                  );

                  if (!found) {
                    finalPayload.updatePayload.push({
                      ...oldStudentDetails,
                      admission_id: null,
                      status: Slot_Type.UN_OCCUPY,
                    });
                  }
                }
              }
            );

            selectStudent?.forEach(
              (selectedStudentData: ISelectedStudentRecord) => {
                const isExistRecord = existRecord?.some(
                  (exists: ISelectedStudentRecord) =>
                    exists?.place_id === selectedStudentData?.place_id
                );
                if (isExistRecord) {
                  finalPayload.updatePayload.push(selectedStudentData);
                } else {
                  finalPayload.createPayload.push(selectedStudentData);
                }
              }
            );
          } else {
            // first time create slot
            selectStudent?.forEach((selectedData: ISelectedStudentRecord) => {
              if (
                existRecord?.some(
                  (existsData: ISelectedStudentRecord) =>
                    existsData?.place_id === selectedData?.place_id
                )
              ) {
                finalPayload.updatePayload.push(selectedData);
              } else {
                finalPayload.createPayload.push(selectedData);
              }
            });
          }
          onSubmit(finalPayload);
        }}
        autoComplete="off"
        requiredMark={true}
        form={form}
      >
        {labBranchInfrastructureData?.length ? (
          <>
            <Card className="table-card rnw-card gx-mb-0 assign-card">
              <Tabs onChange={callback} type="card" defaultActiveKey={tabIndex}>
                {labBranchInfrastructureData?.map(
                  (labDetails: IBranchInfrastructureDetails, index: number) => (
                    <TabPane
                      tab={showTabHeading(labDetails?.name, labDetails?.id)}
                      key={index + 1}
                    >
                      <Row>
                        <Col span={24}>
                          <Card className="table-card rnw-card transfer-addmission">
                            {branchInfrastructureWisePlacesData &&
                            branchInfrastructureWisePlacesData?.find(
                              (branchInfrastructureDetails) =>
                                branchInfrastructureDetails?.branch_infrastructure_id ===
                                labDetails?.id
                            )?.data?.length ? (
                              branchInfrastructureWisePlacesData
                                ?.find(
                                  (branchInfrastructureDetails) =>
                                    branchInfrastructureDetails?.branch_infrastructure_id ===
                                    labDetails?.id
                                )
                                ?.data?.map(
                                  (placeDetails: ISlotsPlacesData) => (
                                    <Row>
                                      <Col
                                        xs={4}
                                        md={4}
                                        lg={2}
                                        xl={2}
                                        className="gx-d-flex gx-px-0 gx-pt-1 lab-portal"
                                        key={`${labDetails?.id}-${placeDetails.id}`}
                                      >
                                        <div className="gx-pt-1">
                                          <p
                                            style={{ width: "50px" }}
                                            className="gx-mb-0"
                                          >
                                            {placeDetails?.name}
                                          </p>
                                          <p style={{ fontSize: "10px" }}>
                                            {placeDetails?.is_laptop
                                              ? "Laptop"
                                              : placeDetails?.hardwares
                                              ? "Hardware"
                                              : "Empty"}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        xs={20}
                                        md={20}
                                        lg={22}
                                        xl={22}
                                        className="gx-px-0 gx-pt-1"
                                      >
                                        <FloatLabel
                                          label="Place"
                                          placeholder="Select Student"
                                          name={`admission_id_${placeDetails?.id}`}
                                        >
                                          <Form.Item
                                            name={`admission_id_${placeDetails?.id}`}
                                            className="gx-mb-0"
                                          >
                                            <Select
                                              getPopupContainer={(trigger) =>
                                                trigger.parentNode
                                              }
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
                                              onChange={(e) =>
                                                studentChange(
                                                  e,
                                                  placeDetails?.id
                                                )
                                              }
                                            >
                                              {studentListData?.map(
                                                (student: IStudentDetails) => {
                                                  const studentIds =
                                                    selectStudent?.map(
                                                      (
                                                        studentDetails: ISelectedStudentRecord
                                                      ) =>
                                                        studentDetails?.admission_id
                                                    );
                                                  if (
                                                    !studentIds?.includes(
                                                      student?.admission?.id
                                                    )
                                                  ) {
                                                    const studentName = `${
                                                      student?.admission
                                                        ?.first_name +
                                                      " " +
                                                      student?.admission
                                                        ?.middle_name +
                                                      " " +
                                                      student?.admission
                                                        ?.last_name
                                                    }`;
                                                    return (
                                                      <Option
                                                        key={
                                                          student?.admission?.id
                                                        }
                                                        value={`${student?.admission?.gr_id}$gr_id$${student?.admission?.id}-$name$-${studentName}`}
                                                        label={
                                                          student?.admission?.id
                                                        }
                                                      >
                                                        {showTooltip(
                                                          `${student?.admission?.gr_id}-${studentName}`.toUpperCase(),
                                                          30
                                                        )}
                                                      </Option>
                                                    );
                                                  }
                                                }
                                              )}
                                            </Select>
                                          </Form.Item>
                                        </FloatLabel>
                                        <div className="gx-mb-2">
                                          {placeDetails?.slots?.length &&
                                          placeDetails?.slots[0]?.status ===
                                            Slot_Type.HOLD ? (
                                            <span
                                              style={{
                                                color: "#ea5455",
                                                fontSize: "10px",
                                              }}
                                            >
                                              (Hold)
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                  )
                                )
                            ) : (
                              <p>No Place Available</p>
                            )}
                          </Card>
                        </Col>
                      </Row>
                    </TabPane>
                  )
                )}
              </Tabs>
            </Card>

            <Form.Item style={{ width: "100%" }}>
              <Row className="gx-justify-content-end gx-mt-3">
                <Col xs={12} md={4}>
                  <div className="gx-px-1 gx-px-md-0">
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={
                        !(
                          selectStudent?.length ||
                          oldSelectedStudentRecord?.length
                        ) || disable
                      }
                      className="gx-p-2 gx-m-0 gx-w-100"
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div className="gx-px-1 gx-px-md-0">
                    <Button
                      className="btn-cancel gx-p-2  gx-m-0 gx-w-100"
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
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form.Item>
          </>
        ) : (
          <div>
            <p className="gx-text-center gx-fw-bold ">No Lab Found</p>
          </div>
        )}
      </Form>
    </div>
  );
};

export default LabAssignForm;
