/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";
const { DATE, SALES_ORDER_NO, REFERENCE, AMOUNT, STATUS } = Labels;

const SalesOrders = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "order_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (order_date: string) => getOrganizationDate(order_date, org_date_format),
      },
      {
        title: SALES_ORDER_NO,
        dataIndex: "sales_order_no",
        key: SALES_ORDER_NO,
        width: 125,
        ellipsis: true,
      },
      {
        title: REFERENCE,
        dataIndex: "reference",
        key: REFERENCE,
        width: 95,
        ellipsis: true,
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        width: 110,
        align:"right",
        ellipsis: true,
        render: (total: number, sale_order: any) => (
          <>{`${sale_order?.currency?.symbol}${total.toFixed(2)}`}</>
        ),
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 70,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag className={`generic-badge ${content_type}`} autoCapitalize="" key={content_type}>
            {capitalize(content_type)}
          </Tag>
        ),
      },
    ],
    []
  );

  return (
    <Tablex
      transaction
      columns={memoColumns}
      rowKey="sales_order_no"
      url={`${url}?filter=sales_orders`}
    />
  );
};

export default SalesOrders;
