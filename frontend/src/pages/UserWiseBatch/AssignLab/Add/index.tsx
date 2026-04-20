import React, { useState } from "react";
import StudentListIndex from "./StudentList";
import { Col, Row, Skeleton } from "antd";
import { ILabDetailsShow } from "./Add.model";
import { IStudentDetails } from "src/services/studentList/studentList.model";
import LabAssignForm from "./LabAssignForm";
import { slotDetails } from "../AssignLab.model";
import { convertTo12HourFormat } from "src/utils/helperFunction";
import { AdmissionSubcourseStatus } from "src/utils/constants/constant";

const LabDetailsShow = (props: ILabDetailsShow) => {
  const {
    batchStudentList,
    labBranchInfrastructureData,
    branchInfrastructureWisePlacesData,
    labFormInitialValue,
    onFinishDateForm,
    disable,
    setSlotStartTimeAndEndTime,
    batchInOldSlotRecords,
  } = props;
  const [studentListData, setStudentListData] = useState<IStudentDetails[]>();

  const setStudentListDataMethod = (studentList: IStudentDetails[]) => {
    const studentData = studentList?.filter(
      (student: IStudentDetails) =>
        student?.subcourse_status !== AdmissionSubcourseStatus.COMPLETED
    );
    setStudentListData(studentData);
  };

  const changeSlot = (data: { start_time: string; end_time: string }) => {
    setSlotStartTimeAndEndTime(data);
  };

  return (
    <div>
      <Skeleton active loading={!labFormInitialValue} avatar>
        <Row>
          <Col xs={24} md={8} lg={8} xl={8}>
            {studentListData && <StudentListIndex students={studentListData} />}
          </Col>
          <Col xs={24} md={16} lg={16} xl={16}>
            <LabAssignForm
              onSubmit={onFinishDateForm}
              allBatchStudentRecord={batchStudentList}
              labBranchInfrastructureData={labBranchInfrastructureData}
              studentListData={studentListData}
              branchInfrastructureWisePlacesData={
                branchInfrastructureWisePlacesData
              }
              labFormInitialValue={labFormInitialValue}
              disable={disable}
              setStudentListDataMethod={setStudentListDataMethod}
            />
          </Col>
          {batchInOldSlotRecords?.length && labFormInitialValue ? (
            <div className="gx-ml-4 gx-mt-3 gx-mb-1">
              <p className="gx-mb-0">This batch currently have below slots :</p>
              <div className="gx-d-flex gx-m-0">
                {batchInOldSlotRecords?.map((slot: slotDetails) => (
                  <div
                    onClick={() =>
                      changeSlot({
                        start_time: slot?.start_time,
                        end_time: slot?.end_time,
                      })
                    }
                    style={{ cursor: "pointer" }}
                    className="department-selected gx-p-2 gx-mt-1 gx-mr-2"
                  >
                    <p className="gx-p-0 gx-m-0">
                      {`${convertTo12HourFormat(
                        slot?.start_time
                      )} To ${convertTo12HourFormat(slot?.end_time)}`}
                    </p>
                    <p className="gx-p-0 gx-m-0">
                      <span>{`Booked-${slot?.occupy_count}`}</span>
                      {slot?.hold_count ? (
                        <span className="gx-m-3">{`Hold-${slot?.hold_count}`}</span>
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ""
          )}
        </Row>
      </Skeleton>
    </div>
  );
};

export default LabDetailsShow;
