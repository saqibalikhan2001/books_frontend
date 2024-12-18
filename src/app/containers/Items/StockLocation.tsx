/** @format */

import { useMemo } from "react";
import { Table, Typography } from "antd";
import { Labels } from "static";

const { Text } = Typography;
const { _WAREHOUSE, OPENING_STOCK, PHYSICAL_STOCK, ACCOUNTING_STOCK } = Labels;

export const StockLocation = ({ list }: any) => {
  const memoColumns = useMemo(
    () => [
      {
        key: _WAREHOUSE,
        title: _WAREHOUSE,
        width: 130,
        ellipsis: true,
        dataIndex: "warehouse",
        render: (warehouse: any) => {
          return <Text> {warehouse?.name || ""} </Text>;
        },
      },
      {
        key: OPENING_STOCK,
        title: OPENING_STOCK,
        dataIndex: "opening_quantity",
        width: 105,
        ellipsis: true,
      },
      {
        key: PHYSICAL_STOCK,
        title: PHYSICAL_STOCK,
        dataIndex: "physical_quantity",
        width: 118,
      },
      {
        key: ACCOUNTING_STOCK,
        title: ACCOUNTING_STOCK,
        dataIndex: "accounting_quantity",
        width: 118,
      },
    ],
    []
  );
  return (
    <>
      <Table
        rowKey="key"
        bordered={false}
        pagination={false}
        columns={memoColumns}
        style={{ marginTop: "8px" }}
        className="generic-table no-radius"
        dataSource={(list?.inventory_type === "inventory" && list?.stocks) || []}
      />
    </>
  );
};
