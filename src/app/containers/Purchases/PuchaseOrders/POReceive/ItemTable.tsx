/** @format */

import { useMemo } from "react";
import { Button, InputNumber, Popconfirm, Space, Table } from "antd";
import { Labels } from "static";
import { Icons } from "app/shared";
import { ItemTableProps } from "./Types";

const { RiDeleteBinLine } = Icons;
const { NAME, CODE, YES, NO, DELETE } = Labels;

export const ItemTable = ({
  listing = [],
  handleConfirm,
  handleQuantityChange,
}: ItemTableProps) => {
  const memoColumns = useMemo(
    () => [
      {
        title: "Items",
        dataIndex: "item_name",
        key: NAME,
        ellipsis: true,
        width: 120,
      },
      {
        title: "Ordered#",
        dataIndex: "quantity_ordered",
        key: CODE,
        ellipsis: true,
        width: 100,
      },
      {
        title: "Received",
        dataIndex: "received_quantity",
        key: CODE,
        ellipsis: true,
        width: 100,
      },
      {
        title: "Cancelled",
        dataIndex: "cancelled_quantity",
        key: CODE,
        ellipsis: true,
        width: 100,
      },
      {
        title: "Qty. To Received",
        dataIndex: "quantity",
        key: CODE,
        ellipsis: true,
        editable: true,
        width: 150,
        style: {},
        render: (quantity: number, row: any) => (
          <InputNumber
            name="quantity"
            value={quantity}
            min={1}
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
              okText={YES}
              cancelText={NO}
              placement="left"
              title={`${DELETE}  Item ?`}
              disabled={!!(listing.length === 1)}
              onConfirm={() => handleConfirm(props)}
            >
              <Button
                size="small"
                shape="circle"
                key="deletebtn"
                aria-disabled="true"
                disabled={!!(listing.length === 1)}
              >
                <RiDeleteBinLine size={12} />
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleQuantityChange, handleConfirm, listing.length]
  );

  return (
    <>
      <Table
        size="small"
        style={{
          marginLeft: "50px",
          marginRight: "100px",
          paddingBottom: "0px",
        }}
        dataSource={listing}
        // loading={loading}
        pagination={false}
        columns={memoColumns}
        rowKey={(record: any) => record.invoice_no}
      />
    </>
  );
};
