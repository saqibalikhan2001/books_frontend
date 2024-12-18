/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";
const { DATE, SALES_RETURN, ADD_TO_STOCK, QUANTITY, STATUS } = Labels;

const SalesReturn = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "sales_return_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (sales_return_date: string) =>
          getOrganizationDate(sales_return_date, org_date_format),
      },
      {
        title: SALES_RETURN,
        dataIndex: "sales_return_no",
        key: SALES_RETURN,
        width: 100,
        ellipsis: true,
      },
      {
        title: ADD_TO_STOCK,
        dataIndex: "back_stock",
        key: ADD_TO_STOCK,
        width: 100,
        ellipsis: true,
      },
      {
        title: QUANTITY,
        dataIndex: "add_back_stock",
        key: QUANTITY,
        width: 100,
        ellipsis: true,
      },
      {
        title: STATUS,
        dataIndex: "sales_return_status",
        key: STATUS,
        width: 100,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag
            autoCapitalize=""
            key={content_type}
            className={`generic-badge ${content_type === "closed" ? "received" : content_type}`}
          >
            {capitalize(content_type === "closed" ? "received" : content_type)}
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
      rowKey="sales_return_no"
      url={`${url}?filter=sales_return`}
    />
  );
};

export default SalesReturn;
