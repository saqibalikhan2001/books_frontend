/** @format */

import { useMemo } from "react";
import { Tabs } from "antd";
import Bills from "./Bills";
import Invoices from "./Invoices";
import Packages from "./Packages";
import { endpoints } from "static";
import SalesOrders from "./SalesOrders";
import SalesReturn from "./SalesReturn";
import CreditNotes from "./CreditNotes";
import PaymentsMade from "./PaymentsMade";
import PurchaseOrders from "./PurchaseOrders";
import PurchaseReceives from "./PurchaseReceives";
import PaymentsReceived from "./PaymentsReceived";

const { TRANSACTIONS } = endpoints;

const Transactions = ({ url, contact_type }: any) => {
  const memoizeTabsCustomers = useMemo(
    () =>
      [
        {
          key: "1",
          label: "Sales Orders",
          hide: true,
          children: (
            <>
              <SalesOrders url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "2",
          label: "Invoices",
          children: (
            <>
              <Invoices url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "3",
          label: "Packages",
          hide: true,
          children: (
            <>
              <Packages url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "Payments Received",
          label: "Payments receipts",
          children: (
            <>
              <PaymentsReceived url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "5",
          label: "Sales Return",
          hide: true,
          children: (
            <>
              <SalesReturn url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "4",
          label: "Credit notes",
          children: (
            <>
              <CreditNotes url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
      ].filter((col) => !col.hide),
    [url]
  );

  const memoizeTabsVendor = useMemo(
    () =>
      [
        {
          key: "1",
          hide: true,
          label: "Purchase orders",
          children: (
            <>
              <PurchaseOrders url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "2",
          hide: true,
          label: "Purchase receives",
          children: (
            <>
              <PurchaseReceives url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "3",
          label: "Bills",
          children: (
            <>
              <Bills url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "4",
          label: "Bill payments",
          children: (
            <>
              <PaymentsMade url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
      ].filter((col) => !col.hide),
    [url]
  );
  return (
    <Tabs
      className="transaction-tab-inner"
      items={contact_type === "customer" ? memoizeTabsCustomers : memoizeTabsVendor}
      defaultActiveKey={"1"}
      tabPosition={"left"}
    />
  );
};

export default Transactions;
