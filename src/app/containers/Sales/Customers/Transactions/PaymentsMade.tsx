/** @format */

import { useMemo } from "react";
import { Labels } from "static";
import { Tablex } from "app/shared";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const { DATE, TYPE, REFERENCE, AMOUNT } = Labels;

const PaymentsMade = ({ url }: { url: string }) => {
  const { org_date_format } = useStore();
  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex: "payment_date",
        key: DATE,
        width: 80,
        ellipsis: true,
        render: (payment_date: string) => getOrganizationDate(payment_date, org_date_format),
      },
      {
        title: REFERENCE,
        dataIndex: "reference",
        key: REFERENCE,
        width: 100,
        ellipsis: true,
      },
      {
        title: AMOUNT,
        dataIndex: "amount",
        key: AMOUNT,
        className:"text-right",
        width: 100,
        ellipsis: true,
        render: (total: number, bill: any) => <>{`${bill?.currency?.symbol}${total.toFixed(2)}`}</>,
      },
      {
        title: TYPE,
        dataIndex: "payment_mode",
        key: TYPE,
        width: 100,
        ellipsis: true,
      },
    ],
    [org_date_format]
  );
  return (
    <Tablex transaction rowKey="id" columns={memoColumns} url={`${url}?filter=payments_made`} />
  );
};

export default PaymentsMade;
