import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const ReceivableSummaryTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="customer-name">Customer name</th>
            <th className="date">Date</th>
            <th className="document-no">Transaction</th>
            <th className="refs">Reference</th>
            <th className="status-badge">Status</th>
            <th className="transaction-type">Transaction type</th>
            <th className="price text-right">Total</th>
            <th className="price text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.map((receivableReport, index) => (
            <Fragment key={index}>
              <tr>
                <td>{receivableReport?.customer_name}</td>
                <td>{getOrganizationDate(receivableReport.date, org_date_format)}</td>
                <td>{receivableReport.transaction_no}</td>
                <td>{receivableReport.reference}</td>
                <td>
                  <div className="action-preference w-100">
                    <div
                      className={`generic-badge no-break ${
                        receivableReport?.status && receivableReport?.status === "partially applied"
                          ? "partially-applied"
                          : receivableReport?.status === "partially paid"
                          ? "partially-paid"
                          : receivableReport?.status
                      }`}
                    >
                      {receivableReport?.status === "partially applied"
                        ? "PRTL Applied"
                        : receivableReport?.status === "partially paid"
                        ? "PRTL Paid"
                        : receivableReport?.status}
                    </div>
                  </div>
                </td>
                <td>{receivableReport.type}</td>
                <td>
                  <Statistic
                    precision={2}
                    className="no-space truncate_amount text-right"
                    value={receivableReport.total || 0}
                    prefix={receivableReport?.currency_symbol}
                    valueStyle={{ fontSize: "14px" }}
                  />
                </td>
                <td>
                  <Statistic
                    precision={2}
                    valueStyle={{ fontSize: "14px" }}
                    value={receivableReport.balance || 0}
                    prefix={receivableReport?.currency_symbol}
                    className="no-space  truncate_amount text-right"
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
                precision={2}
                value={transactions?.total}
                className="no-space truncate_amount"
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions?.balance}
                className="no-space truncate_amount"
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

export default ReceivableSummaryTable;
