/** @format */

import { useEffect, useState } from "react";
import { Dropdown, Form, Input, Statistic, Typography } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { useAxios, useStore } from "app/Hooks";
import { BillPaymentFormProps } from "./Types";
import { Buttonx, DatePickerx, InputField, InputNumberX, Selectx, Spinner } from "app/shared";
import { Content } from "static";

const { TextArea } = Input;
const todayDate = dayjs(new Date());
const initialState = {
  note: "",
  reference: "",
  payment_made: null,
  payment_mode: null,
  payment_date: todayDate,
};

export const BillPaymentForm = ({
  url,
  onSubmit,
  toggleModal,
  loading,
  showModal,
}: BillPaymentFormProps) => {
  const [form] = Form.useForm();
  const { callAxios, bool } = useAxios();
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState<any>();
  const [paymentModes, setPaymentModes] = useState([]);
  const payment_made = Form.useWatch("payment_made", form) || 0;
  const reference = Form.useWatch("reference", form);

  useEffect(() => {
    callAxios({ url: url }).then((res) => {
      if (res?.payment_details) {
        setDetails(res);
        setPaymentModes(res?.payment_methods);
        form.setFieldsValue({
          ...res?.payment_details,
          payment_no: res?.payment_no,
          supplier: res?.payment_details?.display_name,
          payment_mode: res?.payment_methods[0]?.value,
          total: res?.payment_details?.total?.toFixed(2),
          balance_due: res?.payment_details?.balance_due?.toFixed(2),
          payment_made: res?.payment_details?.balance_due?.toFixed(2),
        });
        setLoader(false);
      }
    });
  }, [url, loader]);
  const disabledDate = (current) => {
    return current && current < dayjs(details?.payment_details?.bill_date);
  };

  const saveButtons: any[] = [
    {
      key: "1",
      label: "Save and Email",
      onClick: () =>
        onSubmit({
          ...form.getFieldsValue(),
          saveAs: "email",
        }),
    },
    {
      key: "2",
      label: "Save and new",
      hidden: payment_made == details?.payment_details?.balance_due,
      onClick: () => {
        onSubmit({
          ...form.getFieldsValue(),
          saveAs: "new",
        }),
          setLoader(!loader);
      },
    },
    {
      key: "3",
      label: "Save and print",
      onClick: () =>
        onSubmit({
          ...form.getFieldsValue(),
          saveAs: "print",
        }),
    },
  ].filter((col) => !col.hidden);

  const validateCondition =
    reference?.length > 50
      ? true
      : parseFloat(payment_made) > 0 &&
        parseFloat(payment_made) <= parseFloat(details?.payment_details?.balance_due)
      ? false
      : true;

  const validatePayment = () =>
    validateCondition
      ? Promise.reject(
          `Amount must be greater than 0 and less than ${details?.payment_details?.balance_due}`
        )
      : Promise.resolve();
  return (
    <>
      {loader || bool ? (
        <Spinner />
      ) : (
        <div className="main_wrapper mx-0">
          <div className="form_box generic_modal receive_payment_modal new_bill_payment_modal">
            <Form
              form={form}
              layout="vertical"
              autoComplete="off"
              onFinish={onSubmit}
              initialValues={initialState}
              name="payement-received-form"
            >
              <div className="">
                <div className="d-flex justify-content-between res-f--wrap">
                  <div className="flexbox form-row-container justify-content-between">
                    <div className="form_group flex-new mb-30">
                      <InputField
                        disabled
                        size="middle"
                        name="supplier"
                        label="Supplier"
                        className=" form_reference"
                      />
                    </div>
                    <div className="form_group flex-new mb-30">
                      <InputField
                        disabled
                        size="middle"
                        name="payment_no"
                        label="Payment number"
                        className="form_reference"
                      />
                    </div>
                    <div className="form_group flex-new mb-30">
                      <DatePickerx
                        isRequired
                        inputReadOnly
                        allowClear={false}
                        name="payment_date"
                        format={org_date_format}
                        popupClassName="overlap"
                        disableDate={disabledDate}
                        label={"Payment date"}
                      />
                    </div>
                    <div className="form_group flex-new mb-30">
                      <Selectx
                        required
                        valueLabel
                        size="large"
                        allowClear={false}
                        name="payment_mode"
                        options={paymentModes}
                        label="Payment method"
                        popupClassName="overlap"
                        placeholder="Select payment method"
                        className="select_box dropdown--scroll"
                        rules={rules({ message: Content.select_payment_method })}
                      />
                    </div>
                    <div className="form_group flex-new ">
                      <InputField
                        form={form}
                        size="middle"
                        name="reference"
                        label="Reference number"
                        placeholder="Enter reference number"
                        className=" form_reference"
                        rules={[
                          { message: "No more than 50 Characters.", max: 50, type: "string" },
                        ]}
                      />
                    </div>
                    <div className="form_group flex-new  receive_payment_text_area ">
                      <Form.Item label="Notes" name="note" className="flex_root notes-label">
                        <TextArea
                          rows={4}
                          showCount
                          maxLength={1000}
                          onChange={(e: any) => {
                            const value = e.target.value;
                            const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                            form.setFieldValue("note", formattedValue);
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="bill_box modal_bill--detail">
                    <div className="final_payment">
                      <Typography className="text-left mb-20 bill_paid_form" aria-level={5}>
                        {details?.payment_details?.bill_no}
                      </Typography>
                      <div className="d-flex flex-column text-right bill_amount_paid mb-15">
                        <Typography.Title className="text-left flex-shrink-0" level={5} style={{}}>
                          Amount paid
                        </Typography.Title>
                        <Statistic
                          precision={2}
                          className={`no-space ${showModal ? "truncate_amount" : ""}`}
                          value={payment_made}
                          prefix={details?.base_currency?.symbol}
                        />
                      </div>
                      <div className="d-flex align-center justify_between mb-10">
                        <Typography.Title level={5} className="flex-shrink-0">
                          Open balance
                        </Typography.Title>
                        <Statistic
                          className={`no-space opening-balance ${
                            showModal ? "truncate_amount" : ""
                          }`}
                          value={details?.payment_details?.balance_due}
                          prefix={details?.base_currency?.symbol}
                          precision={2}
                        />
                      </div>
                      <div className="d-flex align-center justify_between mb-5">
                        <Form.Item
                          name="payment_made"
                          label={
                            <label>
                              Amount paid<span className="staric">*</span>
                            </label>
                          }
                          className="shipping_inputbox"
                          rules={[
                            // { required: true, message: Content.select_amount },
                            { validator: validatePayment },
                          ]}
                        >
                          <InputNumberX
                            min={0}
                            step="0.01"
                            size="large"
                            type="number"
                            maxLength={10}
                            allowDecimal
                            value={payment_made}
                            className="no-border mb-30 no-transition"
                            style={{ marginBottom: 0 }}
                            prefix={<span>{details?.base_currency?.symbol}</span>}
                            onBlur={() =>
                              form.setFieldValue(
                                "payment_made",
                                parseFloat(payment_made).toFixed(2)
                              )
                            }
                            onChange={(e) => {
                              const check = e.target.value;
                              const adjustment_length =
                                check.length <= 10 ? check : check.slice(0, 10);
                              form.setFieldValue("payment_made", adjustment_length);
                            }}
                          />
                        </Form.Item>
                      </div>
                      <div className="d-flex align-center justify_between credit_amount">
                        <Typography.Title level={5}>Balance due</Typography.Title>
                        <Statistic
                          precision={2}
                          className="no-space"
                          prefix={details?.base_currency?.symbol}
                          value={details?.payment_details?.balance_due - payment_made}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="button_flexbox flex-end mt-40">
                  <Buttonx
                    type="default"
                    btnText="Cancel"
                    htmlType="button"
                    clickHandler={toggleModal}
                    className="btn-default btn-form-size mr-20 mb-40 "
                  />
                  <div className="d-flex align-center new_prod_btn">
                    <Buttonx
                      className="btn-primary btn-form-size  mb-40"
                      block
                      btnText="Save"
                      loading={loading}
                      disabled={validateCondition}
                    />
                    <Dropdown
                      placement="topRight"
                      trigger={["click"]}
                      className="h-36px p-5  mb-40"
                      // overlayClassName="dropdown-alignment-generic"
                      disabled={validateCondition}
                      menu={{ items: saveButtons }}
                      overlayClassName="overlap"
                    >
                      <span
                        className={`generic-dropdown-icon ${
                          validateCondition ? "disabled-svg" : "bg-blue cursor"
                        }`}
                      >
                        <img
                          alt="arrow icon"
                          className="rotate-180deg"
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/dropdown.svg`}
                        />
                      </span>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
