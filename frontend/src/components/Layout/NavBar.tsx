import {
  UserOutlined,
  AppstoreOutlined,
  BellOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Space, Avatar, Badge } from "antd";
import P2PBrandHeader from "../BrandLogo/P2PBrandHeader";

const menu = (
  <Menu
    items={[
      {
        key: "1",
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/">
            Profile
          </a>
        ),
      },
      {
        key: "2",
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/">
            Activity
          </a>
        ),
      },
      {
        key: "3",
        label: (
          <a target="_blank" rel="noopener noreferrer" href="/">
            log out
          </a>
        ),
      },
    ]}
  />
);

const Header: React.FC = (props) => {
  return (
    <div className="dashboard">
      <div className="navbar">
        <div className="header">
          <div className="logo">
            <P2PBrandHeader logoWidth={88} />
          </div>
          <div className="menu-wrap">
            <Menu
              mode="horizontal"
              defaultSelectedKeys={["mail"]}
              overflowedIndicator={false}
              triggerSubMenuAction={"click"}
            >
              <Menu.SubMenu key="SubMenu" title="ERP">
                <div>
                  <ul className="dropdown">
                    <li>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                    </li>
                    <li>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                    </li>
                    <li>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                    </li>
                    <li>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Two
                      </Menu.Item>
                      <Menu.Item icon={<AppstoreOutlined />}>
                        Navigation Three
                      </Menu.Item>
                    </li>
                  </ul>
                </div>
              </Menu.SubMenu>
            </Menu>
          </div>
        </div>
        <div className="info">
          <div className="avarat">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Space>
                <Badge count={5}>
                  {<MailOutlined style={{ fontSize: "20px", color: "#000" }} />}
                </Badge>
                {<BellOutlined style={{ fontSize: "20px", color: "#000" }} />}
                <Avatar shape="square" icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          </div>
          {/* <div className="info-inner"></div> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
