import { useEffect, useState } from "react";
import { Typography } from "antd";
import { InputField, Selectx } from "app/shared";
import { useGetPaymentTermsQuery } from "store/query/paymentTerm";
import { CreatePaymentTerm } from "app/containers/Settings/Preferences/PaymentTerm/Create";

export const Payments = ({ paymentMode, supplier, isModal = false, form }: any) => {
  const [paymentModal, setPaymentModal] = useState(false);
  const togglePaymentModal = () => setPaymentModal(!paymentModal);
  const { data: terms = [], refetch } = useGetPaymentTermsQuery("");
  useEffect(()=>{
    refetch()
  },[])
  return (
    <>
      <CreatePaymentTerm
        paymentModal={paymentModal}
        handleToggle={togglePaymentModal}
        refetch={refetch}
        setPaymentData={(data) => {
          form.setFieldValue("payment_terms", {
            id: data?.id,
            label: data?.name,
            value: data?.value,
            name: data?.name,
          });
        }}
      />
      <Typography.Title level={4} className="h4  form_heading">
        {`Payment ${supplier ? "and Billing" : ""}`}
      </Typography.Title>
      <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-47">
            <Selectx
              size="large"
              options={paymentMode}
              name="payment_mode_id"
              label={"Primary payment method"}
              className="input_field dropdown--scroll"
              placeholder="Select primary payment method"
              popupClassName={isModal ? "overlap" : "scroll_visible"}
              // rules={rules({ message: "Country Required" })}
            />
          </div>
          <div className="form_group flex-47 input_generic_add_btn">
            <Selectx
              showButton
              size="large"
              options={terms}
              label={"Terms"}
              name="payment_terms"
              placeholder="Select terms"
              handleAddNew={togglePaymentModal}
              className="input_field dropdown--scroll"
              popupClassName={isModal ? "overlap" : "scroll_visible"}
              // rules={rules({ message: "Country Required" })}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              name="account_no"
              label={"Account no."}
              className="input_field"
              placeholder="Enter account no."
              rules={[{ message: "No more than 100 Characters.", max: 100, type: "string" }]}
            />
          </div>
          {supplier && (
            <div className="form_group flex-47">
              <InputField
                form={form}
                size="middle"
                className="input_field"
                name="billing_per_hour"
                placeholder="Enter billing rate per hour"
                label={<label>Billing rate per hour</label>}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
