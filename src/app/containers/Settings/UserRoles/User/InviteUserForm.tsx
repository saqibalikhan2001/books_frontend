/**@format */

import { useEffect } from "react";
import { Form } from "antd";
import { rules } from "utils";
import { useCreateFormApi } from "app/Hooks";
import { Content, Labels } from "static";
import { Buttonx, InputField, Selectx } from "app/shared";

// const { AiOutlineUser, AiOutlineMail } = Icons;
const initialState = {
  name: "",
  email: "",
  role_id: null,
};

export const InviteUserForm = ({ url, onSubmit, toggle, loading, isEdit }: any) => {
  const [form] = Form.useForm();
  const { details: current, roles } = useCreateFormApi(url);

  useEffect(() => {
    if (isEdit && current && Object.keys(current).length)
      form.setFieldsValue({ ...current?.user_info });
  }, [form, current, isEdit]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
      name="invite-user-form"
      initialValues={initialState}
      className="invite_user_form"
    >
      <div className="flexbox form-row-container justify-content-between">
      <InputField
        form={form}
        name="name"
        size="large"
        className="input_field flex-47"
        label={Labels.NAME}
        required
        // LeftIcon={<AiOutlineUser />}
        rules={rules({ message: Content.enter_name })}
        placeholder={`${Labels.ENTER} ${Labels._NAME}`}
      />

      <Selectx
        name="role_id"
        options={roles}
        allowClear={false}
        className="input_field flex-47"
        popupClassName="overlap dropdown--scroll"
        label={Labels.ROLE} 
        placeholder={`${Labels.ENTER} ${Labels._ROLE}`}
        rules={rules({ message: Content.role_required })}
        required
      />
      </div>
      <div className="flexbox form-row-container justify-content-between">
      <InputField
        form={form}
        name="email"
        disabled={isEdit}
        className="input_field flex-47"
        // LeftIcon={<AiOutlineMail />}
        rules={rules({ message: "Enter a valid email", valEmail: true })}
        label={Labels.EMAIL} 
        required
        placeholder={`${Labels.ENTER} ${Labels._EMAIL}`}
      />
      </div>
      <div className="d-flex flex-end">
        <Buttonx
          htmlType="button"
          clickHandler={toggle}
          btnText={Labels.CANCEL}
          className="btn-form-size btn-default mr-20  mb-0"
        />
        <Buttonx
          btnText={Labels.INVITE}
          className="btn-form-size btn-primary  mb-0"
          loading={loading}
        />
      </div>
    </Form>
  );
};
