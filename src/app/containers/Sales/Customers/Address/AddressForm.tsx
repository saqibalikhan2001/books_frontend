/** @format */

import { Typography } from "antd";
import BillingAddress from "./BillingAddress";
import ShippingAddress from "./ShippingAddress";
import { FormInstance } from "antd/lib/form/Form";

export const AddressForm = ({
  form,
  isModal = false,
  customerForm = false,
}: {
  isModal: boolean;
  form: FormInstance;
  customerForm: boolean;
}) => {
  return (
    <>
      <Typography.Title level={4} className="h4 mb-30 form_heading">
        Addresses
      </Typography.Title>
      <BillingAddress customerForm={customerForm} isModal={isModal} form={form} />
      <ShippingAddress form={form} isModal={isModal} />
    </>
  );
};
