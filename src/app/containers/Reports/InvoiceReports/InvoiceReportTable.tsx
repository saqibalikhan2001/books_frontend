import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const InvoiveReportTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="date">Invoice Date</th>
              <th className="date">Due Date</th>
              <th className="document-no">Invoice No.</th>
              <th className="sale"> Sale Order/Est No.</th>
              <th className="customer-name">Customer Name</th>
              <th className="status-badge">Status</th>
              <th className="price text-right">Balance Due</th>
              <th className="price text-right">Invoice Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((invoicereport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>
                    {invoicereport?.invoice_date
                      ? getOrganizationDate(invoicereport?.invoice_date, org_date_format)
                      : ""}
                  </td>
                  <td>
                    {invoicereport?.due_date
                      ? getOrganizationDate(invoicereport?.due_date, org_date_format)
                      : ""}
                  </td>
                  <td>{invoicereport?.invoice_no}</td>
                  <td>{invoicereport?.sales_order_no}</td>
                  <td>{invoicereport?.customer_name}</td>
                  <td>
                    <div className="action-preference w-100">
                      <div
                        className={`generic-badge no-break ${
                          invoicereport?.status && invoicereport?.status === "partially applied"
                            ? "partially-applied"
                            : invoicereport?.status === "partially paid"
                            ? "partially-paid"
                            : invoicereport?.status
                        }`}
                      >
                        {invoicereport?.status === "partially applied"
                          ? "PRTL Applied"
                          : invoicereport?.status === "partially paid"
                          ? "PRTL Paid"
                          : invoicereport?.status}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      value={invoicereport?.balance_due}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      value={invoicereport?.invoice_amount || 0}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={6} className="text-right">
                Total
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  value={transactions?.total_payment_due}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.total_invoiced_amount}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InvoiveReportTable;
