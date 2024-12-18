/** @format */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Form, Space, Input, Divider, Statistic, Typography, Checkbox } from "antd";
import { rules } from "utils";
import dayjs, { Dayjs } from "dayjs";
import { InvoiceFormProps } from "./Types";
import { RepeatModal } from "./RepeatModal";
import { PaymentTermModal } from "./PaymentTermModal";
import { Content, endpoints, Labels, routeNames } from "static";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { useBool, useTimeZone, useStore, useCreateFormApi } from "app/Hooks";
import { Buttonx, DatePickerx, InputField, ItemTable, PaginateSelectX, Selectx } from "app/shared";

const { TextArea } = Input;
const todayDate = dayjs(new Date());
const { RECURRING_BILLS } = routeNames;
const { RECURRING_BILL_CONTACTS, RECURRING_BILL_ITEMS } = endpoints;

const initialState = {
  note: "",
  order_no: "",
  bill_no: null,
  adjustment: 0,
  vendor_id: null,
  warehouse_id: "",
  bill_terms: null,
  end_date: todayDate,
  never_expires: false,
  repeat_duration: null,
  start_date: todayDate,
  terms_and_condition: "",
};

export const RecurringBillForm = ({
  url,
  close,
  loading,
  onSubmit,
  handleTotal,
  handleItemList,
  create = false,
  isModal = false,
}: InvoiceFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { bool, toggle } = useBool(false);
  const [subTotal, setSubTotal] = useState(0);
  const { primary_organization } = useStore();
  const [itemList, setitemList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { bool: disable, setTrue, setFalse } = useBool(true);
  const { bool: repeatModal, toggle: toggleRepeatModal } = useBool(false);
  const {
    taxes,
    warehouses,
    base_currency,
    repeat_duration,
    purchaseAccount,
    details: current,
  } = useCreateFormApi(url);

  const { handleDate } = useTimeZone(primary_organization?.time_zone || "");

  const { data: terms = [], refetch } = useGetInvoiceTermsListQuery("");

  const term = Form.useWatch("bill_terms", form);
  const never_expires = Form.useWatch("never_expires", form);

  const memoizeFilter = useMemo(
    () => terms.filter((val: { id: number }) => val.id === term)[0] || {},
    [terms, term]
  );

  const start_date = form.getFieldValue("start_date");
  const customDate = handleDate(memoizeFilter.value, start_date);
  const org_terms = terms.filter(({ org_id }: { org_id: number }) => org_id) || [];
  const adjustment = Form.useWatch("adjustment", form);

  const handleRepeatDuration = (value: number) => {
    const repeatDuration = repeat_duration?.find((dur: { id: number }) => dur.id === value);
    form.setFieldsValue({ repeat_duration: repeatDuration });
  };

  useEffect(() => {
    if (current?.bill_details?.bill_info && Object.keys(current?.bill_details?.bill_info).length) {
      let repeatDuration;
      let impureString = /\d/.test(current?.bill_details?.bill_info?.repeat_duration);
      if (impureString) {
        repeatDuration =
          current?.bill_details?.bill_info?.repeat_duration.split(" ")[0] +
          " " +
          repeat_duration?.find(
            (dur) => dur.value === current?.bill_details?.bill_info?.repeat_duration.split(" ")[1]
          )?.label;
      } else {
        repeatDuration = repeat_duration?.find(
          (dur) => dur.value === current?.bill_details?.bill_info?.repeat_duration
        )?.label;
      }
      form.setFieldsValue({
        ...current?.bill_details?.bill_info,
        never_expires: !Boolean(current?.bill_details?.bill_info?.end_date),
        repeat_duration: repeatDuration,
        bill_terms: current?.bill_details?.bill_info?.invoice_term_id,
        start_date: dayjs(current?.bill_details?.bill_info?.start_date, "YYYY-MM-DD"),
        end_date: dayjs(current?.bill_details?.bill_info?.end_date, "YYYY-MM-DD"),
      });
      setitemList(current?.bill_details?.bill_info?.bill_item_details);
      setFalse();
      // setLoader(false);
    }
    //eslint-disable-next-line
  }, [current?.bill_details?.bill_info, form]);

  useEffect(() => {
    if (customDate && customDate.isValid()) form.setFieldsValue({ end_date: customDate });
    if (never_expires) form.setFieldsValue({ end_date: null });
    else if (!never_expires && !memoizeFilter.value) form.setFieldsValue({ end_date: start_date });
    //eslint-disable-next-line
  }, [customDate, memoizeFilter, start_date, never_expires]);

  useEffect(() => {
    if (create)
      form.setFieldsValue({
        bill_terms: terms.filter((val: { name: string }) => val.name === "Net 30")[0] || {},
      });
    // eslint-disable-next-line
  }, [create, terms]);

  useEffect(() => {
    handleTotal?.(totalAmount);
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
              name="vendor_id"
              setFalse={setFalse}
              label="Vendor Name"
              url={RECURRING_BILL_CONTACTS}
              placeholder="Select or Search Vendor"
            />
          </Col>
        </Row>
        <div className={disable ? "hide" : "display"}>
          <Row>
            <Col span={6} offset={1}>
              <InputField
                size="middle"
                name="profile_name"
                disabled={isModal}
                label={Labels.PROFILE_NAME}
                className="mb flex_root"
                rules={rules({ message: Content.enter_profile_name })}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={1}>
              <Selectx
                repeat_opt
                name="repeat_duration"
                label="Repeat Every"
                className="flex_root"
                handleToggle={toggleRepeatModal}
                options={repeat_duration || []}
                placeholder={Content.select_terms}
                handleChange={handleRepeatDuration}
                rules={rules({ message: Content.select_repeat_duration })}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={1}>
              <DatePickerx
                disableDate
                name="start_date"
                label={Labels.START_DATE}
                onChange={handleDateChange}
              />
              <Selectx
                create_opt
                name="bill_terms"
                label="Payment Terms"
                options={terms || []}
                className="flex_root"
                disabled={never_expires}
                handleToggle={handleToggle}
                placeholder={Content.select_terms}
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

          <ItemTable
            taxes={taxes}
            // isModal={isModal}
            itemList={itemList}
            adjustment={adjustment}
            warehouses={warehouses}
            url={RECURRING_BILL_ITEMS}
            setTotalAmount={setTotalAmount}
            handleSubTotal={handleSubTotal}
            currency={base_currency?.symbol}
            purchaseAccount={purchaseAccount}
            handleItemList={handleItemList as any}
            // edit={current && Object.keys(current).length}
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
                  <Statistic value={subTotal || 0} prefix={current?.base_currency?.symbol} />
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <InputField
                    type="number"
                    size="middle"
                    name="adjustment"
                    label="Adjustment"
                    stringMode={false}
                    addonAfter={current?.base_currency?.symbol}
                    placeholder={`${current?.base_currency?.symbol}0.00`}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col offset={13}>
              <Typography.Title level={4} style={{ marginTop: 3 }}>
                Total
              </Typography.Title>
            </Col>
            <Col offset={5}>
              <Statistic value={totalAmount || 0} prefix={current?.base_currency?.symbol} />
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
              btnText={current?.bill_details?.bill_info ? Labels.UPDATE : Labels.CREATE}
              style={{ width: "120px" }}
              loading={loading}
              block
            />
            <Buttonx
              type="default"
              btnText="Cancel"
              htmlType="button"
              clickHandler={() => (isModal ? close?.() : navigate(RECURRING_BILLS))}
            />
          </Space>
        </div>
      </Form>
    </>
  );
};
