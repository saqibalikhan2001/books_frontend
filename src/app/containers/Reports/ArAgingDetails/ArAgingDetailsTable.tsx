import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";

const ArAgingDetailsTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();
  const customers = transactions?.agingsummarydetailscustomer || [];

  const transformedData = customers?.map((customer) => {
    const intervals = customer?.intervals || {};
    return {
      customer_id: customer.customer_id,
      customerName: customer.customer_name,
      customer_total: customer.customer_total,
      customer_balance_due_total: customer.customer_balance_due_total,
      intervals: Object.keys(intervals).map((intervalName) => {
        return {
          intervalName: intervals[intervalName].invoices[0],
          invoices: intervals[intervalName].invoices,
          credit_notes: intervals[intervalName].credit_notes,
        };
      }),
    };
  });
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division aging">
          <thead>
            <tr>
              {transactions?.headers?.header_columns?.map((column: any) => {
                return (
                  <th
                    className={`
              ${
                column == "Date"
                  ? "date"
                  : column == "Customer Name"
                  ? "customer-name"
                  : column == "Amount" || column == "Balance Due"
                  ? "price text-right"
                  : column == "Status"
                  ? "text-center"
                  : null
              }
              `}
                    {...(column == "Customer Name" && { colSpan: 2 })}
                  >
                    <span className={` ${column == "STATUS" ? "text-center" : ""}`}>{column}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {transformedData.map((customerData) => {
              if (customerData.intervals.length) {
                return (
                  <Fragment key={customerData.customerName}>
                    <tr>
                      <td colSpan={6}>
                        <strong>{customerData.customerName}</strong>
                      </td>
                      <td>
                        <Statistic
                          precision={2}
                          value={customerData.customer_total}
                          prefix={transactions?.currency?.symbol}
                          valueStyle={{
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        />
                      </td>
                      <td colSpan={1}>
                        <Statistic
                          precision={2}
                          className="no-space truncate_amount "
                          prefix={transactions?.currency?.symbol}
                          value={customerData.customer_balance_due_total}
                          valueStyle={{
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        />
                      </td>
                    </tr>
                    {customerData.intervals.map((intervalData) => (
                      <Fragment key={intervalData.intervalName.header}>
                        <tr>
                          <td style={{ textTransform: "capitalize" }} colSpan={8}>
                            {intervalData.intervalName.header}
                          </td>
                          {transactions?.sum_columns.map((value, index) => {
                            if (
                              value.interval === intervalData.intervalName.header &&
                              value.customer_id === customerData.customer_id
                            ) {
                              return (
                                <Fragment key={`${value.interval}-${index}`}>
                                  <td>
                                    <Statistic
                                      precision={2}
                                      value={value.interval_total}
                                      prefix={transactions?.currency?.symbol}
                                      valueStyle={{
                                        fontSize: "14px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    />
                                  </td>
                                  <td colSpan={1}>
                                    <Statistic
                                      precision={2}
                                      className="no-space truncate_amount"
                                      prefix={transactions?.currency?.symbol}
                                      value={value.interval_balance_due_total}
                                      valueStyle={{
                                        fontSize: "14px",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                      }}
                                    />
                                  </td>
                                </Fragment>
                              );
                            }
                            return null;
                          })}
                        </tr>
                        {intervalData?.invoices?.map((invoiceData) => (
                          <tr key={invoiceData.transaction_no}>
                            <td>{getOrganizationDate(invoiceData.date, org_date_format)}</td>
                            <td>{invoiceData.transaction_no}</td>
                            <td>{capitalize(invoiceData.type)}</td>
                            <td className="p-5">
                              <div
                                className={`generic-badge no-break ${
                                  invoiceData?.status && invoiceData?.status === "partially applied"
                                    ? "partially-applied"
                                    : invoiceData?.status === "partially paid"
                                    ? "partially-paid"
                                    : invoiceData?.status
                                }`}
                              >
                                {invoiceData?.status === "partially applied"
                                  ? "PRTL Applied"
                                  : invoiceData?.status === "partially paid"
                                  ? "PRTL Paid"
                                  : invoiceData?.status}
                              </div>
                            </td>
                            <td colSpan={2}>{invoiceData.customer_name}</td>
                            <td>
                              <Statistic
                                precision={2}
                                value={invoiceData.amount}
                                prefix={transactions?.currency?.symbol}
                                valueStyle={{
                                  fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              />
                            </td>
                            <td>
                              <Statistic
                                precision={2}
                                value={invoiceData.balance_due}
                                prefix={transactions?.currency?.symbol}
                                valueStyle={{
                                  fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                        {intervalData?.credit_notes?.map((creditNoteData) => (
                          <tr key={creditNoteData.transaction_no}>
                            <td>{getOrganizationDate(creditNoteData.date, org_date_format)}</td>
                            <td>{creditNoteData.transaction_no}</td>
                            <td>{creditNoteData.type}</td>
                            <td className="p-5">
                              <div
                                className={`generic-badge no-break ${
                                  creditNoteData?.status &&
                                  creditNoteData?.status === "partially applied"
                                    ? "partially-applied"
                                    : creditNoteData?.status === "partially paid"
                                    ? "partially-paid"
                                    : creditNoteData?.status
                                }`}
                              >
                                {creditNoteData?.status === "partially applied"
                                  ? "PRTL Applied"
                                  : creditNoteData?.status === "partially paid"
                                  ? "PRTL Paid"
                                  : creditNoteData?.status}
                              </div>
                            </td>
                            <td colSpan={2}>{creditNoteData.customer_name}</td>
                            <td className="text-right">
                              <Statistic
                                precision={2}
                                className="no-space truncate_amount "
                                value={`-${creditNoteData.amount}`}
                                prefix={transactions?.currency?.symbol}
                                valueStyle={{
                                  fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              />
                            </td>
                            <td className="text-right">
                              <Statistic
                                precision={2}
                                className="no-space truncate_amount"
                                prefix={transactions?.currency?.symbol}
                                value={`-${creditNoteData.balance_due}`}
                                valueStyle={{
                                  fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </Fragment>
                );
              } else {
                return null;
              }
            })}
            <tr>
              <td colSpan={6} className="text-right">
                Total
              </td>
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.total}
                  prefix={transactions?.currency?.symbol}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                />
              </td>
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  prefix={transactions?.currency?.symbol}
                  value={transactions?.balance_due_total}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ArAgingDetailsTable;
