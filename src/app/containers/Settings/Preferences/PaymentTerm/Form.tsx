import { Form } from "antd";
import { Buttonx, InputField, InputNumberX } from "app/shared";
import { useEffect } from "react";
import { Content } from "static";

export const PaymentForm = ({
  form,
  onFinish,
  handleToggle,
  bool = false,
  current,
  edit = false,
}: any) => {
  useEffect(() => {
    if (edit && current && Object.keys(current).length) {
      form.setFieldsValue({ ...current });
    }
  }, [current]);
  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, []);
  return (
    <Form
      form={form}
      name="dynamic_form_nest_item"
      className="generic_modal"
      onFinish={onFinish}
      autoComplete="off"
      requiredMark={false}
    >
      <>
        <div className="flexbox align-center custom_invoice_modal payment_term_form">
          <InputField
            form={form}
            size="large"
            name="name"
            label="Label"
            className="form-group flex-47 mr-5"
            placeholder="Enter Label"
            rules={[
              {
                required: true,
                message: Content.enter_name,
              },
            ]}
          />
          <Form.Item
            className="form-group flex-47"
            label="Number of days"
            name="value"
            rules={[
              {
                required: true,
                message: Content.enter_value,
              },
            ]}
          >
            <InputNumberX
              payment
              min={1}
              type="number"
              className="Input_Num"
              placeholder="Enter Number of days"
              onBlur={() => {
                if (!form.getFieldValue("value")) form.setFieldValue("value", 0);
                else form.setFieldValue("value", parseFloat(form.getFieldValue("value") as string));
              }}
              onChange={(e) => {
                const check = e.target.value;
                const rate = parseFloat(check) > 100 ? 100 : check;
                form.setFieldValue("value", rate);
              }}
            />
          </Form.Item>
        </div>
      </>
      <div className="button_flexbox  flex-end">
        <Buttonx
          size="middle"
          type="default"
          btnText="Cancel"
          className="btn-form-size btn-default mr-20"
          htmlType="button"
          clickHandler={() => {
            handleToggle();
            form.resetFields();
          }}
        />
        <Buttonx
          className="btn-form-size btn-primary"
          size="middle"
          btnText="Save"
          loading={bool}
        />
      </div>
    </Form>
  );
};
