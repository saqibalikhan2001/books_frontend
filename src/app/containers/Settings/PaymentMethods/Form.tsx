/** @format */

import { useEffect } from "react";
import { Form, Modal, Space } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { PaymentMethodFormProps, ModalProps } from "./Types";
import { AccessDenied, Buttonx, Icons, InputField } from "app/shared";

const { AiOutlineUser } = Icons;

const initialState = {
  name: "",
};

const Modalx = ({ toggle, visible, loading, onSubmit, current, has_permission }: ModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (current && Object.keys(current).length)
      form.setFieldsValue({
        ...current,
      });
  }, [current, form]);

  const handleClose = () => form.resetFields();

  return (
    <Modal
      title={`${current?.name ? Labels.UPDATE : Labels.CREATE} ${Labels._PAYMENT_METHOD}`}
      footer={null}
      destroyOnClose
      open={visible}
      onCancel={toggle}
      style={{ top: 0 }}
      maskClosable={false}
      afterClose={handleClose}
    >
      {has_permission ? (
        <Form
          name={`${Labels.ENTER}-${Labels._PAYMENT_METHOD}`}
          initialValues={initialState}
          form={form}
          layout="vertical"
          onFinish={onSubmit}
        >
          <InputField
            size="middle"
            name="name"
            LeftIcon={<AiOutlineUser />}
            placeholder={`${Labels.ENTER} ${Labels.NAME}`}
            label={`${Labels._PAYMENT_METHOD} ${Labels.NAME}`}
            rules={rules({ message: Content.enter_payment_method_name })}
          />
          <Space className="steps-action">
            <Buttonx
              type="default"
              htmlType="button"
              clickHandler={toggle}
              btnText={Labels.CANCEL}
            />
            <Buttonx
              block
              loading={loading}
              style={{ width: "120px" }}
              btnText={current?.name ? Labels.UPDATE : Labels.CREATE}
            />
          </Space>
        </Form>
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};

export const PaymentMethodForm = ({
  bool,
  toggle,
  current,
  loading,
  onSubmit,
  has_permission,
}: PaymentMethodFormProps) => {
  return (
    <>
      <Modalx
        visible={bool}
        toggle={toggle}
        loading={loading}
        current={current}
        onSubmit={onSubmit}
        has_permission={has_permission}
      />
    </>
  );
};
