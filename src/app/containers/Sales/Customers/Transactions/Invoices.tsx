/** @format */

import { useMemo, useState } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { capitalize, getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";
// import { useNavigate } from "react-router";
import { InvoiceDetailModal } from "../../Invoices/InvoiceDetailModal";

const { DATE, INVOICE_NO, PAYMENT_DUE, AMOUNT, STATUS } = Labels;

const Invoices = ({ url }: { url: string }) => {
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  // const navigate = useNavigate();
  const toggleInvoiceModal = () => setInvoiceModal(!invoiceModal);
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
        render: (text, record) => (
          <span
            style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
            onClick={() => {
              setRowData(record);
              toggleInvoiceModal();
              // navigate(`/invoice/${record.id}`);
            }}
          >
            {text}
          </span>
        ),
      },
      {
        title: PAYMENT_DUE,
        dataIndex: "payment_due",
        key: PAYMENT_DUE,
        width: 95,
        ellipsis: true,
        className: "text-right",
        render: (payment_due: number, inv: any) => (
          <>{`${inv?.currency?.symbol}${payment_due.toFixed(2)}`}</>
        ),
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        className: "text-right",
        width: 80,
        ellipsis: true,
        render: (total: number, inv: any) => <>{`${inv?.currency?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 110,
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
    <div>
      <InvoiceDetailModal
        bool={invoiceModal}
        detail={rowData}
        isModal
        toggle={toggleInvoiceModal}
      />
      <Tablex
        transaction
        rowKey="invoice_no"
        columns={memoColumns}
        url={`${url}?filter=invoices`}
      />
    </div>
  );
};

export default Invoices;
