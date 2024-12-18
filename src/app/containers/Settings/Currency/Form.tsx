/** @format */

import { useEffect } from "react";
import { Space, Modal, Form } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { CurrencyFormProps } from "./Types";
import { AccessDenied, Buttonx, Icons, InputField, Selectx } from "app/shared";

const { GrCurrency, CgArrowsExchange } = Icons;
const { enter_name, enter_currency_code, enter_symbol } = Content;

const initialState = {
  name: "",
  symbol: "",
  exchange_rate: "",
  currency_code: null,
};

export const CurrencyForm = ({
  bool,
  toggle,
  loading,
  current,
  onSubmit,
  currncy_list,
  has_permission,
}: CurrencyFormProps) => {
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
      title={current?.id ? Labels.UPDATE_CURRENCY : Labels.NEW_CURRENCY}
      open={bool}
      footer={null}
      destroyOnClose
      onCancel={toggle}
      style={{ top: 0 }}
      maskClosable={false}
      afterClose={handleClose}
    >
      {has_permission ? (
        <Form
          name={Labels.NEW_CURRENCY}
          initialValues={initialState}
          form={form}
          layout="vertical"
          onFinish={onSubmit}
        >
          <InputField
            size="middle"
            name="name"
            label={Labels.NAME}
            LeftIcon={<GrCurrency />}
            disabled={Boolean(current?.name)}
            rules={rules({ message: enter_name })}
            placeholder={`${Labels.ENTER} ${Labels.NAME}`}
          />
          <Selectx
            name="currency_code"
            className="flex_root"
            options={currncy_list}
            label={Labels.CURRENCY_CODE}
            placeholder={Labels.CURRENCY_CODE}
            rules={rules({ message: enter_currency_code })}
          />
          <InputField
            size="middle"
            name="symbol"
            label={Labels.SYMBOL}
            LeftIcon={<GrCurrency />}
            placeholder={Labels.SYMBOL}
            rules={rules({ message: enter_symbol })}
          />
          <InputField
            size="middle"
            label={Labels.EXCHANGE_RATE}
            name="exchange_rate"
            rules={[]}
            LeftIcon={<CgArrowsExchange size={20} />}
            placeholder={Labels.EXCHANGE_RATE}
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
              btnText={current?.id ? Labels.UPDATE : Labels.CREATE}
            />
          </Space>
        </Form>
      ) : (
        <AccessDenied />
      )}
    </Modal>
  );
};
