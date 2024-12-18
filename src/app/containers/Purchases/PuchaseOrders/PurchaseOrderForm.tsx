/** @format */
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Form,
  Input,
  Space,
  Divider,
  Statistic,
  DatePicker,
  Typography,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { PurshaseOrderFormProps } from "./Types";
import { useBool, useCreateFormApi } from "app/Hooks";
import { WarehouseProps } from "app/containers/Sales/Types";
import { routeNames, Content, endpoints, Labels } from "static";
import { Buttonx, InputField, Selectx, ItemTable, PaginateSelectX } from "app/shared";

const { TextArea } = Input;
const { PURCHASE_ORDERS } = routeNames;
const { terms_and_conditions } = Content;
const { PURCHASE_ORDERS_CONTACTS, PURCHASE_ORDERS_ITEMS } = endpoints;

const todayDate = dayjs(new Date());

const initialState = {
  reference: "",
  adjustment: 0,
  vendor_id: null,
  shipping_charge: 0,
  warehouse_id: null,
  purchase_order_no: "",
  order_date: todayDate,
  terms_and_condition: "",
  expected_delivery_date: todayDate,
};

export const PurchaseOrderForm = ({
  url,
  loading,
  onSubmit,
  handleTotal,
  handleItemList,
}: PurshaseOrderFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [subTotal, setSubTotal] = useState(0);
  const [itemList, setitemList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const { bool, setTrue, setFalse } = useBool(true);

  const {
    taxList,
    warehouses,
    purchaseAccount,
    details: current,
    details: { purchase_order_no },
  } = useCreateFormApi(url);

  const adjustment = Form.useWatch("adjustment", form);
  const primary_warehouse = warehouses?.find((item: WarehouseProps) => item.is_primary) || {};

  useEffect(() => {
    form.setFieldsValue({
      purchase_order_no,
      warehouse_id: primary_warehouse.id,
    });
    //eslint-disable-next-line
  }, [purchase_order_no]);

  useEffect(() => {
    if (current?.purchase_order_details && Object.keys(current?.purchase_order_details).length) {
      form.setFieldsValue({
        ...current?.purchase_order_details,
        expected_delivery_date: dayjs(
          current?.purchase_order_details?.expected_delivery_date,
          "YYYY-MM-DD"
        ),
        order_date: dayjs(current?.purchase_order_details?.order_date, "YYYY-MM-DD"),
      });
      setitemList(current?.purchase_order_details?.purchase_order_item_details);
      setFalse();
    }
    //eslint-disable-next-line
  }, [current?.purchase_order_details]);

  useEffect(() => {
    handleTotal(totalAmount);
    //eslint-disable-next-line
  }, [totalAmount]);

  const handleSubTotal = useCallback((subtotal: number) => setSubTotal(subtotal), []);

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
        name="purchase-order-form"
        initialValues={initialState}
      >
        <Row>
          <Col span={7} offset={1}>
            <PaginateSelectX
              setTrue={setTrue}
              name="vendor_id"
              setFalse={setFalse}
              label="Vendor Name"
              url={PURCHASE_ORDERS_CONTACTS}
              placeholder="Select or Search Vendor"
            />
          </Col>
        </Row>
        <div className={bool ? "hide" : "display"}>
          <Row>
            <Col span={6} offset={1}>
              <InputField
                disabled
                size="middle"
                name="purchase_order_no"
                label={Labels.PURCHASE_ORDER_NO}
                rules={rules({ message: Content.purchase_order_required })}
              />
              <Selectx
                loading={false}
                name="warehouse_id"
                options={warehouses}
                className="flex_root"
                label={Labels._WAREHOUSE}
                placeholder={Content.select_warehouse}
              />
              <Form.Item name="order_date" label="Order Date" className="flex_root">
                <DatePicker clearIcon={false} name="order_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={6} offset={1}>
              <InputField name="reference" size="middle" label={Labels.REFERENCE} />
              <Form.Item
                name="expected_delivery_date"
                label={Labels.DELIVERY_DATE}
                className="flex_root"
              >
                <DatePicker clearIcon={false} name="expected_delivery_date" format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <ItemTable
            purchaseOrder
            taxes={taxList}
            itemList={itemList}
            adjustment={adjustment}
            url={PURCHASE_ORDERS_ITEMS}
            handleItemList={handleItemList}
            handleSubTotal={handleSubTotal}
            setTotalAmount={setTotalAmount}
            purchaseAccount={purchaseAccount}
            currency={current?.base_currency?.symbol}
            edit={current && Object.keys(current).length}
          />
          <Divider />
          <Row>
            <Col span={8} offset={13}>
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
                label={Labels.TERMS_AND_CONDITIONS}
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
                  block
                  loading={loading}
                  style={{ width: "120px" }}
                  btnText={
                    current?.purchase_order_details?.vendor?.display_name
                      ? Labels.UPDATE
                      : Labels.CREATE
                  }
                />
                <Buttonx
                  type="default"
                  btnText="Cancel"
                  htmlType="button"
                  clickHandler={() => navigate(PURCHASE_ORDERS)}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};
