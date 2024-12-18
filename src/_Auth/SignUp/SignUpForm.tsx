/** @format */

import { Form, Typography } from "antd";
import { rules } from "utils";
import { SignupFormProps } from ".";
import { Labels, Content, routeNames } from "static";
import { Buttonx, InputField, Icons } from "app/shared";

const { LOGIN } = routeNames;
const { SIGNUP, PASSWORD, EMAIL, SUBMIT, NAME } = Labels;
const { AiOutlineMail, AiOutlineLock, AiOutlineUser } = Icons;
const {
  sign_up_header,
  aleady_have_account,
  enter_your_name,
  password_field_required,
} = Content;

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not valid!",
  },
};
/* eslint-enable no-template-curly-in-string */
export const SignUpForm = ({
  onSubmit,
  loading,
  email,
  name,
}: SignupFormProps) => {
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
        {sign_up_header}
      </Typography.Title>
      <Form
        name={SIGNUP}
        labelCol={{
          span: 8,
        }}
        initialValues={{
          remember: true,
          email: email || "",
          name: name || "",
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
          label={NAME}
          name="name"
          rules={rules({ message: enter_your_name })}
          LeftIcon={<AiOutlineUser />}
        />

        <InputField
          label={EMAIL}
          name="email"
          rules={rules({ name: "email" })}
          LeftIcon={<AiOutlineMail />}
        />

        <InputField
          label={PASSWORD}
          name="password"
          rules={rules({ message: password_field_required })}
          LeftIcon={<AiOutlineLock />}
          password
        />

        <Buttonx
          block
          btnText={SUBMIT}
          loading={loading}
          wrapperCol={{
            offset: 3,
            span: 16,
          }}
          style={{ width: "100%" }}
        />

        <Buttonx
          wrapperCol={{
            offset: 4,
            span: 12,
          }}
          type="link"
          size="small"
          className="hover-underline"
          btnText={aleady_have_account}
          linkTo={LOGIN}
        />
      </Form>
    </div>
  );
};
