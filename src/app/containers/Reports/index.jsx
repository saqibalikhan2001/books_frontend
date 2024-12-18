import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import { routeNames } from "static";
import { SubHeader } from "./SubHeader";

const {
  LEDGER,
  JOURNAL,
  TAX_SUMMARY,
  PAYMENT_MADE,
  BILL_REPORTS,
  REPORT_REFUND,
  TRIAL_BALANCE,
  PAYMENT_REPORT,
  INVOICE_REPORT,
  SALES_BY_ITEMS,
  LEDGER_REPORTS,
  ESTIMATES_REPORT,
  AR_AGING_DETAILS,
  CUSTOMER_BALANCE,
  AR_AGING_SUMMARY,
  SALES_BY_CUSTOMER,
  RECEIVABLE_DETAIL,
  RECEIVABLE_SUMMARY,
  TAX_SUMMARY_DETAIL,
  CREDIT_NOTES_REPORTS,
  SALES_BY_SALESPERSON,
  TAX_SUMMARY_TIMEDURATION,
  INVOICE_REPORT_BY_CUSTOMER,
  TAX_SUMMARY_DETAILS_CUSTOMER,
  TAX_SUMMARY_DETAILS_SUPPLIER,
  TAX_SUMMARY_DETAIL_TAX_SUMMARY_TIMEDURATION,
  BILL_BY_VENDOR,
  BILL_PAYMENT_BY_VENDOR,
  ESTIMATES_BY_CUSTOMER_REPORT,
  CREDIT_NOTES_BY_CUSTOMER_REPORT,
  REFUND_BY_CUSTOMER_REPORT,
  PAYMENT_BY_CUSTOMER_REPORT,
} = routeNames;

const sections = [
  {
    title: "Accounts",
    items: [
      { navigateTo: JOURNAL, name: "Journal" },
      { navigateTo: LEDGER, name: "Ledger" },
      { navigateTo: TRIAL_BALANCE, name: "Trial Balance" },
      { navigateTo: LEDGER_REPORTS, name: "General Ledger" },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/accounts.svg",
  },
  {
    title: "Sales",
    items: [
      { navigateTo: SALES_BY_ITEMS, name: "Sales By Product" },
      { navigateTo: SALES_BY_CUSTOMER, name: "Sales By Customer" },
      { navigateTo: SALES_BY_SALESPERSON, name: "Sales By Sales Person" },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/sales.svg",
  },
  {
    title: "Receivables",
    items: [
      { navigateTo: INVOICE_REPORT, name: "Invoice" },
      { navigateTo: INVOICE_REPORT_BY_CUSTOMER, name: "Invoice By Customer" },
      { navigateTo: ESTIMATES_REPORT, name: "Estimates" },
      { navigateTo: ESTIMATES_BY_CUSTOMER_REPORT, name: "Estimates By Customer" },
      { navigateTo: CUSTOMER_BALANCE, name: "Customer Balance" },
      { navigateTo: RECEIVABLE_SUMMARY, name: "Receivable Summary" },
      { navigateTo: RECEIVABLE_DETAIL, name: "Receivable Details" },
      { navigateTo: AR_AGING_SUMMARY, name: "Ar Aging Summary" },
      { navigateTo: AR_AGING_DETAILS, name: "Ar Aging Details" },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/receivables.svg",
  },
  {
    title: "Purchase",
    items: [
      { navigateTo: BILL_REPORTS, name: "Bill" },
      { navigateTo: BILL_BY_VENDOR, name: "Bill By Supplier" },
      { navigateTo: PAYMENT_MADE, name: "Bill Payment" },
      { navigateTo: BILL_PAYMENT_BY_VENDOR, name: "Bill Payment By Supplier" },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/purchases.svg",
  },
  {
    title: "Payment Receipts",
    items: [
      { navigateTo: REPORT_REFUND, name: "Refund" },
      { navigateTo: REFUND_BY_CUSTOMER_REPORT, name: "Refund By Customer" },
      { navigateTo: PAYMENT_REPORT, name: "Payment Receipts" },
      { navigateTo: PAYMENT_BY_CUSTOMER_REPORT, name: "Payment Receipts By Customer" },
      { navigateTo: CREDIT_NOTES_REPORTS, name: "Credit Notes" },
      { navigateTo: CREDIT_NOTES_BY_CUSTOMER_REPORT, name: "Credit Notes By Customer" },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/payments-received.svg",
  },
  {
    title: "Taxes",
    items: [
      { navigateTo: TAX_SUMMARY, name: "Tax Summary" },
      { navigateTo: TAX_SUMMARY_DETAIL, name: "Tax By Products" },
      {
        navigateTo: TAX_SUMMARY_TIMEDURATION,
        name: "Tax Summary (Time Duration)",
        // skip: window?.location?.href?.includes("books.seebiz.cloud") ? true : false,
      },
      {
        navigateTo: TAX_SUMMARY_DETAIL_TAX_SUMMARY_TIMEDURATION,
        name: "Tax By Products (Time Duration)",
        // skip: window?.location?.href?.includes("books.seebiz.cloud") ? true : false,
      },
      {
        navigateTo: TAX_SUMMARY_DETAILS_CUSTOMER,
        name: "Tax By Customer",
        // skip: window?.location?.href?.includes("books.seebiz.cloud") ? true : false,
      },
      {
        navigateTo: TAX_SUMMARY_DETAILS_SUPPLIER,
        name: "Tax By Supplier",
        // skip: window?.location?.href?.includes("books.seebiz.cloud") ? true : false,
      },
    ],
    img: "https://s3.us-west-2.amazonaws.com/ims-development/static/media/sales.svg",
  },
];
const getClassNames = (title) => {
  switch (title) {
    case "Payments Received":
      return "payments_received_card";
    case "Purchase":
      return "purchase_card";
    case "Sales":
      return "sales_card";
    case "Receivables":
      return "receivables_card";
    case "Taxes":
      return "tax-summary";
    default:
      return "";
  }
};
export default function Reports() {
  return (
    <div className="reports_list_page">
      <SubHeader enable={true} noData={false} />
      <div className="report_listing">
        {sections.map((section, index) => (
          <div className={`report_card ${getClassNames(section.title)}`} key={index}>
            <Typography className="reports_title">{section.title}</Typography>
            <div className="report_list">
              <List items={section.items} />
              <ItemImage image={section.img} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const ListItem = ({ item }) => {
  return (
    <div className="reports_item d-flex align-center">
      <div className="list_icon">
        <img
          src={
            // !item.skip
            "https://s3.us-west-2.amazonaws.com/ims-development/static/media/bullet-point.svg"
            // : ""
          }
          alt=""
        />
      </div>
      {/* {!item.skip && ( */}
      <Link to={`${item.navigateTo}`} state={getStateObject(item.name)}>
        <Typography className="item_title">{item.name}</Typography>
      </Link>
      {/* )} */}
    </div>
  );
};

const getStateObject = (name) => {
  if (name === "Ledger") {
    return {
      from: "Ledger",
    };
  } else if (name === "Journal") {
    return {
      from: "Journal",
    };
  } else if (name === "Trial Balance") {
    return {
      from: "Trial Balance",
    };
  } else {
    return {};
  }
};

const List = ({ items }) => {
  return (
    <>
      <ul className="report_item_list">
        {items.map((item, index) => (
          <ListItem key={index} item={item} />
        ))}
      </ul>
    </>
  );
};

const ItemImage = (img) => {
  return (
    <>
      <div className="report_icon">
        <img src={img?.image} />
      </div>
    </>
  );
};
