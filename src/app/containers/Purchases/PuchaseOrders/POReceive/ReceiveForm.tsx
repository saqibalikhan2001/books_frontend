/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Divider, Form, Radio, Row, Space } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import { ItemTable } from "./ItemTable";
import { ReceiveFormProps } from "./Types";
import { Content, Labels, routeNames } from "static";
import { useCreateFormApi } from "app/Hooks";
import { Buttonx, DatePickerx, InputField } from "app/shared";

const todayDate = dayjs(new Date());
const { PURCHASE_ORDERS } = routeNames;

const initialState = {
  receive_no: "",
  type: "unbilled",
  receive_date: todayDate,
};

export const ReceiveForm = ({
  url,
  close,
  loading,
  onSubmit,
  handleItemList,
  isModal = false,
}: ReceiveFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { details } = useCreateFormApi(url);

  useEffect(() => {
    form.setFieldsValue({
      ...details,
    });
    const itemdata =
      details?.items_receivable_without_billed?.map((item: any, i: number) => {
        return {
          ...item,
          key: `${i}`,
          quantity: item?.quantity_receivable_without_billed,
        };
      }) || [];
    setData(itemdata);
    handleItemList(itemdata);
    //eslint-disable-next-line
  }, [details]);

  const handleConfirm = (props: { key: string }) => {
    const newData = data.filter((item: { key: string }) => item.key !== props.key);
    setData(newData);
  };

  const handleQuantityChange = (value: any | null, row: any) => {
    const newData = [...data] as any;
    newData[row.key] = {
      ...newData[row.key],
      quantity: value,
    };
    setData(newData);
    handleItemList(newData);
  };

  return (
    <>
      <Form
        form={form}
        autoComplete="off"
        name="receive-form"
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialState}
      >
        <div>
          <Row>
            <Col span={6} offset={1}>
              <InputField
                size="middle"
                name="receive_no"
                label={Labels.RECEIVE_NO}
                className="mb flex_root"
                rules={rules({ message: Content.enter_receive_no })}
              />
            </Col>
            <Col span={6} offset={1}>
              <DatePickerx isRequired disableDate label={Labels.RECEIVE_DATE} name="receive_date" />
            </Col>
          </Row>
          <Row>
            <Col offset={1} span={18}>
              <Form.Item
                name="type"
                colon={false}
                labelAlign="left"
                labelCol={{ span: 5 }}
                label={Labels.RECEIVE_ITEMS_TYPE}
                tooltip="Select Receive Items Type"
              >
                <Radio.Group>
                  <Radio value="unbilled">Unbilled Items</Radio>
                  <Radio value="billed" disabled>
                    Billed Items
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <ItemTable
            listing={data}
            handleConfirm={handleConfirm}
            handleQuantityChange={handleQuantityChange}
          />
          <Row>
            <Divider />
            <Col offset={1}>
              <Space className="steps-action">
                <Buttonx size="middle" btnText={Labels.CREATE} loading={loading} />
                <Buttonx
                  size="middle"
                  type="default"
                  btnText="Cancel"
                  htmlType="button"
                  clickHandler={() => (isModal ? close?.() : navigate(PURCHASE_ORDERS))}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};
