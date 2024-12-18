/** @format */

import { useEffect } from "react";
import { Form } from "antd";
import { Buttonx, Spinner } from "app/shared";
import { useAxios, useStore } from "app/Hooks";
import BillingAddress from "../Customers/Address/BillingAddress";
import { AddressModalProps } from "./Types";

export const AddressModal = ({
  url,
  loading,
  onSubmit,
  setEditBill,
  bool = false,
  handleCancel,
  setCreateBill,
  setBillLoading,
  contactForm = false,
  editBill = false,
  createBill = false,
}: AddressModalProps) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const { country_id } = useStore();

  useEffect(() => {
    form.setFieldsValue({
      bill_fax: "",
      bill_city: "",
      bill_state: "",
      bill_phone: "",
      bill_street: "",
      bill_zip_code: "",
      bill_street_2: "",
      bill_attention: "",
      bill_country_id: country_id,
    });
    //eslint-disable-next-line
  }, [country_id, createBill]);

  useEffect(() => {
    if (editBill) {
      setBillLoading(true);
      callAxios({
        method: "get",
        url,
      }).then((res) => {
        form.setFieldsValue({
          bill_fax: res?.fax,
          bill_city: res?.city,
          bill_state: res?.state,
          bill_phone: res?.phone,
          bill_street: res?.street,
          bill_zip_code: res?.zip_code,
          bill_street_2: res?.street_2,
          bill_attention: res?.attention,
          bill_country_id: res?.country_id,
          address_type: res?.address_type,
        });
        setBillLoading(false);
      });
    }
    //eslint-disable-next-line
  }, [editBill, url]);

  const cancel = () => {
    handleCancel();
    setEditBill(false);
    setCreateBill(false);
    form.resetFields();
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Form form={form} onFinish={onSubmit}>
          <BillingAddress form={form} isModal contactForm={contactForm} />
          <div className="button_flexbox flex-end  px-30 control--width">
            <Buttonx
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={cancel}
              className="btn-default btn-form-size mr-20"
            />
            <Buttonx btnText="Save" loading={bool} className="btn-primary btn-form-size" />
          </div>
        </Form>
      )}
    </>
  );
};
