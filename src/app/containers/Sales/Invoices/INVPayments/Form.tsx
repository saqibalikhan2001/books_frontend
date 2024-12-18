/**@format */

import { useEffect, useState } from "react";
import { Form, Input } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { useCreateFormApi, useStore } from "app/Hooks";
import { InvoicePaymentFormProps } from "./Types";
import { Buttonx, DatePickerx, InputField, Spinner, Selectx, InputNumberX } from "app/shared";
import { Content } from "static";

const todayDate = dayjs(new Date());

const initialState = {
  note: "",
  reference: "",
  payment_no: null,
  payment_made: null,
  payment_mode: null,
  payment_date: todayDate,
};

export const InvoicePaymentForm = ({
  url,
  loading,
  onSubmit,
  toggleModal,
}: InvoicePaymentFormProps) => {
  const [form] = Form.useForm();
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { details, paymentModes } = useCreateFormApi(url);
  const payment_made = Form.useWatch("payment_made", form) || 0;

  useEffect(() => {
    if (details?.invoice && Object.keys(details?.invoice).length) {
      form.setFieldsValue({
        ...details?.invoice,
        payment_mode: details.payment_methods[0]?.value,
        payment_made: details?.invoice?.payment_due?.toFixed(2),
        payment_date: todayDate,
        total: details?.invoice?.total?.toFixed(2),
        payment_due: details?.invoice?.payment_due?.toFixed(2),
      });
      setLoader(false);
    }
    //eslint-disable-next-line
  }, [details?.invoice]);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs(details?.invoice?.invoice_date);
  };
  const handleNotes = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue("note", formattedValue);
  };

  const validateCondition = () => {
    if (payment_made === "") {
      setIsButtonDisabled(true);
      return "Please enter an amount";
    } else if (parseFloat(payment_made) <= 0) {
      setIsButtonDisabled(true);
      return "Payment received must be greater than 0";
    }
    setIsButtonDisabled(false);
    return null;
  };

  const validatePayment = () => {
    const errorMessage = validateCondition();
    if (errorMessage) {
      return Promise.reject(errorMessage);
    }
    return Promise.resolve();
  };
  return (
    <>
      {loader ? (
        <Spinner directionSize={"49vh"} />
      ) : (
        <div className="main_wrapper mx-0">
          <div className="generic_modal receive_payment_modal ">
            <Form
              requiredMark={false}
              name="payement-received-form"
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onSubmit}
              initialValues={initialState}
            >
              <div className="flexbox justify-content-between mt-18">
                <div className="form_group flex-47 ">
                  <Form.Item name="total" label={<span className="form--label_style">Amount</span>}>
                    <Input
                      size="large"
                      disabled
                      // className="input_field"
                      type="number"
                      name="total"
                      step="0.01"
                      prefix={<span>{details?.base_currency?.symbol}</span>}
                    />
                  </Form.Item>
                </div>
                <div className="form_group flex-47 ">
                  <DatePickerx
                    inputReadOnly
                    isRequired
                    allowClear={false}
                    disableDate={disabledDate}
                    name="payment_date"
                    label="Payment date"
                    format={org_date_format}
                    popupClassName="overlap"
                  />
                </div>
                <div className="form_group flex-47 ">
                  <Form.Item
                    name="payment_due"
                    label={<span className="form--label_style">Payment due</span>}
                  >
                    <Input
                      size="large"
                      disabled
                      type="number"
                      name="adjustment"
                      // className="input_field"
                      step="0.01"
                      prefix={<span>{details?.base_currency?.symbol}</span>}
                    />
                  </Form.Item>
                </div>
                <div className="form_group flex-47 ">
                  <Selectx
                    required
                    valueLabel
                    size="large"
                    name="payment_mode"
                    allowClear={false}
                    options={paymentModes}
                    label={"Payment method"}
                    popupClassName={"overlap"}
                    placeholder="Select payment method"
                    className="select_box dropdown--scroll"
                    rules={rules({ message: Content.select_payment_method })}
                  />
                </div>
                <div className="form_group flex-47 ">
                  <Form.Item
                    name="payment_made"
                    label={
                      <span className="form--label_style">
                        Payment received <span className="staric">*</span>
                      </span>
                    }
                    rules={[{ validator: validatePayment }]}
                  >
                    <InputNumberX
                      type="number"
                      size="large"
                      min={0}
                      step="0.01"
                      allowDecimal
                      value={payment_made}
                      maxLength={10}
                      className="no-border input_field no-transition"
                      prefix={
                        <span className="currency_symbol">{details?.base_currency?.symbol}</span>
                      }
                      onBlur={() => {
                        if (payment_made > details?.invoice?.payment_due) {
                          form.setFieldValue(
                            "payment_made",
                            parseFloat(details?.invoice?.payment_due).toFixed(2)
                          );
                        } else {
                          form.setFieldValue("payment_made", parseFloat(payment_made).toFixed(2));
                        }
                      }}
                      onChange={(e) => {
                        const check = e.target.value;
                        const adjustment_length = check.length <= 10 ? check : check.slice(0, 10);
                        form.setFieldValue("payment_made", adjustment_length);
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="form_group flex-47  payment-reference">
                  <InputField
                    form={form}
                    name="reference"
                    className="input_field form_reference"
                    size="middle"
                    label="Reference"
                    rules={[{ message: "No more than 50 Characters.", max: 50, type: "string" }]}
                  />
                </div>
                <div className="form_group flex-47 receive_payment_text_area ">
                  <Form.Item
                    label={<span className="form--label_style">Customer notes</span>}
                    name="note"
                    className="flex_root"
                  >
                    <Input.TextArea showCount rows={3} maxLength={1000} onChange={handleNotes} />
                  </Form.Item>
                </div>
                {/* <Divider /> */}
                <div className="button_flexbox flex-end form-row-container res-spacing mb-30 new_prod_btn">
                  <Buttonx
                    className="btn-default btn-form-size mr-20"
                    type="default"
                    btnText="Cancel"
                    htmlType="button"
                    clickHandler={toggleModal}
                  />
                  <Buttonx
                    className={`btn-primary btn-form-size ${
                      isButtonDisabled ? "disabled-save-btn" : ""
                    }`}
                    block
                    btnText="Save"
                    //@ts-ignore
                    disabled={isButtonDisabled}
                    loading={loading}
                  />
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
