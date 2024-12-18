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
import { TransactionsProps } from "../Types";
import PurchaseOrders from "./PurchaseOrders";
import PurchaseReceives from "./PurchaseReceives";
import PaymentsReceived from "./PaymentsReceived";
import { usePermissions } from "app/Hooks";
import { AccessDenied } from "app/shared";

const { TRANSACTIONS } = endpoints;
// @ts-ignore
const Transactions = ({ url, contact_type, className }: TransactionsProps) => {
  const { checkPermission } = usePermissions();

  const { has_InvoiceView_permission } = checkPermission("InvoiceView");
  const { has_PaymentReceiptsView_permission } = checkPermission("PaymentReceiptsView");
  const { has_CreditNoteView_permission } = checkPermission("CreditNoteView");
  const { has_BillView_permission } = checkPermission("BillView");
  const { has_BillPaymentRecordView_permission } = checkPermission("BillPaymentRecordView");

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
              {has_InvoiceView_permission ? (
                <Invoices url={`${url}${TRANSACTIONS}`} />
              ) : (
                <AccessDenied />
              )}
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
          key: "4",
          label: "Payments receipts",
          children: (
            <>
              {has_PaymentReceiptsView_permission ? (
                <PaymentsReceived url={`${url}${TRANSACTIONS}`} />
              ) : (
                <AccessDenied />
              )}
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
          key: "6",
          label: "Credit notes",
          children: (
            <>
              {has_CreditNoteView_permission ? (
                <CreditNotes url={`${url}${TRANSACTIONS}`} />
              ) : (
                <AccessDenied />
              )}
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
          label: "Purchase Orders",
          hide: true,
          children: (
            <>
              <PurchaseOrders url={`${url}${TRANSACTIONS}`} />
            </>
          ),
        },
        {
          key: "2",
          label: "Purchase Receives",
          hide: true,
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
              {has_BillView_permission ? <Bills url={`${url}${TRANSACTIONS}`} /> : <AccessDenied />}
            </>
          ),
        },
        {
          key: "4",
          label: "Bill payments",
          children: (
            <>
              {has_BillPaymentRecordView_permission ? (
                <PaymentsMade url={`${url}${TRANSACTIONS}`} />
              ) : (
                <AccessDenied />
              )}
            </>
          ),
        },
      ].filter((col) => !col.hide),
    [url]
  );
  return (
    <Tabs
      className={`transaction-tab-inner ${className} custom--test`}
      items={contact_type === "customer" ? memoizeTabsCustomers : memoizeTabsVendor}
      defaultActiveKey={"1"}
    />
  );
};

export default Transactions;
