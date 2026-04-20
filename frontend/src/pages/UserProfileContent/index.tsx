import { useState } from "react";
import { Card, Col, Row, Button, Modal } from "antd";

import { useAppSelector } from "src/state/app.hooks";
import { userSelector } from "src/state/users/user.reducer";
import PasswordChange from "./PasswordChange";
import { IUserRole } from "src/services/user/user.model";
import { ZoneType } from "src/utils/constants/constant";

const UserProfileContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userState = useAppSelector(userSelector);
  const filteredData = userState.userData.data.user_roles
    .map((uRole: IUserRole) => {
      if (uRole.zone.type === ZoneType.PUBLIC) {
        return `${uRole.zone.name} ${uRole.role.name}`;
      } else {
        return `${uRole.zone.branches && uRole.zone.branches[0].code}${" "}
            (${uRole.role.name})`;
      }
    })
    .sort((a, b) => (a as string).localeCompare(b as string));

  return (
    <>
      <Card className="user-profile-card">
        <div className="card-header gx-d-flex gx-justify-content-between gx-align-items-center">
          <h2 className="gx-page-title  gx-border-0 gx-p-0">
            User Profile (
            {userState.userData.data.first_name +
              " " +
              userState.userData.data.last_name}
            )
          </h2>
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Change Password
          </Button>
          <span className="line"></span>
        </div>
        <div className="card-body">
          <Row
            className="gx-m-0 gx-justify-content-between gx-align-items-start"
            align={"bottom"}
          >
            <Col
              xxl={5}
              lg={5}
              xs={12}
              sm={12}
              className="gx-px-2 gx-pb-3 gx-pb-lg-0"
            >
              <label>First Name</label>
              <h4>{userState.userData.data.first_name}</h4>
            </Col>

            <Col xxl={12} sm={19} xs={24} className="gx-px-2 gx-pb-3">
              <label>Zone (Roles)</label>
              <Row gutter={15}>
                {filteredData.map((x: string) => {
                  return (
                    <Col xs={24} sm={12} xl={8}>
                      <h4 className="user-zone-name gx-mr-3">{x}</h4>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xxl={2} lg={6} sm={12} className="gx-px-2 gx-pb-3 gx-pb-lg-0">
              <label>Mobile No.</label>
              <h4 className="gx-mr-3">{userState.userData.data.phone} </h4>
            </Col>

            <Col xxl={5} md={19} sm={17} xs={24} className="gx-px-2 ">
              <label>Email</label>
              <h4 className="gx-mr-3 " style={{ overflowWrap: "break-word" }}>
                {userState.userData.data.email}{" "}
              </h4>
            </Col>
          </Row>
        </div>
      </Card>

      {isModalOpen && (
        <Modal
          title={"Change Password"}
          centered
          keyboard={true}
          visible={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          footer={false}
        >
          <PasswordChange
            onClose={() => {
              setIsModalOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
};
export default UserProfileContent;
