import { Button, Form, Input, Select } from "antd";
import FloatLabel from "src/components/Form/FloatLabel";
import type { IRoleRecord } from "../Role.model";
import type { IRoleAddProps } from "./Add.model";
import { RoleType } from "src/utils/constants/constant";

const RoleAdd = (props: IRoleAddProps) => {
  const { data, onSubmit, myRef } = props;
  const rules = {
    name: [{ required: true, message: "Please Enter Name" }, { min: 3 }],
    description: [{ required: true, message: "Please Enter Description" }],
    type: [{ required: true, message: "Please Select Type" }],
  };

  return (
    <Form
      className="add-roles drawer-form"
      name="basic"
      initialValues={data}
      onFinish={(values: IRoleRecord) => {
        onSubmit(values);
      }}
      autoComplete="off"
      requiredMark={true}
    >
      <FloatLabel label="Name" placeholder="Enter Name" name="name" required>
        <Form.Item name="name" rules={rules.name}>
          <Input size="large" />
        </Form.Item>
      </FloatLabel>

      <FloatLabel
        label="Description"
        placeholder="Enter Description"
        name="description"
        required
      >
        <Form.Item name="description" rules={rules.description}>
          <Input size="large" />
        </Form.Item>
      </FloatLabel>

      <FloatLabel
        label="Role Type"
        placeholder="Select Role Type"
        name="type"
        required
      >
        <Form.Item name="type" rules={rules.type}>
          <Select
            size="large"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children?.toString() || "")
                .toLowerCase()
                .includes(input.toLowerCase().trim())
            }
          >
            <option key="1" value={RoleType.SUPER_ADMIN}>
              SUPER_ADMIN
            </option>
            <option key="2" value={RoleType.ADMIN}>
              ADMIN
            </option>
            <option key="3" value={RoleType.FACULTY_HEAD}>
              FACULTY_HEAD
            </option>
            <option key="4" value={RoleType.FACULTY}>
              FACULTY
            </option>
            <option key="5" value={RoleType.MANAGER}>
              MANAGER
            </option>
            <option key="6" value={RoleType.OPERATION_MANAGER}>
              OPERATION_MANAGER
            </option>
            <option key="7" value={RoleType.SALES_MANAGER}>
             SALES_MANAGER
            </option>
            <option key="8" value={RoleType.ACCOUNT_MANAGER}>
              ACCOUNT_MANAGER
            </option>
          </Select>
        </Form.Item>
      </FloatLabel>

      <Form.Item className="modal-btn-grp" style={{ display: "none" }}>
        <Button
          type="primary"
          htmlType="submit"
          className="btn-submit"
          ref={myRef}
        >
          {data ? "Update" : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleAdd;
