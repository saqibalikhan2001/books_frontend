/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";

const { DATE, PURCHASE_ORDER_NO, REFERENCE, AMOUNT, STATUS } = Labels;

const PurchaseOrders = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "order_date",
        key: DATE,
        width: 95,
        ellipsis: true,
        render: (order_date: string) => getOrganizationDate(order_date, org_date_format),
      },
      {
        title: PURCHASE_ORDER_NO,
        dataIndex: "purchase_order_no",
        key: PURCHASE_ORDER_NO,
        width: 115,
        ellipsis: true,
      },
      {
        title: REFERENCE,
        dataIndex: "reference",
        key: REFERENCE,
        width: 90,
        ellipsis: true,
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        width: 90,
        ellipsis: true,
        render: (total: number, po: any) => <>{`${po?.currency?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 90,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag autoCapitalize="" key={content_type} className={`generic-badge ${content_type}`}>
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
      rowKey="purchase_order_no"
      url={`${url}?filter=purchase_orders`}
    />
  );
};

export default PurchaseOrders;
