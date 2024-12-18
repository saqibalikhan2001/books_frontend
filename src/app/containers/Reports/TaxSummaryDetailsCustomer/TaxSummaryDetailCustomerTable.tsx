import { Statistic } from "antd";
import { Fragment } from "react";

const TaxSummaryDetailsCustomerTable = ({ transactions = [] }: any) => {
  return (
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="tax">Customer Name</th>
            <th className="price text-right">Tax Name</th>
            <th className="price text-right">Tax Rate</th>
            <th className="price text-right">Expected Tax to Collect</th>
            <th className="price text-right">Collected Tax</th>
          </tr>
        </thead>
        <tbody>
           {transactions?.data?.data?.map((taxReport, index) => (
            <Fragment key={index}>
              <tr key={index}>
                <td rowSpan={taxReport.length}>{taxReport.display_name}</td>
                <td colSpan={6}>
                    <table>
                        {taxReport.taxes.map((tax, taxIndex) => (
                        <tr key={taxIndex}>
                            <td className="text-right">{tax.tax_name} </td>
                            <td className="text-right">{tax.tax_rate} </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="text-right"
                                value={tax.invoice_tax_amount || 0}
                                valueStyle={{ fontSize: "14px" }}
                                prefix={transactions?.organization?.base_currency?.symbol}
                            />
                            </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="text-right"
                                value={tax.invoice_paid_tax || 0}
                                valueStyle={{
                                fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                                prefix={transactions?.organization?.base_currency?.symbol}
                            />
                            </td>
                        </tr>
                        ))}
                    </table>
                </td>
                </tr>
            </Fragment>
          ))}
          <tr>
            <td className="text-left">Total</td>
            <td style={{ borderTop: "2px solid #ccc" }}></td>
            <td style={{ borderTop: "2px solid #ccc" }}></td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions.expected_tax_to_collect || 0}
                className="text-right"
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions.collected_tax || 0}
                className="text-right"
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

export default TaxSummaryDetailsCustomerTable;
