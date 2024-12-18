/** @format */

import { Statistic, Table } from "antd";
import { TaxModalTypes } from "./Types";
import type { ColumnsType } from "antd/es/table";
import {
  getTaxtotal,
  getAmountSum,
  getOrderTotal,
  getFinalAmount,
  getDiscounttotal,
} from "utils/calculation";

export const TaxModal = ({ isDataSource, currency }) => {
  const columns: ColumnsType<TaxModalTypes> = [
    {
      title: "Products",
      dataIndex: "item_name",
      key: "items",
      width: "",
    },
    {
      title: "Amount",
      dataIndex: "",
      key: "amount",
      render: (value) => (
        <Statistic
          precision={2}
          className="no-space"
          valueStyle={{ fontSize: "14px" }}
          value={(value.rate * value.quantity).toFixed(2)}
          prefix={currency + " "}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "",
      key: "discount",
      render: (value) =>
        value.discount_type === "percent" ? (
          <>
            <Statistic
              precision={2}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
              value={(value.total * parseFloat(value.discount_item_level)) / 100}
              prefix={currency + " "}
              suffix={"@"}
            />

            <span>
              <Statistic
                precision={2}
                className="no-space"
                valueStyle={{ fontSize: "14px" }}
                value={value.discount_item_level}
                suffix={"%"}
              />
            </span>
          </>
        ) : (
          <Statistic
            precision={2}
            className="no-space"
            valueStyle={{ fontSize: "14px" }}
            value={parseFloat(value.discount_item_level).toFixed(2)}
            prefix={currency}
          />
        ),
    },
    {
      title: "Tax",
      key: "tax",
      dataIndex: "",
      render: (value) =>
        value.tax_name ? (
          <>
            <Statistic
              precision={2}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
              value={((value.total * parseFloat(value.tax_rate)) / 100).toFixed(2)}
              prefix={currency}
              suffix={"@"}
            />

            <Statistic
              precision={2}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
              value={value.tax_name + `(${value.tax_rate}%)`}
            />
          </>
        ) : (
          <Statistic
            precision={2}
            className="no-space"
            valueStyle={{ fontSize: "14px" }}
            value="0.00"
            prefix={currency}
          />
        ),
    },
    {
      title: "Final Amount",
      key: "final amount",
      dataIndex: "",
      render: (value) => (
        <Statistic
          precision={2}
          className="no-space"
          valueStyle={{ fontSize: "14px" }}
          value={getFinalAmount(value)}
          prefix={currency + " "}
        />
      ),
    },
  ];
  return (
    <div className="generic_modal px-30">
      <Table
        className="generic-table tax_table"
        columns={columns}
        dataSource={isDataSource.filter((data) => data.id)}
        pagination={false}
        summary={() => {
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} className="font-bold">
                Total
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right" index={1}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px" }}
                  value={getAmountSum(isDataSource)}
                  prefix={currency + " "}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right" index={2}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px" }}
                  value={getDiscounttotal(isDataSource)}
                  prefix={currency + " "}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right" index={3}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px" }}
                  value={getTaxtotal(isDataSource)}
                  prefix={currency + " "}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell className="text-right" index={4}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px" }}
                  value={getOrderTotal(isDataSource)?.toFixed(2)}
                  prefix={currency + " "}
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};
