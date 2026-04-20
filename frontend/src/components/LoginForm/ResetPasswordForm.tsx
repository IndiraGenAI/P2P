import { Button, Form, Input } from "antd";
import { IResetPasswordForm, IResetPasswordProps } from "./LoginForm.model";
import { Common } from "src/utils/constants/ActionTypes";
import P2PBrandHeader from "../BrandLogo/P2PBrandHeader";
import FloatLabel from "../Form/FloatLabel";

const FormItem = Form.Item;

const ResetPassword = (props: IResetPasswordProps) => {
  const { stage, onChangePassword, isLoading } = props;
  const rules = {
    code: [{ required: true, message: "Please Enter Code!" }],
    password: [
      { required: true, message: "Please Enter Password!" },
      { min: 8 },
      {
        pattern: new RegExp(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[-!$%^&*()_+|~='{}\[\]:\/;<>?,.@#])/
        ),
        message:
          "Password must be one uppercase letter, lowercase letter, special character and number.",
      },
    ],
    confirm: [
      { required: true, message: "Please confirm your password!" },
      ({ getFieldValue }: any) => ({
        validator(rule: any, value: any) {
          if (!value || getFieldValue("password") === value) {
            return Promise.resolve();
          }
          return Promise.reject(
            "The two passwords that you entered do not match!"
          );
        },
      }),
    ],
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header">
          <div className="gx-p-2">
            <P2PBrandHeader logoWidth={140} />
          </div>
          <h2>Reset Password</h2>
          <span>Enter a new password for your account</span>
        </div>

        <Form
          initialValues={{ remember: true }}
          name="basic"
          autoComplete="off"
          requiredMark={true}
          onFinish={(value: IResetPasswordForm) => {
            onChangePassword && onChangePassword(value);
          }}
          className="gx-signin-form gx-form-row0"
        >
          {stage ===
            Common.AuthStage.CHANGE_PASSWORD_WITH_VERIFICATION_CODE && (
            <FloatLabel label="Code" placeholder="Code" name="code" required>
              <Form.Item name="code" rules={rules.code}>
                <Input size="large" autoComplete="false" />
              </Form.Item>
            </FloatLabel>
          )}

          <FloatLabel
            label="New Password"
            placeholder="New Password"
            name="password"
            required
          >
            <Form.Item name="password" rules={rules.password}>
              <Input size="large" type="password" autoComplete="new-password" />
            </Form.Item>
          </FloatLabel>

          <FloatLabel
            label="Confirm New Password"
            placeholder="Confirm New Password"
            name="confirm"
            required
          >
            <Form.Item
              name="confirm"
              rules={rules.confirm}
              dependencies={["password"]}
            >
              <Input size="large" type="password" autoComplete="new-password" />
            </Form.Item>
          </FloatLabel>

          <FormItem>
            <Button
              danger
              type="default"
              htmlType="submit"
              disabled={isLoading}
            >
              Reset Password
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
