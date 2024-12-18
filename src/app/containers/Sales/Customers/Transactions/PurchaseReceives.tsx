/** @format */

import { useMemo } from "react";
import { Labels } from "static";
import { getOrganizationDate } from "utils";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";

const { DATE, PURCHASE_ORDER_NO, QUANTITY, RECEIVE_NO } = Labels;

const PurchaseReceives = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();
  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "receive_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (receive_date: string) => getOrganizationDate(receive_date, org_date_format),
      },
      {
        title: RECEIVE_NO,
        dataIndex: "receive_no",
        key: RECEIVE_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: PURCHASE_ORDER_NO,
        dataIndex: "purchase_order_no",
        key: PURCHASE_ORDER_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: QUANTITY,
        dataIndex: "received_quantity",
        key: QUANTITY,
        width: 100,
        ellipsis: true,
      },
    ],
    []
  );
  return (
    <Tablex
      transaction
      rowKey="receive_no"
      columns={memoColumns}
      url={`${url}?filter=purchase_receives`}
    />
  );
};

export default PurchaseReceives;
