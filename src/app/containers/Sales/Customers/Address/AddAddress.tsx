/** @format */

import { useEffect } from "react";
import { Col, Form, Modal, Radio, Row, Space } from "antd";
import { Labels } from "static";
import { Buttonx } from "app/shared";
import BillingAddress from "./BillingAddress";
import { AddAddressProps } from "../Types";

const initialState = {
  fax: "",
  city: "",
  phone: "",
  state: "",
  street: "",
  zip_code: "",
  attention: "",
  country_id: null,
  address_type: "additional",
};

const AddAddress = ({
  bool,
  current,
  onSubmit,
  modalOpen,
  handleModal,
  handleClose,
}: AddAddressProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (current?.contact_address && Object.keys(current?.contact_address).length) {
      form.setFieldsValue({ ...current.contact_address });
    }
  }, [current?.contact_address, form, current]);

  return (
    <>
      <Modal
        width={1100}
        footer={null}
        destroyOnClose
        open={modalOpen}
        onCancel={handleModal}
        afterClose={handleClose}
        title="Add Billing/Shipping Address"
      >
        <Form
          form={form}
          name={"Address"}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={initialState}
        >
          <Row>
            <Col offset={1} span={18}>
              <Form.Item name="address_type">
                <Radio.Group>
                  <Radio value="billing" disabled>
                    Billing
                  </Radio>
                  <Radio value="shipping" disabled>
                    Shipping
                  </Radio>
                  <Radio value="additional">Additional</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <BillingAddress />
          <Space className="steps-action" style={{ paddingLeft: "10px" }}>
            <Buttonx
              type="default"
              className="btn-default btn-form-size mr-20"
              htmlType="button"
              btnText={Labels.CANCEL}
              clickHandler={handleModal}
            />
            <Buttonx
            className="btn-primary btn-form-size"
              block
              loading={bool}
              btnText={current?.contact_address?.attention ? Labels.UPDATE : Labels.CREATE}
              style={{ width: "120px" }}
            />
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default AddAddress;
