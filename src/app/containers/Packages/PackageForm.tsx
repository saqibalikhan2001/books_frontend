/** @format */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Col, Divider, Form, Row, Space } from "antd";
import dayjs from "dayjs";
import { rules } from "utils";
import SubTable from "./SubTable";
import { PackageFromProps } from "./Types";
import { useAxios, useBool, useCreateFormApi } from "app/Hooks";
import { Content, Labels, endpoints, routeNames } from "static";
import { Buttonx, DatePickerx, InputField, Selectx, Spinner } from "app/shared";

const todayDate = dayjs(new Date());

const { PACKAGE_CREATE } = endpoints;
const { select_sales_order } = Content;
const { PACKAGES, ADD_PACKAGE } = routeNames;

const initialState = {
  package_no: "",
  sales_order_id: null,
  package_date: todayDate,
};

export const PackageForm = ({
  edit,
  close,
  loading,
  url = "",
  onSubmit,
  handleItemsList,
  isModal = false,
}: PackageFromProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [loader, setLoader] = useState(true);
  const [rowCount, setRowCount] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const { sales_order_list, details } = useCreateFormApi(url);

  useEffect(() => {
    if (isModal && details?.sales_order && Object.keys(details?.sales_order).length) {
      setLoader(true);
      form.setFieldsValue({
        package_no: details.package_no,
        sales_order_id: details?.sales_order?.id,
      });
      setWarehouses(details?.warehouse_list);
      const itemdata = details?.sales_order?.sales_order_details.map((item: any, i: number) => {
        return {
          ...item,
          key: `${i}`,
          unit: item?.items?.unit,
          id: item.item_id,
          ordered_quantity: item?.quantity,
          sales_order_item_detail_id: item?.id,
        };
      });
      setItems(itemdata);
      setData(itemdata || []);
      handleItemsList(itemdata);
      setLoader(false);
    }
    //eslint-disable-next-line
  }, [details?.sales_order, isModal]);

  useEffect(() => {
    if (details?.package && Object.keys(details?.package).length) {
      setLoader(true);
      form.setFieldsValue({
        ...details?.package,
        package_date: dayjs(details?.package?.package_date, "YYYY-MM-DD"),
      });
      const newData =
        details?.sales_order_item_details?.map((item: any, i: number) => ({
          ...item,
          key: `${i}`,
          ordered_quantity: item.quantity,
          quantity: item.packed,
          warehouse_id: item.warehouse_id,
        })) || [];
      setData(newData);
      handleItemsList(newData);
      setItems(newData);
      setWarehouses(details?.warehouse_list);
      setLoader(false);
    }
    //eslint-disable-next-line
  }, [details?.package]);

  const handleChange = (value: number) => {
    toggle();
    callAxios({
      url: `${PACKAGE_CREATE}?sales_order_id=${value}`,
    }).then((res: any) => {
      form.setFieldsValue({ package_no: res.package_no });
      setWarehouses(res?.warehouse_list);
      const itemdata = res?.sales_order?.sales_order_details.map((item: any, i: number) => {
        return {
          ...item,
          key: `${i}`,
          unit: item?.items?.unit,
          id: item.item_id,
          ordered_quantity: item?.quantity,
          sales_order_item_detail_id: item?.id,
        };
      });
      setItems(itemdata);
      setData(itemdata || []);
      handleItemsList(itemdata);
      setRowCount((prevState) => prevState + (itemdata.length - 1));
      toggle();
      setLoader(false);
    });
  };
  const handleConfirm = (props: { key: string }) => {
    const newData = data.filter((item: { key: string }) => item.key !== props.key);
    setData(newData);
  };
  const handleAdd = () => {
    const newData = {
      key: `${rowCount}`,
      item_obj: null,
      warehouse_id: null,
      quantity: 0,
      dropshipped: 0,
      packed: 0,
      stock: [],
      unit: "",
      sales_order_item_detail_id: null,
    };
    setData([...data, newData] as never);
    setRowCount(rowCount + 1);
  };

  const handleSelectedItem = (option: number, row: { key: string }) => {
    const primary_warehouse = warehouses.find((item: any) => item.is_primary) || ({} as any);
    let currentOption: any = items.find((item: any) => {
      return item.item_id === option;
    });
    const newData = [...data] as any;
    const itemIndex = newData.findIndex((item: { key: string | number }) => item.key === row.key);
    newData[itemIndex] = {
      ...newData[itemIndex],
      key: `${itemIndex}`,
      unit: currentOption.unit,
      packed: currentOption.packed,
      item_id: currentOption.item_id,
      stock: currentOption.stock || [],
      quantity: currentOption.quantity,
      warehouse_id: primary_warehouse.id,
      ordered_quantity: currentOption.quantity,
      sales_order_item_detail_id: currentOption.item_id,
    };
    setData(newData);
    handleItemsList(newData);
  };

  const handleQuantityChange = (value: number | null, row: any) => {
    const newData = [...data] as any;
    newData[row.key] = {
      ...newData[row.key],
      quantity: value,
    };
    setData(newData);
    handleItemsList(newData);
  };

  if (bool || (loader && location.pathname !== ADD_PACKAGE)) return <Spinner />;
  return (
    <>
      <Form
        form={form}
        name="package-form"
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
        initialValues={initialState}
      >
        <Row>
          <Col span={6} offset={1}>
            <InputField
              disabled
              size="middle"
              name="package_no"
              label={Labels.PACKAGE_NO}
              placeholder={select_sales_order}
              rules={rules({ message: Content.package_required })}
            />
            <DatePickerx name="package_date" label={Labels.PACKAGE_DATE} />
          </Col>
          <Col span={6} offset={1}>
            <Selectx
              name="sales_order_id"
              className="flex_root"
              label={Labels.SALES_ORDER}
              options={sales_order_list}
              disabled={edit || isModal}
              handleChange={handleChange}
              rules={rules({ message: Content.sales_order_required })}
            />
          </Col>
        </Row>
        <Divider />
        <SubTable
          data={data}
          items={items}
          loader={loader}
          isModal={isModal}
          warehouses={warehouses}
          handleConfirm={handleConfirm}
          handleSelectedItem={handleSelectedItem}
          handleQuantityChange={handleQuantityChange}
        />
        {items.length !== data.length && <Button onClick={handleAdd}>Add a new Line</Button>}

        <Divider />

        <Space style={{ paddingLeft: "10px" }}>
          <Buttonx
            btnText={
              details.package && Object.keys(details.package).length ? Labels.UPDATE : Labels.CREATE
            }
            style={{ width: "120px" }}
            loading={loading}
            block
          />
          <Buttonx
            type="default"
            htmlType="button"
            btnText={Labels.CANCEL}
            clickHandler={() => (isModal ? close?.() : navigate(PACKAGES))}
          />
        </Space>
      </Form>
    </>
  );
};
