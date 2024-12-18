/** @format */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Form,
  Space,
  Input,
  Divider,
  Checkbox,
  Statistic,
  Typography,
  InputNumber,
} from "antd";
import { rules } from "utils";
import dayjs, { Dayjs } from "dayjs";
import { RecurringInvoiceFormProps } from "./Types";
import { PaymentTermModal } from "./PaymentTermModal";
import { Content, endpoints, Labels, routeNames } from "static";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { useBool, useStore, useTimeZone, useCreateFormApi } from "app/Hooks";
import { RepeatModal } from "app/containers/Purchases/RecurringBills/RepeatModal";
import { Buttonx, Selectx, ItemTable, InputField, DatePickerx, PaginateSelectX } from "app/shared";

const { TextArea } = Input;
const todayDate = dayjs(new Date());
const { RECURRING_INVOICES } = routeNames;
const { RECURRING_INVOICE_CONTACTS, RECURRING_INVOICE_ITEMS } = endpoints;

const initialState = {
  note: "",
  terms: null,
  order_no: "",
  adjustment: 0,
  profile_name: "",
  customer_id: null,
  shipping_charge: 0,
  end_date: todayDate,
  invoice_terms: null,
  never_expires: false,
  start_date: todayDate,
  sales_person_id: null,
  repeat_duration: null,
  terms_and_condition: "",
};

