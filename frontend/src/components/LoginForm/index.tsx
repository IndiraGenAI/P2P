import { Button, Form, Input } from "antd";
import { ILoginFormProps } from "./LoginForm.model";
import { Common } from "src/utils/constants/ActionTypes";
import FloatLabel from "../Form/FloatLabel";
import P2PBrandHeader from "../BrandLogo/P2PBrandHeader";
import { EmailValidation } from "src/utils/constants/constant";

const FormItem = Form.Item;

const SignIn = (props: ILoginFormProps) => {
  const { onChangeStage } = props;
  const rules = {
    email: [
      { required: true, message: "Please Enter E-mail!" },
      { max: 100 },
      {
        pattern: EmailValidation,
        message: "Please Enter valid email",
      },
    ],
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
  };

  return (
    <div className="gx-login-container">
      <div className="gx-login-content">
        <div className="gx-login-header">
          <div className="gx-text-center gx-mb-3">
            <P2PBrandHeader logoWidth={160} />
          </div>
          <h1 className="gx-login-title gx-text-center gx-mb-2">Sign In</h1>
        </div>
        <Form
          initialValues={{ remember: true }}
          name="basic"
          autoComplete="off"
          requiredMark={true}
          onFinish={(value: any) => {
            props.onLogin(value.email, value.password);
          }}
          className="gx-signin-form gx-form-row0"
        >
          <FloatLabel
            label="Email"
            placeholder="Enter Email"
            name="email"
            required
          >
            <Form.Item name="email" rules={rules.email}>
              <Input size="large" autoComplete="false" />
            </Form.Item>
          </FloatLabel>

          <FloatLabel
            label="Password"
            placeholder="Enter Password"
            name="password"
            required
          >
            <Form.Item name="password" rules={rules.password}>
              <Input size="large" type="password" autoComplete="false" />
            </Form.Item>
          </FloatLabel>
          <FormItem className="gx-text-right">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onChangeStage &&
                  onChangeStage(Common.AuthStage.FORGOT_PASSWORD);
              }}
            >
              Forgot password &#x3F;
            </a>
          </FormItem>
          <FormItem className="gx-text-center">
            <Button type="default" htmlType="submit">
              Log in
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;
