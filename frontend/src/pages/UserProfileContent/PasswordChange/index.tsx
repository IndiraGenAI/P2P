import { Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import FloatLabel from "src/components/Form/FloatLabel";
import { IChangePasswordField } from "src/services/login/login.model";
import { changePassword } from "src/state/Login/login.action";
import { AppDispatch } from "src/state/app.model";
import { IPasswordChangeProps } from "./PasswordChange.model";

const FormItem = Form.Item;
const PasswordChange = (props: IPasswordChangeProps) => {
  const { onClose } = props;
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const rules = {
    code: [{ message: "Please Enter Code!" }],
    currentPassword: [
      { required: true, message: "Please Enter Current Password!" },
      { min: 8 },
      {
        pattern: new RegExp(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[-!$%^&*()_+|~='{}\[\]:\/;<>?,.@#])/
        ),
        message:
          "Password must be one uppercase letter, lowercase letter, special character and number.",
      },
    ],
    newPassword: [
      { required: true, message: "Please Enter New Password!" },
      { min: 8 },
      {
        pattern: new RegExp(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[-!$%^&*()_+|~='{}\[\]:\/;<>?,.@#])/
        ),
        message:
          "Password must be one uppercase letter, lowercase letter, special character and number.",
      },
    ],
    confirmPassword: [
      { required: true, message: "Please confirm your password!" },
      ({ getFieldValue }: any) => ({
        validator(rule: any, value: any) {
          if (!value || getFieldValue("newPassword") === value) {
            return Promise.resolve();
          }
          return Promise.reject(
            "The two passwords that you entered do not match!"
          );
        },
      }),
    ],
  };
  useEffect(() => {}, []);
  const submitForm = (value: IChangePasswordField) => {
    setIsLoading(true);
    dispatch(changePassword(value))
      .then((response: any) => {
        setIsLoading(false);
        if (response.error && response.error.message) {
          message.error(response.error.message);
        } else {
          message.success("Your password is change successfully.");
          onClose && onClose();
        }
      })
      .catch((error: Error) => {
        message.error(error.message);
        setIsLoading(false);
      });
  };
  return (
    <>
      <Form
        initialValues={{ currentPassword: "", newPassword: "", confirm: "" }}
        name="basic"
        autoComplete="off"
        requiredMark={true}
        onFinish={submitForm}
        className="gx-signin-form gx-form-row0 change-password-box"
      >
        <FloatLabel
          label="Current Password"
          placeholder="Current Password"
          name="currentPassword"
          required
        >
          <Form.Item
            className="change-psw"
            name="currentPassword"
            rules={rules.currentPassword}
          >
            <Input.Password
              size="large"
              type="password"
              autoComplete="current_password"
            />
          </Form.Item>
        </FloatLabel>

        <FloatLabel
          label="New Password"
          placeholder="New Password"
          name="newPassword"
          required
        >
          <Form.Item
            className="change-psw"
            name="newPassword"
            rules={rules.newPassword}
          >
            <Input.Password
              size="large"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
        </FloatLabel>

        <FloatLabel
          label="Confirm New Password"
          placeholder="Confirm New Password"
          name="confirmPassword"
          required
        >
          <Form.Item
            className="change-psw"
            name="confirmPassword"
            rules={rules.confirmPassword}
            dependencies={["newPassword"]}
          >
            <Input.Password
              size="large"
              type="password"
              autoComplete="new-password"
            />
          </Form.Item>
        </FloatLabel>

        <FormItem>
          <Button danger type="primary" htmlType="submit" disabled={isLoading}>
            Change Password
          </Button>
        </FormItem>
      </Form>
    </>
  );
};
export default PasswordChange;
