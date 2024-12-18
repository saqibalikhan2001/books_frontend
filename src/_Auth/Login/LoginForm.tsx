/** @format */

import { Form, Checkbox, Typography } from "antd";
import { rules, passwordRules } from "utils";
import { LoginSubmitProps } from "../types";
import { Labels, Content, routeNames } from "static";
import { Buttonx, InputField, Icons } from "app/shared";

const { LOGIN, PASSWORD, EMAIL, SUBMIT, REMEMBER_ME } = Labels;
const {
  sign_in_header,
  forget_password,
  dont_have_account,
  password_field_required,
} = Content;
const { FORGET_PASSWORD, SINGUP } = routeNames;
const { AiOutlineMail, AiOutlineLock } = Icons;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not valid!",
    // number: '${label} is not a valid number!',
  },
  // number: {
  //   range: '${label} must be between ${min} and ${max}',
  // },
};
/* eslint-enable no-template-curly-in-string */

export const LoginForm = ({ onSubmit, loading }: LoginSubmitProps) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}>
      <Typography.Title className="hover-underline">
        {sign_in_header}
      </Typography.Title>
      <Form
        name={LOGIN}
        initialValues={{
          remember: true,
        }}
        layout="vertical"
        onFinish={onSubmit}
        validateMessages={validateMessages}
        autoComplete="off"
        style={{
          background: "#fff",
          border: "1px solid #d3dee6",
          borderRadius: "10px",
          padding: "4rem",
          boxShadow: "0 10px 60px rgb(0 0 0 / 10%)",
        }}>
        <InputField
          label={EMAIL}
          name="email"
          rules={rules({ name: "email" })}
          LeftIcon={<AiOutlineMail />}
          className="no-transition"
        />

        <InputField
          label={PASSWORD}
          name="password"
          rules={passwordRules(password_field_required)}
          LeftIcon={<AiOutlineLock className="site-form-item-icon" />}
          password
          className="no-transition"
        />

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{REMEMBER_ME}</Checkbox>
        </Form.Item>

        <Buttonx
          type="link"
          size="small"
          className="login-form-forget hover-underline"
          btnText={forget_password}
          linkTo={FORGET_PASSWORD}
        />

        <Buttonx
          block
          loading={loading}
          btnText={SUBMIT}
          wrapperCol={{
            offset: 3,
            span: 16,
          }}
          style={{ width: "100%" }}
        />

        <Buttonx
          wrapperCol={{
            offset: 5,
            span: 12,
          }}
          linkTo={SINGUP}
          type="link"
          size="small"
          className="hover-underline"
          btnText={dont_have_account}
        />
      </Form>
    </div>
  );
};
