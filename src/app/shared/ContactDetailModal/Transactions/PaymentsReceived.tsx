/** @format */

import { useMemo } from "react";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils/date_formattor";

const { DATE, PAYMENT_NO, REFERENCE, AMOUNT, TYPE } = Labels;

const PaymentsReceived = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();

  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "created_at",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (created_at: string) => getOrganizationDate(created_at, org_date_format),
      },
      {
        title: PAYMENT_NO,
        dataIndex: "payment_no",
        key: PAYMENT_NO,
        width: 100,
        ellipsis: true,
      },
      {
        title: REFERENCE,
        dataIndex: "reference",
        key: REFERENCE,
        width: 75,
        ellipsis: true,
      },
      {
        title: AMOUNT,
        dataIndex: "payment_made",
        key: AMOUNT,
        align:'right',
        width: 110,
        ellipsis: true,
        render: (payment_made: number, payment: any) => (
          <>{`${payment?.currency?.symbol}${payment_made.toFixed(2)}`}</>
        ),
      },
      {
        title: TYPE,
        dataIndex: "payment_mode",
        key: TYPE,
        width: 100,
        ellipsis: true,
      },
    ],
    []
  );
  return (
    <Tablex
      transactionData
      rowKey="payment_no"
      columns={memoColumns}
      url={`${url}?filter=payments_received`}
    />
  );
};

export default PaymentsReceived;
