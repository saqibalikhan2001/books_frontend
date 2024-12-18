/** @format */

import { useMemo, useState } from "react";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils/date_formattor";
// import { useNavigate } from "react-router";
import { PaymentReceivedDetailModal } from "../../PaymentsReceived/PaymentsReceivedDetailModal";

const { DATE, PAYMENT_NO, REFERENCE, AMOUNT, TYPE } = Labels;

const PaymentsReceived = ({ url }: { url: string }) => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [rowData, setRowData] = useState<any>(null);
  const { org_date_format } = useStore();
  // const navigate = useNavigate();
  const togglePaymentModal = () => setPaymentModal(!paymentModal);

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "created_at",
        key: DATE,
        width: 100,
        ellipsis: true,
        render: (created_at: string) => getOrganizationDate(created_at, org_date_format),
      },
      {
        title: PAYMENT_NO,
        dataIndex: "payment_no",
        key: PAYMENT_NO,
        width: 100,
        ellipsis: true,
        render: (text, record) => {
          return (
            <span
              style={{ cursor: "pointer", textDecoration: "underline", color: "#0050A8" }}
              onClick={() => {
                setRowData(record);
                togglePaymentModal();
                // navigate(`/paymentsreceived/${record.payment_no}`);
              }}
            >
              {text}
            </span>
          );
        },
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
        dataIndex: "payment_made",
        key: AMOUNT,
        width: 90,
        className: "text-right",
        ellipsis: true,
        render: (payment_made: number, payment: any) => (
          <>{`${payment?.currency?.symbol}${payment_made.toFixed(2)}`}</>
        ),
      },
      {
        title: TYPE,
        dataIndex: "payment_mode",
        key: TYPE,
        width: 120,
        ellipsis: true,
      },
    ],
    []
  );
  return (
    <div>
      <PaymentReceivedDetailModal
        isModal
        bool={paymentModal}
        detail={{ ...rowData, id: Number(rowData?.payment_no) }}
        toggle={togglePaymentModal}
      />
      <Tablex
        transactionData
        rowKey="payment_no"
        columns={memoColumns}
        url={`${url}?filter=payments_received`}
      />
    </div>
  );
};

export default PaymentsReceived;
