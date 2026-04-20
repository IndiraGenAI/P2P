import { Button, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import FloatLabel from "src/components/Form/FloatLabel";
import { useAppSelector } from "src/state/app.hooks";
import { AppDispatch } from "src/state/app.model";
import { searchBranchData } from "src/state/branch/branch.action";
import { branchSelector } from "src/state/branch/branch.reducer";
import { IDepartmentRecord } from "../Department.model";
import { IDepartmentAddProps } from "./Add.model";

const { Option } = Select;
const DepartmentAdd = (props: IDepartmentAddProps) => {
  const { data, onSubmit, myRef } = props;
  const rules = {
    name: [
      { required: true, message: "Please Enter Name" },
      { min: 3, max: 100 },
    ],
    code: [
      { required: true, message: "Please Enter Code" },
      { min: 3, max: 50 },
    ],
    branch_id: [{ required: true, message: "Please Enter Branch" }],
  };

  let value = {
    ...data,
    branch_id: data?.branch_departments.map((x) => x.branch_id),
  };
  const branchState = useAppSelector(branchSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      searchBranchData({ noLimit: true, orderBy: "name", order: "ASC",isAllBranch:true })
    );
  }, []);

  return (
    <Form
      className="drawer-form"
      name="basic"
      initialValues={value}
      onFinish={(values: IDepartmentRecord) => {
        onSubmit(values);
      }}
      autoComplete="off"
      requiredMark={true}
    >
      <FloatLabel
        label="Branch Code"
        placeholder="Select Branch Code"
        name="branch_id"
        required
      >
        <Form.Item name="branch_id" rules={rules.branch_id}>
          <Select
            mode="multiple"
            showArrow
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children?.toString() || "")
                .toLowerCase()
                .includes(input.toLowerCase().trim())
            }
          >
            {branchState.branchesData.data.rows.filter((branch)=>branch.status===true).map((branch) => (
              <Option value={branch.id}>{branch.code}</Option>
            ))}
          </Select>
        </Form.Item>
      </FloatLabel>

      <FloatLabel label="Name" placeholder="Enter Name" name="name" required>
        <Form.Item name="name" rules={rules.name}>
          <Input size="large" />
        </Form.Item>
      </FloatLabel>

      <FloatLabel label="Code" placeholder="Enter Code" name="code" required>
        <Form.Item name="code" rules={rules.code}>
          <Input size="large" />
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

export default DepartmentAdd;
