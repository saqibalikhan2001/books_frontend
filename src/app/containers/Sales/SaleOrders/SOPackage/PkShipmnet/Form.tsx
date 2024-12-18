/**@format */

import { useEffect } from "react";
import {  Col, Divider, Form, Input, InputNumber, Row, Space } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { Labels } from "static";
import { useCreateFormApi } from "app/Hooks";
import { AutoCompletex, Buttonx, DatePickerx, InputField } from "app/shared";

const todayDate = dayjs(new Date());

const initialState = {
  package_no: "",
  shipmentNo: "",
  shipment_date: todayDate,
  carrier: null,
  tracking_no: "",
  shipping_charge: "",
  note: "",
};

export const ShipmentForm = ({ onSubmit, toggleModal, url }: any) => {
  const { details } = useCreateFormApi(url);

  useEffect(() => {
    if (details && Object.keys(details).length) {
      form.setFieldsValue({
        ...details,
        ...details?.package,
      });
    }
    //eslint-disable-next-line
  }, [details]);
  const [form] = Form.useForm();
  return (
    <Form
      name="shipment-form"
      autoComplete="off"
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={initialState}
    >
      <Row>
        <Col offset={1}>
          <InputField name="package_no" label={Labels.PACKAGE_NO} size="middle" disabled />
          <InputField name="shipmentNo" label="Shipment Order No." size="middle" />
          <DatePickerx isRequired name="shipment_date" label="Shipment Date" />
        </Col>
        <Col offset={1}>
          {/* <Form.Item
            name="carrier"
            label="Carrier"
            rules={rules({ message: "carrier is required" })}
            className="flex_root"
          > */}
          <AutoCompletex
            showArrow
            options={[]}
            name="carrier"
            label="Carrier"
            placeholder="Select Carrier"
            rules={rules({ message: "carrier is required" })}
          // getPopupContainer={(trigger) => trigger.parentElement}
          // suffixIcon={
          //   <img
          //     src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/dropdown.svg"
          //     alt="dropdown icon"
          //   />
          // }
          />
          {/* </Form.Item> */}
          <InputField
            size="middle"
            name="tracking_no"
            label="Tracking No."
            className="mb flex_root"
          />
          <Form.Item label="Shipping Charges" name="shipping_charge" colon={false}>
            <InputNumber name="shipping_charge" addonAfter="$" min={0} placeholder="$0.00" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12} offset={1}>
          <Form.Item label="Notes" name="note" className="flex_root">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Divider />
        <Col offset={1}>
          <Space className="steps-action">
            <Buttonx size="middle" btnText="Save" loading={false} />
            <Buttonx
              size="middle"
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={toggleModal}
            />
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
