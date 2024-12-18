import { useEffect, useMemo, useState } from "react";
import { Table } from "antd";
import { Selectx, Spinner } from "app/shared";
import { Labels, endpoints } from "static";
import { useAxios, useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";

const { TRANSACTIONS } = endpoints;
const { DATE, QUANTITY, STATUS, TRANSACTION_TYPE, TRANSACTION_NUMBER } = Labels;

const Transactions = ({ url, symbol }: { url: string; symbol: string }) => {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<any>();
  const [statusOptions, setStatusOptions] = useState<any[]>([]);
  const [transactionStatus, setTransactionStatus] = useState<any>("All");
  const [transactionsItem, setTransactionsItem] = useState<any>("estimates");
  useEffect(() => {
    setOpen(true);
    callAxios({
      url: `${url}${TRANSACTIONS}?filter=${transactionsItem}&status=${transactionStatus}&page=1&view=15`,
    }).then((res) => {
      setTransactions(res?.transactions);
      setOpen(false);
    });
  }, [url, transactionStatus, transactionsItem]);
  useEffect(() => {
    setStatusOptions(Status[transactionsItem] || []);
    setTransactionStatus("All");
  }, [transactionsItem]);
  const memoColumns = useMemo(
    () => [
      {
        title: DATE,
        dataIndex:
          transactionsItem === "invoices"
            ? "invoice_date"
            : transactionsItem === "estimates"
            ? "estimate_date"
            : transactionsItem === "credit_notes"
            ? "credit_note_date"
            : transactionsItem === "bills"
            ? "bill_date"
            : "",
        key: DATE,
        width: 100,
        ellipsis: true,
        render: (order_date: string) => getOrganizationDate(order_date, org_date_format),
      },
      {
        title:
          transactionsItem === "invoices"
            ? "Invoice No"
            : transactionsItem === "bills"
            ? "Bill No"
            : transactionsItem === "credit_notes"
            ? "Credit Note No"
            : transactionsItem === "estimates"
            ? "Estimate No"
            : "",
        dataIndex:
          transactionsItem === "invoices"
            ? "invoice_no"
            : transactionsItem === "bills"
            ? "bill_no"
            : transactionsItem === "credit_notes"
            ? "credit_note_no"
            : transactionsItem === "estimates"
            ? "estimate_no"
            : "",
        key: TRANSACTION_TYPE,
        width: 100,

        ellipsis: true,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                const url = transactionsItem === "invoices"
                  ? `/invoice/${record.id}`
                  : transactionsItem === "bills"
                    ? `/bills/${record.id}`
                    : transactionsItem === "credit_notes"
                      ? `/creditnotes/${record.id}`
                      : transactionsItem === "estimates"
                        ? `/estimate/${record.id}`
                        : "/";

                window.location.href = url;
              } }
            >
              {text}
            </a>
          );
        },
      },
      {
        title: transactionsItem !== "bills" ? "Customer" : "Supplier",
        dataIndex: "",
        key: TRANSACTION_NUMBER,
        width: 115,
        className: "w-break",
        render: (record) => {
          return transactionsItem === "estimates"
            ? record.display_name
            : transactionsItem === "invoices"
            ? record.display_name
            : transactionsItem === "bills"
            ? record?.item_transaction_contact?.display_name
            : transactionsItem === "credit_notes"
            ? record?.item_transaction_contact?.display_name
            : "";
        },
      },
      {
        title: QUANTITY,
        dataIndex: "",
        key: QUANTITY,
        width: 70,
        render: (record) => {
          if (transactionsItem === "invoices" && record?.invoice_details) {
            return TransactionQuantity(record?.invoice_details);
          } else if (transactionsItem === "bills" && record?.bill_item_details) {
            return record.bill_item_details.reduce((prev, next) => prev + (next?.quantity ?? 0), 0);
          } else if (
            transactionsItem === "sales_orders" &&
            record?.sales_order_details_for_item_transaction
          ) {
            return TransactionQuantity(record?.sales_order_details_for_item_transaction);
          } else if (transactionsItem === "estimates") {
            return TransactionQuantity(record?.estimates_details_for_item_transaction);
          } else if (transactionsItem === "credit_notes") {
            return TransactionQuantity(record?.credit_note_details);
          }
          return null;
        },
      },
      {
        title: transactionsItem === "credit_notes" ? "Deduction" : "Unit price",
        dataIndex: "",
        key: "Unit price",
        width: 75,
        className: "text-right",
        render: (salesOrderDetails) => {
          if (transactionsItem === "invoices") {
            return <>{`${symbol}${TransactionTotal(salesOrderDetails?.invoice_details)}`}</>;
          } else if (transactionsItem === "estimates") {
            return (
              <>{`${symbol}${TransactionTotal(
                salesOrderDetails?.estimates_details_for_item_transaction
              )}`}</>
            );
          } else if (transactionsItem === "credit_notes") {
            const adjustment = salesOrderDetails?.credit_note_details?.[0]?.adjustment ?? 0;
            return <>{`${symbol}${adjustment}`}</>;
          } else if (transactionsItem === "bills") {
            return <>{`${symbol}${TransactionTotal(salesOrderDetails?.bill_item_details)}`}</>;
          }
          return null;
        },
      },

      {
        title: STATUS,
        dataIndex: "status",
        key: STATUS,
        width: 130,
        render: (status: string) => (
          <span
            className={`generic-badge   ${status === "partially paid"  ? "partially-paid" : status} ${status === "partially applied" ? 'partially-paid' : '' }`}
          >
            {capitalize(status)}
          </span>
        ),
      },
    ],
    [transactionsItem]
  );

  return (
    <>
      <div className="item-details-transactions mb-10 d-flex">
        <Selectx
          valueLabel
          options={items}
          handleSort={false}
          showSearch={false}
          allowClear={false}
          className="mr-20 h-36"
          popupClassName="overlap"
          defaultValue={transactionsItem}
          handleChange={(value) => setTransactionsItem(value)}
        />
        <Selectx
          valueLabel
          allowClear={false}
          showSearch={false}
          options={statusOptions}
          popupClassName="overlap"
          defaultValue={transactionStatus}
          handleChange={(value) => setTransactionStatus(value)}
        />
      </div>
      {open ? (
        <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
      ) : (
        <>
          <Table
            rowKey="key"
            bordered={false}
            pagination={false}
            columns={memoColumns}
            style={{ marginTop: "2px" }}
            dataSource={transactions?.data || []}
            className="generic-table no-radius transaction-tbl"
          />
        </>
      )}
    </>
  );
};

