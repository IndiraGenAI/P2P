import { Breadcrumb } from "antd";
import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";

const MainLayout: FunctionComponent<any> = (props) => {
  return (
    <>
      <div className="main-header">
        <NavBar />
        <Breadcrumb>
          <Breadcrumb.Item>ERP</Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/zone">Zone</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/department">Department</Link>
          </Breadcrumb.Item>
          <Link to="subdepartment">Subdepartment</Link>
        </Breadcrumb>
      </div>
      {props.children}
      <div className="main-footer">
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
