import { Fragment } from "react";
import { Statistic } from "antd";

const TaxSummaryReportTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="tax">Tax</th>
              <th className="authority">Authority</th>
              <th className="rate">Current rate</th>
              <th className="price text-right">Expected tax to collect</th>
              <th className="price text-right">Collected tax</th>
              <th className="price text-right">Expected tax to pay</th>
              <th className="price text-right">Paid tax</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((taxReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{taxReport.name}</td>
                  <td>{taxReport.authority}</td>
                  <td>{taxReport.rate}%</td>
                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={taxReport.invoice_tax_amount || 0}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={taxReport.invoice_paid_tax || 0}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={taxReport.bill_tax_amount || 0}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={taxReport.bill_paid_tax || 0}
                      className="no-space truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={3} className="text-right">
                Total
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.expected_tax_to_collect}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.collected_tax}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.expected_tax_to_pay}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.paid_tax}
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

export default TaxSummaryReportTable;