export default Transactions;

const items = [
  {
    key: "0",
    label: "Estimates",
    value: "estimates",
  },
  {
    key: "1",
    label: "Invoices",
    value: "invoices",
  },
  {
    key: "2",
    label: "Credit Notes",
    value: "credit_notes",
  },
  {
    key: "3",
    label: "Bills",
    value: "bills",
  },
];
const Status = {
  invoices: [
    {
      key: "0",
      label: "All",
      value: "all",
    },
    {
      key: "1",
      label: "Draft",
      value: "draft",
    },

    {
      key: "2",
      label: "Sent",
      value: "sent",
    },
    {
      key: "3",
      label: "Paid",
      value: "paid",
    },
    {
      key: "4",
      label: "PRTL Paid",
      value: "partially_paid",
    },
    {
      key: "5",
      label: "Overdue",
      value: "overdue",
    },
  ],
  credit_notes: [
    {
      key: "0",
      label: "All",
      value: "All",
    },
    {
      key: "1",
      label: "Draft",
      value: "Draft",
    },
    {
      key: "2",
      label: "Open",
      value: "Open",
    },
    {
      key: "3",
      label: "PRTL Applied",
      value: "partially_applied",
    },
    {
      key: "4",
      label: "Consumed",
      value: "consumed",
    },
  ],
  bills: [
    {
      key: "0",
      label: "All",
      value: "All",
    },
    {
      key: "1",
      label: "Paid",
      value: "paid",
    },
    {
      key: "2",
      label: "Draft",
      value: "draft",
    },
    {
      key: "3",
      label: "PRTL Paid",
      value: "partially_paid",
    },
    {
      key: "4",
      label: "Open",
      value: "open",
    },
    {
      key: "5",
      label: "Overdue",
      value: "overdue",
    },
  ],
  estimates: [
    {
      key: "0",
      label: "All",
      value: "All",
    },
    {
      key: "1",
      label: "Sent",
      value: "sent",
    },
    {
      key: "2",
      label: "Draft",
      value: "draft",
    },
    {
      key: "3",
      label: "Accepted",
      value: "accepted",
    },
    {
      key: "4",
      label: "Rejected",
      value: "rejected",
    },
    {
      key: "5",
      label: "Expired",
      value: "expired",
    },
    {
      key: "6",
      label: "Closed",
      value: "closed",
    },
  ],
};

const TransactionQuantity = (value: any[]) =>
  value?.reduce((prev, next) => prev + ((next?.quantity || next?.quantity_processed) ?? 0), 0);

const TransactionTotal = (value: any) => {
  let result = value?.reduce((prev, next) => {
    return prev + next?.amount;
  });
  return result?.amount?.toFixed(2) || 0;
};
