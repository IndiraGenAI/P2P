import {Avatar, Popover} from "antd";

import { useContext, useEffect, useState } from "react";
import {useDispatch} from "react-redux";
import { AppDispatch } from "src/state/app.model";
import { logoutUser } from "src/state/Login/login.action";
import { useAppSelector } from "src/state/app.hooks";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { SidebarPermissionCodeContext } from "src/contexts/sidebarPermissionCodeContext";
import { userSelector } from "src/state/users/user.reducer";
const UserInfo = () => {  
  const [user, setUser] = useState("");
  const userState = useAppSelector(userSelector);
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const { setIsCode } = useContext(SidebarPermissionCodeContext);
  const onLogout = async () => {
  localStorage.removeItem("myStorageID");
  await dispatch(logoutUser()).then(() => {
    navigate("/login");
    setIsCode([]);
  });
};
useEffect(() => {
  if (userState.userData.data) {
    setUser(
      userState.userData.data.first_name +
        " " +
        userState.userData.data.last_name
    );
  }
}, [userState.userData.data]);
  const userMenuOptions = (
    <>
    <div className="menu-overlay"></div>
      <ul className="gx-user-popover profile-popover">
      
      <li className="user-profile-name">
        <UserOutlined />
        {user ? user : ""}
      </li>
      
      <Link className="user-edit-profile" to="/userprofile">
        <li>User Profile</li>
      </Link>
      <a onClick={onLogout}>
        <li>Logout</li>
      </a>
    </ul>
    </>
  );

  return (
    <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight" content={userMenuOptions}
             trigger="click">
      <Avatar src={"https://via.placeholder.com/150"}
              className="gx-avatar gx-pointer" alt=""/>
    </Popover>
  );
};

export default UserInfo;
