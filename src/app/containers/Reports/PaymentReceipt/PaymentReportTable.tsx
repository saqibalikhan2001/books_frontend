import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

export const PaymentReportTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division payment-receipt--report">
        <thead>
          <tr>
            <th className="date">Date</th>
            <th className="document-no">Payment no.</th>
            <th className="document-no">Invoice no.</th>
            <th className="customer-name w-20">Customer name</th>
            <th className="method">Payment Method</th>
            <th className="refs">Reference</th>
            <th className="note">Notes</th>
            <th className="price text-right">Amount</th>
            <th className="price text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.map((report, index) => (
            <Fragment key={index}>
              <tr>
                <td>{getOrganizationDate(report?.payment_date, org_date_format)}</td>
                <td>{report.payment_no}</td>
                <td>{report.invoice_no}</td>
                <td>{report.display_name}</td>
                <td>{report.payment_mode}</td>
                <td>{report.refernce}</td>
                <td>{report.note}</td>

                <td>
                  <Statistic
                    precision={2}
                    value={report.payment_made || 0}
                    valueStyle={{ fontSize: "14px" }}
                    className="no-space truncate_amount text-right"
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>
                <td>
                  <Statistic
                    precision={2}
                    valueStyle={{ fontSize: "14px" }}
                    value={report.unused_amount || 0}
                    className="no-space truncate_amount text-right"
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>
              </tr>
            </Fragment>
          ))}
          <tr>
            <td colSpan={7} className="text-right">
              Total
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions?.total_paid_amount}
                className="no-space truncate_amount text-right"
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions?.total_unused_amount}
                className="no-space truncate_amount text-right"
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
