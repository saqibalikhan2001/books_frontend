/** @format */

import { useMemo } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";

const { DATE, INVOICE_NO, PAYMENT_DUE, AMOUNT, STATUS } = Labels;

const Invoices = ({ url}: { url: string  }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "invoice_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (invoice_date: string) => getOrganizationDate(invoice_date, org_date_format),
      },
      {
        title: INVOICE_NO,
        dataIndex: "invoice_no",
        key: INVOICE_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: PAYMENT_DUE,
        dataIndex: "payment_due",
        key: PAYMENT_DUE,
        width: 95,
        align:'right',
        ellipsis: true,
        render: (payment_due: number, inv: any) => (
          <>{`${inv?.currency?.symbol}${payment_due.toFixed(2)}`}</>
        ),
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        width:100,
        ellipsis: true,
        align:'right',
        render: (total: number, inv: any) => <>{`${inv?.currency?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width:75,
        ellipsis: true,
        render: (content_type: string) => (
          <Tag
            className={`generic-badge ${
              content_type === "partially paid" ? "partially-paid" : content_type
            }`}
            autoCapitalize=""
            key={content_type}
          >
            {capitalize(content_type === "partially paid" ? "PRTL Paid" : content_type)}
          </Tag>
        ),
      },
    ],
    []
  );
  return (
    <Tablex transaction rowKey="invoice_no" columns={memoColumns} url={`${url}?filter=invoices`} />
  );
};

export default Invoices;
