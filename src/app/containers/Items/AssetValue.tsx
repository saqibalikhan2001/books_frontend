/** @format */

import { useMemo } from "react";
import { Table, Space, Form, DatePicker } from "antd";
import { Buttonx } from "app/shared";
import { detailPage } from "./Types";

const dateFormat = "YYYY/MM/DD";
const data = [
  {
    key: "1",
    purchasing: " Nothing",
    date: "11-12-13",
    transaction_no: 32,
    purchased: "New York No. 1 Lake Park",
    sold: "xyz",
    adjustment: "false",
    balance: 999,
    unit_cost: 768,
    amount: 98765,
  },
  {
    key: "2",
    purchasing: " Nothing",
    date: "11-12-13",
    transaction_no: 32,
    purchased: "New York No. 1 Lake Park",
    sold: "xyz",
    adjustment: "false",
    balance: 999,
    unit_cost: 768,
    amount: 98765,
  },
  {
    key: "3",
    purchasing: " Nothing",
    date: "11-12-13",
    transaction_no: 32,
    purchased: "New York No. 1 Lake Park",
    sold: "xyz",
    adjustment: "false",
    balance: 999,
    unit_cost: 768,
    amount: 98765,
  },
];

export const AssetValue = ({ data: _datas }: detailPage) => {
  const memoColumns = useMemo(
    () => [
      {
        title: "Purchasing",
        dataIndex: "purchasing",
        key: "Purchasing",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "Date",
        width: 100,
        ellipsis: true,
      },
      {
        title: "Transaction No",
        dataIndex: "transaction_no",
        key: "Transaction No",
        width: 100,
      },
      {
        title: "Purchased",
        dataIndex: "purchased",
        key: "Purchased",
        width: 100,
      },
      {
        title: "Sold",
        dataIndex: "sold",
        key: "SOld",
        width: 80,
      },
      {
        title: "Adjustment",
        dataIndex: "adjustment",
        key: "Adjustment",
        width: 95,
      },
      {
        title: "Balance",
        dataIndex: "balance",
        key: "Balance",
        width: 95,
      },
      {
        title: "Unit Cost",
        dataIndex: "unit_cost",
        key: "Unit Cost",
        width: 95,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "Amount",
        width: 95,
      },
    ],
    []
  );

  return (
    <>
      <Space wrap className="__report_tabs_align">
        <Space>
          <label>
            <b>Report period</b>
          </label>
        </Space>
        <Space>
          <label>From</label>
          <Form.Item name="from">
            <DatePicker clearIcon={false} format={dateFormat} style={{ width: "100%" }} />
          </Form.Item>
        </Space>
        <Space>
          <label>To</label>
          <Form.Item name="to">
            <DatePicker clearIcon={false} format={dateFormat} style={{ width: "100%" }} />
          </Form.Item>
        </Space>
        <Buttonx className="btn-primary h-36px" btnText="Run report" />
      </Space>
      <Table
        rowKey="key"
        bordered={false}
        pagination={false}
        columns={memoColumns}
        dataSource={data || []}
        style={{ marginTop: "8px" }}
        className="generic-table assest-value-tbl no-radius"
      />
    </>
  );
};
