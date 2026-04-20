import { Button, Form, Input } from "antd";
import { IForgotPasswordProps } from "./LoginForm.model";
import { IForgotPasswordFormField } from "src/services/login/login.model";
import P2PBrandHeader from "../BrandLogo/P2PBrandHeader";
import FloatLabel from "../Form/FloatLabel";
const FormItem = Form.Item;

const ForgotPassword = (props: IForgotPasswordProps) => {
  const { onForgotPassword, isLoading } = props;
  const rules = {
    email: [
      { required: true, message: "Please input your E-mail!" },
      { max: 100 },
    ],
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header">
          <div className="gx-p-3">
            <P2PBrandHeader logoWidth={160} />
          </div>
          <h2>Forgot Your Password ?</h2>
          <span>
            Don't worry. Recovering the password is easy.Just tell us the email
            you have registered
          </span>
        </div>

        <Form
          initialValues={{ remember: true }}
          name="basic"
          autoComplete="false"
          requiredMark={true}
          onFinish={(value: IForgotPasswordFormField) => {
            onForgotPassword && onForgotPassword(value);
          }}
          className="gx-signin-form gx-form-row0"
        >
          <FloatLabel label="Email" placeholder="Email" name="email" required>
            <Form.Item name="email" rules={rules.email}>
              <Input size="large" autoComplete="false" />
            </Form.Item>
          </FloatLabel>

          <FormItem>
            <Button
              danger
              type="default"
              htmlType="submit"
              disabled={isLoading}
            >
              SEND
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
