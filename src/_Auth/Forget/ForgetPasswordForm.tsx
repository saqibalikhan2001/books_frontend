/** @format */

import { Form, Typography } from "antd";
import { Link } from "react-router-dom";
import { rules } from "utils";
import { FogetFormProps } from ".";
import { Labels, Content, routeNames } from "static";
import { Buttonx, InputField, Icons } from "app/shared";

const { AiOutlineMail } = Icons;
const { EMAIL, SUBMIT } = Labels;
const { RESET_PASSWORD } = routeNames;
const { forget_password, already_have_code } = Content;
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not valid!",
  },
};
/* eslint-enable no-template-curly-in-string */

const initialValues = {
  email: "",
};

export const ForgetPasswordForm = ({ onSubmit, loading }: FogetFormProps) => {
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
        {forget_password}
      </Typography.Title>
      <Form
        name={forget_password}
        labelCol={{
          span: 8,
        }}
        initialValues={initialValues}
        layout="vertical"
        onFinish={onSubmit}
        validateMessages={validateMessages}
        autoComplete="off"
        style={{
          padding: "4rem",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #d3dee6",
          boxShadow: "0 10px 60px rgb(0 0 0 / 10%)",
        }}>
        <InputField
          label={EMAIL}
          name="email"
          rules={rules({ name: "email" })}
          LeftIcon={<AiOutlineMail />}
        />

        <Form.Item>
          <Link to={RESET_PASSWORD}>
            <Buttonx
              type="link"
              size="small"
              className="login-form-forget hover-underline"
              btnText={already_have_code}
            />
          </Link>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 5,
            span: 12,
          }}>
          <Buttonx
            style={{ width: "100%" }}
            loading={loading}
            block
            btnText={SUBMIT}
          />
        </Form.Item>
      </Form>
    </div>
  );
};
