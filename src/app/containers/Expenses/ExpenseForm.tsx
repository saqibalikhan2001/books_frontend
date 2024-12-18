/** @format */
import type { InputRef } from "antd";
import { Checkbox, Form, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useCreateFormApi, useStore, useTimeZone } from "app/Hooks";
import { Buttonx, DatePickerx, InputField, Selectx } from "app/shared";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Content, routeNames } from "static";
import { rules } from "utils";
import { getTaxPrice } from "utils/calculation";
import { ExpenseDetail } from "./Itemize";
import { ExpenseFormProps } from "./Types";

const { EXPENSE } = routeNames;

const ExpenseForm = ({ loading, url, onSubmit }: ExpenseFormProps) => {
  // const dateRef = useRef<any>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { org_date_format, TimeZone } = useStore();
  const { dateWithOrgTZ } = useTimeZone(`${TimeZone}`);
  const todayDate = dayjs(dateWithOrgTZ(dayjs(new Date())));
  const { details, customers, vendors } = useCreateFormApi(url, true);
  const categoryRef = useRef<InputRef>(null);
  const amountRef = useRef<InputRef>(null);

  const tax_id = Form.useWatch("tax_id", form);
  const amount = Form.useWatch("total_amount", form);
  const tax_inclusive = Form.useWatch("tax_inclusive", form);
  const { base_currency } = details;

  const initialValues = {
    date: todayDate,
    tax_id: "",
    tag_id: "",
    report_id: "",
    itemize: false,
    billable: false,
    description: "",
    ref_number: null,
    merchant_id: null,
    currency_id: null,
    total_amount: null,
    tax_inclusive: false,
    payment_mode_id: null,
    paid_through_id: null,
    claim_reimbursement: true,
    expense_details: [
      {
        category_id: null,
        description: "",
        tax_id: "",
        amount: null,
        tag_id: "",
      },
      {
        category_id: null,
        description: "",
        tax_id: "",
        amount: null,
        tag_id: "",
      },
    ],
    tax_type: "exclusive",
    total_expense: "",
  };
  const handleNavigate = () => {
    navigate(EXPENSE);
  };

  useEffect(() => {
    if (details && details.expense) {
      const FormatedData = DataFormetFun(details.expense);
      form.setFieldsValue(FormatedData);
    } else {
      form.setFieldValue("currency_id", base_currency?.id);
    }
  }, [details, form, details.currencies]);

  const DataFormetFun = (data: any) => {
    let expense_tags: never[] = [];
    let expense_details: never[] = [];
    let FormatedData = {
      ...data,
      date: dayjs(data?.date),
      itemize: data?.itemize === 0 ? false : true,
      billable: data?.billable === 0 ? false : true,
      is_personal: data?.is_personal === 0 ? false : true,
      claim_reimbursement: data?.claim_reimbursement === 0 ? false : true,
      total_amount: data?.amount,
    };
    if (data?.itemize !== 0) {
      expense_details = data?.expense_details.map((detail) => {
        let expense_tags = [];
        expense_tags = detail?.expense_tags?.map((tag) => {
          return tag.tag_details_id;
        });
        return {
          ...detail,
          expense_tags,
        };
      });
    } else {
      if (data?.expense_tags?.length > 0) {
        expense_tags = data?.expense_tags?.map((tag) => {
          return tag.tag_details_id;
        });
      }
    }

    return {
      ...FormatedData,
      expense_details,
      expense_tags,
    };
  };
  const handleErrorSubmit = (err) => {
    if (err.errorFields.length) {
      if (amountRef.current !== null && err.values.total_amount === null) {
        amountRef.current.focus();
      } else if (categoryRef.current !== null && err.values.category_id === undefined) {
        categoryRef.current.focus();
      }
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        name="expense-form"
        onFinish={onSubmit}
        requiredMark={false}
        initialValues={initialValues}
        onFinishFailed={handleErrorSubmit}
      >
        <div className="d-flex justify_between" style={{ marginLeft: 50, marginRight: 50 }}>
          {/* <div style={{ width: "30%" }}>
            <Form.Item style={{ width: "350px", margin: "0 auto" }}>
              <Form.Item noStyle name="dragger" valuePropName="fileList">
                <Upload.Dragger disabled name="files" action="/upload.do">
                  <p className="ant-upload-drag-icon">
                    <AiOutlineInbox size={25} />
                  </p>
                  <p className="ant-upload-text">Click here to Upload File</p>
                  <p className="ant-upload-hint">Browse File/ Drag here</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </div> */}

          <div style={{ width: "65%" }}>
            <DatePickerx
              name="date"
              isRequired
              allowClear={false}
              label={"Expense Date"}
              disableDate={(current: any) => {
                return current && current.valueOf() > Date.now();
              }}
              format={org_date_format}
            />

            {!Form.useWatch("itemize", form) && (
              <Selectx
                required
                label="Expense Account"
                showSearch={false}
                name="category_id"
                className="flex_root"
                innerRef={categoryRef}
                placeholder="Select Category"
                options={details?.expense_categories}
                rules={rules({ message: Content.select_category })}
              />
            )}
            <div>
              <div>
                <Form.Item name="itemize" valuePropName="checked">
                  <Checkbox>Itemize</Checkbox>
                </Form.Item>
              </div>
            </div>

            <div>
              {!Form.useWatch("itemize", form) ? (
                <InputField
                  required
                  label="Amount"
                  name="total_amount"
                  innerRef={amountRef}
                  rules={rules({ message: Content.select_amount })}
                  addonBefore={
                    <Selectx
                      currency
                      disabled
                      size="small"
                      showSearch={false}
                      allowClear={false}
                      name="currency_id"
                      style={{ width: "50%" }}
                      placeholder="Select Currency"
                      options={details?.currencies}
                      rules={rules({ message: Content.enter_base_currency })}
                    />
                  }
                />
              ) : (
                <Selectx
                  required
                  label="Currency"
                  name="currency_id"
                  className="flex_root"
                  placeholder="Select Currency"
                  options={details?.currencies}
                  rules={rules({ message: Content.enter_base_currency })}
                />
              )}
            </div>
            {!Form.useWatch("itemize", form) && (
              <Selectx size="large" name="tax_id" label="Tax" options={details?.taxes} />
            )}
            {!Form.useWatch("itemize", form) && (
              <Typography.Text type="secondary">{`Tax Amount = ${getTaxPrice(
                tax_id,
                details.taxes,
                amount,
                tax_inclusive,
                base_currency?.symbol
              )}`}</Typography.Text>
            )}

            <Selectx
              placeholder="Select"
              className="flex_root"
              label="Payment through"
              name="payment_through_id"
              options={details?.paid_through_accounts}
            />

            <Selectx
              label="Vendor"
              name="vendor_id"
              options={vendors}
              className="flex_root"
              placeholder="Select Vendor"
            />

            <InputField
              size="middle"
              name="ref_number"
              label="Reference#"
              placeholder="Enter Reference#"
            />

            {!Form.useWatch("itemize", form) && (
              //for future use

              // <InputField
              //   size="large"
              //   name="description"
              //   label="Description"
              //   placeholder="Enter Description"
              // />
              <Form.Item
                className="flex_root"
                name="terms_and_condition"
                label={<span className="form--label_style mb-5">Description</span>}
              >
                <TextArea
                  rows={4}
                  showCount
                  maxLength={1000}
                  placeholder="Enter Description"
                  onChange={(e: any) => {
                    const { value } = e.target;
                    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                    form.setFieldValue("terms_and_condition", formattedValue);
                  }}
                />
              </Form.Item>
            )}

            <Selectx
              label="Customer"
              name="customer_id"
              options={customers}
              className="flex_root"
              placeholder="Select Customer"
            />

            {Form.useWatch("itemize", form) && (
              <ExpenseDetail
                form={form}
                tags={details.tags}
                taxes={details.taxes}
                categories={details.expense_categories}
              />
            )}

            <Selectx
              placeholder="Select"
              className="flex_root"
              label="Payment mode"
              name="payment_mode_id"
              options={details?.payment_mode}
            />

            {/* <CheckBox name="tax_inclusive" disabled label="Tax Inclusive" /> */}

            {!Form.useWatch("itemize", form) &&
              details.tags?.map((tag: any, index: number) => {
                return (
                  <>
                    <Selectx
                      label={tag.name}
                      className="flex_root"
                      placeholder="Select Tags"
                      options={tag.tag_details}
                      name={[`expense_tags`, `${index}`]}
                      rules={tag.mandatory ? rules({ message: `${tag.name} is required` }) : []}
                    />
                  </>
                );
              })}
          </div>
        </div>
        <Space style={{ paddingLeft: "30px" }}>
          <Buttonx btnText="Save" loading={loading} />
          <div className="note_cancel_btn">
            <Buttonx
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={handleNavigate}
            />
          </div>
        </Space>
      </Form>
    </>
  );
};

export default ExpenseForm;
