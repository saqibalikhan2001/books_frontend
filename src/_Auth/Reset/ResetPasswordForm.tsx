/** @format */

import { Form, Typography } from "antd";
import { ResetFormProps } from ".";
import { rules, passwordRules } from "utils";
import { Labels, Content, routeNames } from "static";
import { Buttonx, InputField, Icons } from "app/shared";
import { useGetSearchParam } from "app/Hooks/useGetSearchParam";

const { SIGNIN, PASSWORD, CONFIRM_PASSWROD, CODE, SUBMIT } = Labels;
const {
  reset_password,
  enter_confirmation_code,
  password_field_required,
  enter_confirm_password,
} = Content;
const { LOGIN } = routeNames;
const { AiOutlineLock, AiOutlineNumber } = Icons;

const initialValues = {
  password: "",
  confirmation_code: "",
  password_confirmation: "",
};

export const ResetPasswordForm = ({ onSubmit, loading }: ResetFormProps) => {
  const [form] = Form.useForm();
  const { param: token } = useGetSearchParam("token");

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
        {reset_password}
      </Typography.Title>
      <Form
        name={reset_password}
        labelCol={{
          span: 16,
        }}
        initialValues={{ ...initialValues, confirmation_code: token || "" }}
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        autoComplete="off"
        style={{
          background: "#fff",
          border: "1px solid #d3dee6",
          borderRadius: "10px",
          padding: "4rem",
          boxShadow: "0 10px 60px rgb(0 0 0 / 10%)",
        }}
        scrollToFirstError>
        <InputField
          label={CODE}
          name="confirmation_code"
          rules={rules({ message: enter_confirmation_code })}
          LeftIcon={<AiOutlineNumber />}
        />

        <InputField
          label={PASSWORD}
          name="password"
          rules={passwordRules(password_field_required)}
          LeftIcon={<AiOutlineLock />}
          password
        />

        <InputField
          label={CONFIRM_PASSWROD}
          dependencies={["password"]}
          name="password_confirmation"
          rules={passwordRules(enter_confirm_password, true)}
          LeftIcon={<AiOutlineLock />}
          password
        />
        <Buttonx
          type="link"
          size="small"
          className="login-form-forget hover-underline"
          btnText={SIGNIN}
          linkTo={LOGIN}
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
      </Form>
    </div>
  );
};
