import { Dropdown, Menu } from "antd";
import { IActionWrapperProps } from "./ActionWrapper.model";

const UserActionWrapper = (props: IActionWrapperProps) => {
  const { children } = props;
  const menuItems = () => {
    return (
      <Menu className="has-no-data">
        {Array.isArray(children) ? (
          children.map((option, index) => (
            <Menu.Item key={`Menuitem-${index}`}>{option}</Menu.Item>
          ))
        ) : (
          <Menu.Item key="Menuitem-0">{children}</Menu.Item>
        )}
      </Menu>
    );
  };
  return (
    <>
      <div>
        <Dropdown
          overlay={menuItems}
          placement="bottomLeft"
          trigger={["click"]}
          getPopupContainer={(trigger) => trigger.parentElement as HTMLElement}
        >
          <i className="gx-icon-btn icon icon-ellipse-v" />
        </Dropdown>
      </div>
    </>
  );
};

export default UserActionWrapper;
