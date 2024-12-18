/** @format */

import { useMemo, useState } from "react";
import { Tag } from "antd";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";
// import { useNavigate } from "react-router";
import { BillsDetailModal } from "app/containers/Purchases/Bills/BillsDetailModal";

const { DATE, BILL_NO, DUE, AMOUNT, STATUS } = Labels;

const Bills = ({ url }: { url: string }) => {
  const [billModal, setBillModal] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const { org_date_format } = useStore();
  // const navigate = useNavigate();
  const toggleBillModal = () => setBillModal(!billModal);

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
        render: (text, record) => {
          return (
            <span
              style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
              onClick={() => {
                // navigate(`/bill/${record.id}`);
                setRowData(record);
                toggleBillModal();
              }}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: DUE,
        dataIndex: "balance_due",
        key: DUE,
        width: 100,
        className: "text-right",
        ellipsis: true,
        render: (payment_due: number, bill: any) => (
          <>{`${bill?.currency?.symbol}${payment_due.toFixed(2)}`}</>
        ),
      },
      {
        title: AMOUNT,
        dataIndex: "total",
        key: AMOUNT,
        width: 100,
        className: "text-right",
        ellipsis: true,
        render: (total: number, bill: any) => <>{`${bill?.currency?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 100,
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
    <div>
      <BillsDetailModal isModal bool={billModal} detail={rowData} toggle={toggleBillModal} />
      <Tablex
        transaction
        rowKey="bill_no"
        columns={memoColumns || []}
        url={`${url}?filter=bills`}
      />
    </div>
  );
};

export default Bills;
