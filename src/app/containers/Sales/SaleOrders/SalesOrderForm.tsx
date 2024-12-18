/** @format */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Form,
  Input,
  Space,
  Divider,
  Statistic,
  Typography,
  DatePicker,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { SalesOrderFormProps } from "./Types";
import { useBool, useCreateFormApi } from "app/Hooks";
import { routeNames, Content, endpoints, Labels } from "static";
import { Buttonx, InputField, Selectx, ItemTable, PaginateSelectX } from "app/shared";

const { TextArea } = Input;
const { SALES_ORDERS } = routeNames;
const { customer_notes, terms_and_conditions } = Content;
const { SALES_ORDERS_CONTACT, SALES_ORDERS_ITEMS } = endpoints;

const todayDate = dayjs(new Date());

const initialState = {
  name: "",
  reference: "",
  adjustment: 0,
  customer_id: null,
  customer_note: "",
  sales_order_no: "",
  shipping_charge: 0,
  order_date: todayDate,
  terms_and_condition: "",
  expected_shipment_date: todayDate,
};

export const SalesOrderForm = ({
  url,
  loading,
  onSubmit,
  handleTotal,
  handleItemList,
  handleWarehouseId,
  handlePrimaryWarehouse,
}: SalesOrderFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [subTotal, setSubTotal] = useState(0);
  const [itemList, setitemList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { bool, setTrue, setFalse } = useBool(true);
  const {
    taxList,
    warehouses,
    sales_person,
    details: current,
    details: { sales_order_no },
  } = useCreateFormApi(url);
  const adjustment = Form.useWatch("adjustment", form);
  const shipping_charge = Form.useWatch("shipping_charge", form);

  useEffect(() => {
    form.setFieldsValue({ sales_order_no });
    //eslint-disable-next-line
  }, [sales_order_no]);

  useEffect(() => {
    if (current?.sales_order && Object.keys(current?.sales_order)?.length) {
      form.setFieldsValue({
        ...current?.sales_order,
        order_date: dayjs(current?.sales_order?.order_date, "YYYY-MM-DD"),
        expected_shipment_date: dayjs(current?.sales_order?.expected_shipment_date, "YYYY-MM-DD"),
      });
      handlePrimaryWarehouse!(current?.sales_order?.warehouse_id);
      setitemList(current?.sales_order?.sales_order_details);
      setFalse();
    }
    //eslint-disable-next-line
  }, [current?.sales_order]);

  useEffect(() => {
    handleTotal(totalAmount);
    //eslint-disable-next-line
  }, [totalAmount]);

  const handleSubTotal = useCallback((subtotal: number) => setSubTotal(subtotal), []);

  return (
    <>
      <Form
        form={form}
        name="item-form"
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
        initialValues={initialState}
      >
        <Row>
          <Col span={7} offset={1}>
            <PaginateSelectX
              setTrue={setTrue}
              name="customer_id"
              setFalse={setFalse}
              label="Customer Name"
              url={SALES_ORDERS_CONTACT}
              placeholder="Select or Search Customer"
            />
          </Col>
        </Row>
        <div className={bool ? "hide" : "display"}>
          <Row>
            <Col span={6} offset={1}>
              <InputField
                name="sales_order_no"
                size="middle"
                label="SalesOrder#"
                rules={rules({ message: "sales order no. is required" })}
                disabled
              />
              <Form.Item name="order_date" label="SalesOrder Date" className="flex_root">
                <DatePicker clearIcon={false} name="order_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <InputField name="reference" size="middle" label="Reference" />
              <Form.Item name="expected_shipment_date" label="Expiry Date" className="flex_root">
                <DatePicker clearIcon={false} name="expected_shipment_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6} offset={1}>
              <Selectx
                label="Salesperson"
                name="sales_person_id"
                className="flex_root"
                rules={[]}
                loading={false}
                options={sales_person}
                placeholder="Select or Add Salesperson"
              />
            </Col>
          </Row>

          <ItemTable
            sales
            taxes={taxList}
            itemList={itemList}
            warehouses={warehouses}
            adjustment={adjustment}
            url={SALES_ORDERS_ITEMS}
            handleSubTotal={handleSubTotal}
            setTotalAmount={setTotalAmount}
            handleItemList={handleItemList}
            shipping_charge={shipping_charge}
            handleWarehouseId={handleWarehouseId}
            currency={current?.base_currency?.symbol}
            edit={current && Object.keys(current)?.length}
            handlePrimaryWarehouse={handlePrimaryWarehouse}
          />
          <Divider />
          <Row>
            <Col span={8} offset={1}>
              <Form.Item label="Customer Notes" name="customer_note" className="mb flex_root">
                <TextArea rows={1} placeholder={customer_notes} />
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
                  <Form.Item label="Adjustment" name="adjustment" colon={false}>
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
                  <Form.Item label="Shipping Charges" name="shipping_charge" colon={false}>
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
              <Typography.Title level={4} style={{ marginTop: 3 }}>
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
                label="Terms & Conditions"
                name="terms_and_condition"
                className="flex_root"
              >
                <TextArea rows={4} name="terms_and_condition" placeholder={terms_and_conditions} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col offset={1}>
              <Space style={{ paddingLeft: "10px" }}>
                <Buttonx
                  btnText={
                    current?.sales_order && Object.keys(current?.sales_order)?.length
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
                  clickHandler={() => navigate(SALES_ORDERS)}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};
