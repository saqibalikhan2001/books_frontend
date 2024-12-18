/** @format */

import { useEffect } from "react";
import { Space, Modal, Form } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { WarehouseFormProps } from "./Type";
import { AccessDenied, Buttonx, Icons, InputField, Selectx } from "app/shared";

const { FaWarehouse, FaCity, AiOutlinePhone, AiOutlineMail } = Icons;

const initialState = {
  name: "",
  state: "",
  city: "",
  address: "",
  zip_code: "",
  phone: "",
  country_id: null,
};

export const WarehouseForm = ({
  bool,
  toggle,
  current,
  loading,
  onSubmit,
  ctry_list,
  has_permission,
}: WarehouseFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (current && Object.keys(current).length) form.setFieldsValue({ ...current });
  }, [current, form]);

  const handleClose = () => {
    form.resetFields();
  };

  return (
    <Modal
      title={`${current?.name ? Labels.EDIT : Labels.CREATE} ${Labels._WAREHOUSE}`}
      style={{ top: 0 }}
      open={bool}
      onCancel={toggle}
      maskClosable={false}
      destroyOnClose
      footer={null}
      afterClose={handleClose}
    >
      {has_permission ? (
        <Form name="new-warehouse" initialValues={initialState} form={form} onFinish={onSubmit}>
          <InputField
            size="middle"
            name="name"
            label=""
            LeftIcon={<FaWarehouse />}
            rules={rules({ message: Content.enter_name })}
            placeholder={Content.enter_your_name}
          />
          <InputField
            name="email"
            label=""
            // rules={rules({ name: "email" })}
            LeftIcon={<AiOutlineMail />}
            placeholder="Email"
          />
          <Selectx
            label=""
            name="country_id"
            popupClassName="overlap item_dropdown"
            rules={rules({ message: Content.enter_country_name })}
            placeholder="Country Name"
            options={ctry_list}
          />
          <InputField
            size="middle"
            label=""
            name="state"
            rules={[]}
            LeftIcon={<FaCity />}
            placeholder="State Name"
          />
          <InputField
            size="middle"
            label=""
            name="city"
            rules={[]}
            LeftIcon={<FaCity />}
            placeholder="City Name"
          />
          <InputField
            size="middle"
            label=""
            name="address"
            rules={[]}
            LeftIcon={<FaCity />}
            placeholder="Address"
          />
          <InputField size="middle" label="" name="zip_code" rules={[]} placeholder="Zip Code" />
          <InputField
            size="middle"
            label=""
            name="phone"
            rules={[]}
            LeftIcon={<AiOutlinePhone />}
            placeholder="Phone"
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
