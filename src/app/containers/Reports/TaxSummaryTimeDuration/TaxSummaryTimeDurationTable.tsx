import { Fragment } from "react";
import { Statistic } from "antd";
import { getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";

const TaxSummaryTimeDurationTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();
  const currencySymbol = transactions?.organization?.base_currency?.symbol || "";

  return (
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="tax w-10">Tax</th>
            <th className="tax">Duration</th>
            <th className="authority">Authority</th>
            <th className="count">Current rate</th>
            <th className="price text-right">Expected tax to collect</th>
            <th className="price text-right">Collected tax</th>
            <th className="price text-right">Expected tax to pay</th>
            <th className="price text-right">Paid tax</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.taxes?.map((taxReport, index) => (
            <Fragment key={index}>
              {taxReport.tax_history.map((taxHistory, historyIndex) => (
                <tr key={historyIndex}>
                  {/* Tax Name */}
                  {historyIndex === 0 && <td rowSpan={taxReport.tax_history.length}>{taxReport.tax_name}</td>}
                  
                  {/* Duration */}
                  <td>
                    {getOrganizationDate(taxHistory.start_date, org_date_format)} -{" "}
                    {getOrganizationDate(taxHistory.end_date, org_date_format)}
                  </td>

                  {/* Authority */}
                  {historyIndex === 0 && <td rowSpan={taxReport.tax_history.length}>{taxReport.authority}</td>}

                  {/* Current Rate */}
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={taxHistory.rate || 0}
                      valueStyle={{ fontSize: "14px" }}
                      prefix={currencySymbol}
                    />
                  </td>

                  {/* Expected Tax to Collect */}
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={taxHistory.invoice_tax_amount || 0}
                      valueStyle={{ fontSize: "14px" ,display:"flex",justifyContent:"flex-end"}}
                      prefix={currencySymbol}
                    />
                  </td>

                  {/* Collected Tax */}
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={taxHistory.invoice_paid_tax || 0}
                      valueStyle={{ fontSize: "14px",display:"flex",justifyContent:"flex-end" }}
                      prefix={currencySymbol}
                    />
                  </td>

                  {/* Expected Tax to Pay */}
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={taxHistory.bill_tax_amount || 0}
                      valueStyle={{ fontSize: "14px" ,display:"flex",justifyContent:"flex-end"}}
                      prefix={currencySymbol}
                    />
                  </td>

                  {/* Paid Tax */}
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={taxHistory.bill_paid_tax || 0}
                      valueStyle={{ fontSize: "14px" ,display:"flex",justifyContent:"flex-end"}}
                      prefix={currencySymbol}
                    />
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
          <tr>
            <td colSpan={4} className="text-right">
              Total
            </td>
            <td colSpan={0} style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="text-right"
                value={transactions?.expected_tax_to_collect}
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td colSpan={0} style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="text-right"
                value={transactions?.collected_tax}
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="text-right"
                value={transactions?.expected_tax_to_pay}
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="text-right"
                value={transactions?.paid_tax}
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

export default TaxSummaryTimeDurationTable;