export const RecurringInvoiceForm = ({
  url,
  close,
  loading,
  onSubmit,
  handleTotal,
  handleItemList,
  create = false,
  isModal = false,
}: RecurringInvoiceFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { bool, toggle } = useBool(false);
  const [subTotal, setSubTotal] = useState(0);
  const { primary_organization } = useStore();
  const [itemList, setitemList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { bool: disable, setTrue, setFalse } = useBool(true);
  const { bool: repeatModal, toggle: toggleRepeatModal } = useBool(false);

  const { handleDate } = useTimeZone(primary_organization?.time_zone || "");
  const {
    taxList,
    warehouses,
    sales_person,
    repeat_duration,
    details: current,
  } = useCreateFormApi(url);

  const { data: terms = [], refetch } = useGetInvoiceTermsListQuery("");

  const term = Form.useWatch("invoice_terms", form);
  const never_expires = Form.useWatch("never_expires", form);

  const memoizeFilter = useMemo(
    () => terms.filter((val: { id: number }) => val.id === term)[0] || {},
    [terms, term]
  );

  const start_date = form.getFieldValue("start_date");
  const customDate = handleDate(memoizeFilter.value, start_date);

  const org_terms = terms.filter(({ org_id }: { org_id: number }) => org_id) || [];

  const adjustment = Form.useWatch("adjustment", form);
  const shipping_charge = Form.useWatch("shipping_charge", form);

  const handleRepeatDuration = (value: number) => {
    const repeatDuration = repeat_duration?.find((dur: { id: number }) => dur.id === value);
    form.setFieldsValue({ repeat_duration: repeatDuration });
  };

  useEffect(() => {
    if (current?.invoice_info && Object.keys(current?.invoice_info).length) {
      let repeatDuration;
      let impureString = /\d/.test(current?.invoice_info?.repeat_duration);
      if (impureString) {
        repeatDuration =
          current?.invoice_info?.repeat_duration.split(" ")[0] +
          " " +
          repeat_duration?.find(
            (dur) => dur.value === current?.invoice_info?.repeat_duration.split(" ")[1]
          )?.label;
      } else {
        repeatDuration = repeat_duration?.find(
          (dur) => dur.value === current?.invoice_info?.repeat_duration
        )?.label;
      }
      form.setFieldsValue({
        ...current.invoice_info,
        repeat_duration: repeatDuration,
        invoice_terms: current?.invoice_info?.invoice_term_id,
        never_expires: !Boolean(current?.invoice_info?.end_date),
        start_date: dayjs(current?.invoice_info?.start_date, "YYYY-MM-DD"),
        end_date: dayjs(current?.invoice_info?.end_date, "YYYY-MM-DD"),
      });
      setitemList(current?.invoice_info?.invoice_details);
      setFalse();
      // setLoader(false);
    }
    //eslint-disable-next-line
  }, [current?.invoice_info, form]);

  useEffect(() => {
    if (customDate && customDate.isValid())
      form.setFieldsValue({
        end_date: customDate,
      });
    if (never_expires) form.setFieldsValue({ end_date: null });
    else if (!never_expires && !memoizeFilter.value) form.setFieldsValue({ end_date: start_date });
    //eslint-disable-next-line
  }, [customDate, memoizeFilter, start_date]);

  useEffect(() => {
    if (create)
      form.setFieldsValue({
        invoice_terms: terms.filter((val: { name: string }) => val.name === "Net 30")[0] || {},
      });
    // eslint-disable-next-line
  }, [create, terms]);

  useEffect(() => {
    handleTotal(totalAmount);
    //eslint-disable-next-line
  }, [totalAmount]);

  const handleSubTotal = useCallback((subtotal: number) => setSubTotal(subtotal), []);

  const handleToggle = () => toggle();

  const handleDateChange = (date: Dayjs | null) => {
    form.setFieldsValue({ start_date: date });
    if (date && date > form.getFieldValue("end_date")) form.setFieldsValue({ end_date: date });
  };

  return (
    <>
      <PaymentTermModal visible={bool} toggle={toggle} refetch={refetch} org_terms={org_terms} />
      <RepeatModal
        form={form}
        visible={repeatModal}
        toggle={toggleRepeatModal}
        repeat_duration={repeat_duration}
      />
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
        name="invoice-form"
        initialValues={initialState}
      >
        <Row>
          <Col span={8} offset={1}>
            <PaginateSelectX
              setTrue={setTrue}
              name="customer_id"
              setFalse={setFalse}
              label="Customer Name"
              url={RECURRING_INVOICE_CONTACTS}
              placeholder="Select or Search Customer"
            />
          </Col>
        </Row>
        <div className={disable ? "hide" : "display"}>
          <Row>
            <Col span={6} offset={1}>
              <InputField
                size="middle"
                name="profile_name"
                className="mb flex_root"
                label={Labels.PROFILE_NAME}
                rules={rules({ message: Content.enter_profile_name })}
              />
              <Selectx
                repeat_opt
                className="flex_root"
                name="repeat_duration"
                label={Labels.REPEAT_EVERY}
                placeholder={Content.duration}
                options={repeat_duration || []}
                handleToggle={toggleRepeatModal}
                handleChange={handleRepeatDuration}
                rules={rules({ message: Content.select_repeat_duration })}
              />
            </Col>
            <Col span={6} offset={1}>
              <InputField
                size="middle"
                name="order_no"
                disabled={isModal}
                label={Labels.ORDER_NO}
                className="mb flex_root"
              />

              <Selectx
                create_opt
                name="invoice_terms"
                options={terms || []}
                className="flex_root"
                disabled={never_expires}
                handleToggle={handleToggle}
                label={Labels.PAYMENT_TERMS}
                placeholder={Content.select_terms}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={1}>
              <DatePickerx
                disableDate
                name="start_date"
                label={Labels.START_ON}
                onChange={handleDateChange}
              />
            </Col>
            <Col span={6} offset={1}>
              <DatePickerx name="end_date" label={Labels.END_DATE} disabled={never_expires} />
            </Col>
            <Col style={{ paddingTop: 35, paddingLeft: 10 }}>
              <Form.Item name="never_expires" valuePropName="checked" noStyle>
                <Checkbox>Never Expires</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={1}>
              <Selectx
                loading={false}
                className="flex_root"
                options={sales_person}
                name="sales_person_id"
                label={Labels.SALESPERSON}
                placeholder={Content.select_salesperson}
              />
            </Col>
          </Row>
          <ItemTable
            sales
            taxes={taxList}
            isModal={isModal}
            itemList={itemList}
            adjustment={adjustment}
            warehouses={warehouses}
            url={RECURRING_INVOICE_ITEMS}
            handleSubTotal={handleSubTotal}
            handleItemList={handleItemList}
            setTotalAmount={setTotalAmount}
            shipping_charge={shipping_charge}
            currency={current?.base_currency?.symbol}
            edit={current && Object.keys(current).length}
          />
          <Divider />
          <Row>
            <Col span={8} offset={1}>
              <Form.Item label={Labels.NOTES} name="note" className="mb flex_root">
                <TextArea rows={1} />
              </Form.Item>
            </Col>
            <Col span={8} offset={4}>
              <Row>
                <Col>
                  <Typography.Title level={5} style={{ marginTop: 8 }}>
                    Sub Total
                  </Typography.Title>
                </Col>
                <Col offset={14}>
                  <Statistic value={subTotal} prefix={current?.base_currency?.symbol} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label={Labels.ADJUSTMENT} name="adjustment" colon={false}>
                    <InputNumber
                      name="adjustment"
                      addonAfter={current?.base_currency?.symbol}
                      placeholder={`${current?.base_currency?.symbol}0.00`}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label={Labels.SHIPPING_CHARGES} name="shipping_charge" colon={false}>
                    <InputNumber
                      min={0}
                      name="shipping_charge"
                      addonAfter={current?.base_currency?.symbol}
                      placeholder={`${current?.base_currency?.symbol}0.00`}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={13}>
              <Typography.Title level={4} style={{ marginTop: 0 }}>
                Total
              </Typography.Title>
            </Col>
            <Col offset={5}>
              <Statistic value={totalAmount} prefix={current?.base_currency?.symbol} />
            </Col>
          </Row>
          <Divider />

          <Row>
            <Col span={10} offset={1}>
              <Form.Item
                label={Labels.TERMS_AND_CONDITIONS}
                name="terms_and_condition"
                className="flex_root"
              >
                <TextArea
                  rows={4}
                  name="terms_and_condition"
                  placeholder={Content.terms_and_conditions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Space className={isModal ? "steps-action" : ""} style={{ paddingLeft: "46px" }}>
            <Buttonx
              btnText={
                current?.invoice_info && Object.keys(current?.invoice_info).length
                  ? Labels.UPDATE
                  : Labels.CREATE
              }
              style={{ width: "120px" }}
              loading={loading}
              block
            />
            <Buttonx
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={() => (isModal ? close?.() : navigate(RECURRING_INVOICES))}
            />
          </Space>
        </div>
      </Form>
    </>
  );
};
