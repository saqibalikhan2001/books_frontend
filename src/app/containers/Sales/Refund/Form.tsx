/**@format */

import { useEffect, useState } from "react";
import { Form, Input, Typography, Statistic } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { Content, Labels } from "static";
import { RefundFormProps } from "./Types";
import { useCreateFormApi, useStore, useTimeZone } from "app/Hooks";
import { Buttonx, DatePickerx, InputField, InputNumberX, Selectx, Spinner } from "app/shared";

const { TextArea } = Input;
const { Text } = Typography;

export const RefundForm = ({
  url,
  loading,
  onSubmit,
  PRdetail,
  toggleModal,
  moduleendpoint,
}: RefundFormProps) => {
  const [form] = Form.useForm();
  const [value, setValue] = useState<any>();
  const [isLoading, setisLoading] = useState(true);
  const { org_date_format, TimeZone } = useStore();
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const { paymentMethods, transaction_no, refunded_amount, currency, formLoading } =
    useCreateFormApi(url, true);
  const payment = moduleendpoint ? true : false;
  const Detail = PRdetail?.creditNote || PRdetail;
  const Balance = PRdetail?.creditNote?.balance || PRdetail?.unused_amount;
  const initialState = {
    note: "",
    reference: "",
    refund_credits: 0,
    refund_mode: null,
    refund_date: todayDate,
  };

  const refund_credits = Form.useWatch("refund_credits", form);
  useEffect(() => {
    if (Detail && Object.keys(Detail).length) {
      payment
        ? form.setFieldsValue({
            ...Detail,
            amount: 0,
            refund_credits: 0,
            type: Detail?.type,
            refund_date: todayDate,
            advance_payment_id: Detail?.id,
            refund_mode: paymentMethods?.[0]?.value,
          })
        : form.setFieldsValue({
            ...Detail,
            refund_credits: 0,
            refund_date: todayDate,
            refund_mode: paymentMethods?.[0]?.value,
            credit_note_no: Detail?.credit_notes_no,
          });
      setValue(Balance);
      setisLoading(false);
    }
    //eslint-disable-next-line
  }, [Detail, paymentMethods, Detail?.id]);

  const handleNote = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    form.setFieldValue("note", formattedValue);
  };

  return (
    <>
      {isLoading || formLoading ? (
        <Spinner />
      ) : (
        <Form
          form={form}
          layout="vertical"
          name="refund-form"
          autoComplete="off"
          onFinish={onSubmit}
          requiredMark={false}
          initialValues={initialState}
        >
          <div className="_container px-30 refund-form">
            <div className="flexbox justify-content-between">
              <div className="form_group flex-47 brder-color">
                <div className="d-flex credit_info">
                  <div>
                    <Typography.Title level={5}>
                      {payment ? Labels.PAYMENT_NO : Labels.CREDIT_NOTE}:
                    </Typography.Title>
                  </div>
                  <Text>#{transaction_no}</Text>
                </div>
              </div>
              <div className="form_group flex-47">
                <div className="d-flex flex-end credit_info">
                  <div>
                    <Typography.Title level={5}>Refunded Amount:</Typography.Title>
                  </div>
                  <Statistic
                    precision={2}
                    className="no-space"
                    value={refunded_amount}
                    prefix={currency?.symbol}
                    valueStyle={{ fontSize: "14px", display: "flex" }}
                  />
                </div>
              </div>
              <div className="form_group flex-47 brder-color">
                <DatePickerx
                  isRequired
                  size="large"
                  inputReadOnly
                  label={"Date"}
                  name="refund_date"
                  allowClear={false}
                  popupClassName="overlap"
                  format={org_date_format}
                  disableDate={(current) => current && current < dayjs(todayDate).startOf("day")}
                />
              </div>
              <div className="form_group flex-47 brder-color">
                <Selectx
                  required
                  valueLabel
                  size="large"
                  name="refund_mode"
                  allowClear={false}
                  label={"Payment method"}
                  options={paymentMethods}
                  popupClassName={"overlap"}
                  placeholder="Select payment method"
                  className="select_box dropdown--scroll"
                  rules={rules({ message: Content.select_payment_method })}
                />
              </div>
              <div className="form_group flex-47 brder-color ">
                <InputField
                  form={form}
                  size="large"
                  name="reference"
                  label={Labels.REFERENCE_NO}
                  placeholder="Enter reference number "
                  className="input_field reference_number"
                  rules={[{ message: "No more than 50 Characters.", max: 50, type: "string" }]}
                />
              </div>
              <div className="form_group flex-47  brder-color">
                <Form.Item
                  className="flex_root mb-10"
                  name="note"
                  label={<span className="form--label_style">{Labels.DESCRIPTION}</span>}
                >
                  <TextArea
                    showCount
                    rows={4}
                    maxLength={255}
                    onChange={handleNote}
                    placeholder="Add description"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="refund-popup-bottom bill_box">
              <div className="final_payment">
                <div className="d-flex align-center justify_between ">
                  <div className="d-flex align-center">
                    <Typography.Title level={5}>Available credits</Typography.Title>
                  </div>
                  <Statistic
                    precision={2}
                    className="no-space"
                    value={Balance || 0}
                    prefix={currency?.symbol}
                    valueStyle={{ fontSize: "14px", display: "flex" }}
                  />
                </div>
                <div className="d-flex align-center mb-10 justify_between">
                  <Form.Item
                    name="refund_credits"
                    colon={false}
                    className="shipping_inputbox"
                    label={<Typography.Title level={5}>Refund</Typography.Title>}
                  >
                    <InputNumberX
                      min={0}
                      step="0.01"
                      type="number"
                      allowDecimal
                      value={refund_credits}
                      className="text-right no-transition"
                      prefix={<span>{currency?.symbol}</span>}
                      onBlur={() => {
                        if (refund_credits > Balance)
                          form.setFieldValue("refund_credits", parseFloat(Balance).toFixed(2));
                        else if (!refund_credits) form.setFieldValue("refund_credits", 0);
                        else
                          form.setFieldValue(
                            "refund_credits",
                            parseFloat(refund_credits as string).toFixed(2)
                          );
                      }}
                      onChange={(value) => {
                        const check = value;
                        let refund_credits_length = check.length <= 10 ? check : check.slice(0, 10);
                        if (refund_credits_length > Balance) {
                          refund_credits_length = Balance;
                          const values = Balance - (refund_credits_length as any);
                          setValue(values);
                        } else {
                          const values = Balance - (refund_credits_length as any);

                          setValue(values);
                        }
                        form.setFieldValue("refund_credits", refund_credits_length);
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="d-flex align-center credit_amount justify_between">
                  <div className="d-flex align-center">
                    <Typography.Title level={5}>Remaining credits</Typography.Title>
                  </div>
                  <Text>
                    {currency?.symbol}
                    {value?.toFixed(2)}
                  </Text>
                </div>
              </div>
            </div>
            <div className="button_flexbox flex-end ">
              <Buttonx
                type="default"
                btnText="Cancel"
                htmlType="button"
                clickHandler={toggleModal}
                className="btn-default btn-form-size cate_cancel_btn mr-20 mb-20"
              />
              <div className="d-flex align-center new_prod_btn">
                <Buttonx
                  block
                  loading={loading}
                  btnText={Labels.SAVE}
                  disabled={refund_credits == 0 || refund_credits > Balance}
                  className={`btn-primary btn-form-size mb-20 ${
                    refund_credits == 0 || refund_credits > Balance ? "disabled-save-btn" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </Form>
      )}
    </>
  );
};
