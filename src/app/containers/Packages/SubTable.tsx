/**@format */

import { useMemo } from "react";
import { Button, InputNumber, Popconfirm, Select, Space, Table } from "antd";
import { Icons } from "app/shared";
import { SubTableProps } from "./Types";

const { Option } = Select;
const { RiDeleteBinLine, AiOutlineDown } = Icons;

const SubTable = ({
  data,
  items,
  loader,
  isModal,
  warehouses,
  handleConfirm,
  handleSelectedItem,
  handleQuantityChange,
}: SubTableProps) => {
  const memoColumns = useMemo(
    () => [
      {
        title: "ITEMS",
        dataIndex: "item_id",
        width: isModal ? 300 : 500,
        ellipsis: true,
        editable: true,
        render: (id: number, row: any) => (
          <Select
            showSearch
            value={id}
            suffixIcon={<AiOutlineDown />}
            placeholder="Select Item"
            style={{ width: isModal ? "250px" : "450px" }}
            onChange={(option: number) => handleSelectedItem(option, row)}
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            {items.map((item: { item_id: number; label: string }, index: number) => (
              <Option key={`option-${item.item_id}-${index}`} value={item.item_id}>
                {item.label}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "WAREHOUSE",
        dataIndex: "warehouse_id",
        ellipsis: true,
        editable: true,
        width: isModal ? 150 : 250,
        render: (warehouse_id: number) => (
          <Select
            disabled
            value={warehouse_id}
            placeholder="Warehouse"
            suffixIcon={<AiOutlineDown />}
            style={{ width: isModal ? 120 : 180 }}
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            {warehouses.map((warehouse: any, index: number) => (
              <Option key={index} value={warehouse.id}>
                {warehouse.label}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        title: "ORDERED",
        dataIndex: "ordered_quantity",
        ellipsis: true,
        editable: true,
        width: isModal ? 90 : 120,
      },
      {
        title: "PACKED",
        dataIndex: "packed",
        ellipsis: true,
        width: isModal ? 90 : 120,
      },
      {
        title: "STOCK",
        dataIndex: "stock",
        ellipsis: true,
        width: isModal ? 90 : 250,
      },
      {
        title: "PACKED QUANTITY",
        dataIndex: "quantity",
        ellipsis: true,
        width: isModal ? 90 : 120,
        render: (quantity: number, row: any) => (
          <InputNumber
            min={0}
            name="quantity"
            value={quantity}
            style={{ width: isModal ? "60px" : "90px" }}
            onChange={(value) => handleQuantityChange(value, row)}
          />
        ),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        key: "x",
        align: "center" as const,
        render: (props: object) => (
          <Space align="center">
            <Popconfirm
              key="confirm"
              okText="YES"
              cancelText="NO"
              placement="left"
              title={`Delete  Item ?`}
              disabled={!!(data.length === 1)}
              onConfirm={() => handleConfirm(props)}
            >
              <Button
                size="small"
                shape="circle"
                key="deletebtn"
                aria-disabled="true"
                disabled={!!(data.length === 1)}
              >
                <RiDeleteBinLine size={10} />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    // eslint-disable-next-line
    [items, handleQuantityChange, handleSelectedItem, handleConfirm]
  );

  return (
    <>
      <Table
        bordered
        rowKey="key"
        dataSource={data}
        pagination={false}
        columns={memoColumns}
        loading={isModal ? loader : false}
      />
    </>
  );
};

export default SubTable;
