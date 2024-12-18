/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";

const { DATE, BILL_NO, DUE, AMOUNT, STATUS } = Labels;

const Bills = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "bill_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (bill_date: string) => getOrganizationDate(bill_date, org_date_format),
      },
      {
        title: BILL_NO,
        dataIndex: "bill_no",
        key: BILL_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: DUE,
        dataIndex: "balance_due",
        key: DUE,
        width: 100,
        ellipsis: true,
        className:"text-right white-space-unset",
        render: (payment_due: number, bill: any) => (
          <span className="amount-truncation">{`${bill?.currency?.symbol}${payment_due.toFixed(2)}`}</span>
        ),
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        width: 120,
        ellipsis: true,
        className:"text-right white-space-unset",
        render: (total: number, bill: any) => <span className="amount-truncation">{`${bill?.currency?.symbol}${total.toFixed(2)}`}</span>,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 80,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag
            autoCapitalize=""
            key={content_type}
            className={`generic-badge ${
              content_type === "partially paid" ? "partially-paid" : content_type
            }`}
          >
            {capitalize(content_type === "partially paid" ? "PRTL Paid" : content_type)}
          </Tag>
        ),
      },
    ],
    []
  );
  return (
    <Tablex transaction rowKey="bill_no" columns={memoColumns || []} url={`${url}?filter=bills`} />
  );
};

export default Bills;
