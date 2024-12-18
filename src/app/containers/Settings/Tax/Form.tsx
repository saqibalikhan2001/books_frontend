/** @format */

import { useEffect } from "react";
import { Form, Modal } from "antd";
import { rules } from "utils";
import { ModalProps } from "./Types";
import { Labels, Content } from "static";
import { AccessDenied, Buttonx, Icons, InputField, InputNumberX } from "app/shared";

const { AiOutlineUser, AiOutlinePercentage } = Icons;

const initialState = {
  name: "",
  rate: "",
  authority: "",
  // is_compound: false,
};

export const TaxForm = ({
  bool,
  toggle,
  loading,
  current,
  onSubmit,
  has_permission,
}: ModalProps) => {
  const [form] = Form.useForm();

  const handleClose = () => form.resetFields();

  useEffect(() => {
    if (current && Object.keys(current).length) form.setFieldsValue({ ...current });
  }, [current, form]);

  const handleCancel = () => {
    handleClose();
    toggle();
    form.resetFields();
  };

  return (
    <Modal
      centered
      open={bool}
      width={540}
      footer={null}
      destroyOnClose
      style={{ top: 0 }}
      maskClosable={false}
      onCancel={handleCancel}
      afterClose={handleClose}
      wrapClassName="generic_modal_style"
      title={`${current?.name ? Labels.UPDATE : Labels.ENTER} ${Labels.TAX}`}
      closeIcon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          alt="close Icon"
        />
      }
    >
      {has_permission ? (
        <div className="generic_modal tax_modal">
          <Form
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={initialState}
            name={`${Labels.ENTER}-${Labels.TAX}`}
          >
            <InputField
              required
              form={form}
              name="name"
              size="middle"
              maxLength={80}
              label={Labels.NAME}
              LeftIcon={<AiOutlineUser />}
              className="input_field no-transition"
              rules={rules({ message: Content.enter_name })}
              placeholder={`${Labels.ENTER} ${Labels.NAME}`}
            />
            <Form.Item
              required
              name="rate"
              colon={false}
              className="input_field"
              rules={rules({ message: Content.enter_rate })}
              label={
                <span className="form--label_style mb-5">
                  {Labels.RATE}
                  <span className="staric">*</span>
                </span>
              }
            >
              <InputNumberX
                min={0}
                step="0.01"
                size="middle"
                type="number"
                allowDecimal
                placeholder="Enter rate"
                className="input-40px btn-tax"
                addonAfter={<AiOutlinePercentage />}
                // value={shipping_charge}
                onBlur={() => {
                  if (!form.getFieldValue("rate")) form.setFieldValue("rate", 0.0);
                  else
                    form.setFieldValue(
                      "rate",
                      parseFloat(form.getFieldValue("rate") as string).toFixed(2)
                    );
                }}
                onChange={(e) => {
                  const check = e;
                  const rate = parseFloat(check) > 100 ? 100 : check;
                  form.setFieldValue("rate", rate);
                }}
              />
            </Form.Item>
            <InputField
              form={form}
              size="middle"
              name="authority"
              label={Labels.AUTHORITY}
              placeholder={Labels.AUTHORITY}
              className="input_field input-40px"
              rules={[{ message: "No more than 50 characters.", max: 50, type: "string" }]}
            />
            {/* <Form.Item name="is_compound" valuePropName="checked">
              <Checkbox>{Content.compound_tax}</Checkbox>
            </Form.Item> */}
            <div className="button_flexbox flex-end">
              <Buttonx
                type="default"
                htmlType="button"
                btnText={Labels.CANCEL}
                clickHandler={handleCancel}
                className="btn-form-size btn-default mr-20"
              />
              <Buttonx
                block
                loading={loading}
                className="btn-form-size btn-primary"
                btnText={current?.name ? Labels.UPDATE : Labels.CREATE}
              />
            </div>
          </Form>
        </div>
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};
