import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const ReceivableDetailsTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="report-title-name">Customer name</th>
            <th className="date">Date</th>
            <th className="">Transaction</th>
            <th className="refs">Reference</th>
            <th className="status-badge">Status</th>
            <th className="transaction-type">Transaction type</th>
            <th className="item-title">Product name</th>
            <th className="qty-order text-right">Quantity ordered</th>
            <th className="item-price text-right">Product price (BCY)</th>
            <th className="total-price text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.map((report, index) => {
            return (
              <Fragment key={index}>
                <tr>
                  <td>{report?.customer_name}</td>
                  <td>{getOrganizationDate(report?.date, org_date_format)}</td>
                  <td>{report?.transaction_no}</td>
                  <td>{report?.reference}</td>
                  <td>
                    <div className="action-preference w-100">
                      <div
                        className={`generic-badge no-break ${
                          report?.status && report?.status === "partially applied"
                            ? "partially-applied"
                            : report?.status === "partially paid"
                            ? "partially-paid"
                            : report?.status
                        }`}
                      >
                        {report?.status === "partially applied"
                          ? "PRTL Applied"
                          : report?.status === "partially paid"
                          ? "PRTL Paid"
                          : report?.status}
                      </div>
                    </div>
                  </td>
                  <td className="no-break">{report?.type}</td>
                  <td>{report?.item_name}</td>
                  <td className="text-right">{report?.quantity}</td>
                  <td className="text-right">
                    <Statistic
                      precision={2}
                      value={report?.rate}
                      className="no-space truncate_amount"
                      valueStyle={{ fontSize: "14px", justifyContent: "flex-end" }}
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                  <td className="text-right">
                    <Statistic
                      precision={2}
                      value={report?.total || 0}
                      prefix={report?.currency_symbol}
                      className="no-space truncate_amount"
                      valueStyle={{ fontSize: "14px", justifyContent: "flex-end" }}
                    />
                  </td>
                </tr>
              </Fragment>
            );
          })}
          <tr>
            <td colSpan={9} className="text-right">
              Total
            </td>
            <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions?.total}
                className="no-space truncate_amount"
                prefix={transactions?.organization?.base_currency?.symbol}
                valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent: "flex-end" }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </>
  );
};

export default ReceivableDetailsTable;
