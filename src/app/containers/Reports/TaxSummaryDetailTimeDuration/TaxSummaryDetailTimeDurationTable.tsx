import { Fragment } from "react";
import { Statistic } from "antd";

const TaxSummaryDetailTimeDurationTable = ({ transactions = [] }: any) => {
  const currencySymbol = transactions?.organization?.base_currency?.symbol || "";

  return (
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="tax">Product Name</th>
            <th className="tax">SKU</th>
            <th className="tax">Tax Name</th>
            <th className="rate">Current rate</th>
            <th className="price text-right">Expected tax to collect</th>
            <th className="price text-right">Collected tax</th>
            <th className="price text-right">Expected tax to pay</th>
            <th className="price text-right">Paid tax</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.data?.map((taxReport, index) => (
            <Fragment key={index}>
              <tr key={index}>
                <td rowSpan={taxReport.length}>{taxReport.name}</td>
                <td colSpan={1}>{taxReport.sku}</td>
                <td colSpan={6}>
                    <table>
                        {taxReport.taxes.map((tax, taxIndex) => (
                        <tr key={taxIndex}>
                            <td >{tax.tax_name} </td>
                            <td> {tax.tax_rate}</td>
                            <td>
                            <Statistic
                                precision={2}
                                className="truncate_amount text-right"
                                value={tax.invoice_tax_amount || 0}
                                valueStyle={{ fontSize: "14px" }}
                                prefix={currencySymbol}
                            />
                            </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="no-space truncate_amount text-right"
                                value={tax.invoice_paid_tax || 0}
                                valueStyle={{
                                fontSize: "14px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                                prefix={currencySymbol}
                            />
                            </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="no-space "
                                value={tax.bill_tax_amount || 0}
                                valueStyle={{
                                fontSize: "14px",
                                display: "flex",
                                justifyContent: "flex-end",
                                }}
                                prefix={currencySymbol}
                            />
                            </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="no-space truncate_amount text-right"
                                value={tax.bill_paid_tax || 0}
                                valueStyle={{
                                fontSize: "14px",
                                display: "flex",
                                justifyContent: "flex-end",
                                }}
                                prefix={currencySymbol}
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
            <td colSpan={4} className="text-left">
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

export default TaxSummaryDetailTimeDurationTable;
