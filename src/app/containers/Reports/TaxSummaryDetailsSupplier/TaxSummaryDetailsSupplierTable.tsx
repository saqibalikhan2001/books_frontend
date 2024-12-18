import { Fragment } from "react";
import { Statistic } from "antd";

const TaxSummaryDetailsSupplierTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="tax">Supplier Name</th>
              <th className="price ">Tax Name</th>
              <th className="price ">Tax Rate</th>
              <th className="price text-right">Expected tax to collect</th>
              <th className="price text-right">Collected tax</th>
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
                            <td >{tax.tax_name} </td>
                            <td >{tax.tax_rate} </td>
                            <td>
                            <Statistic
                                precision={2}
                                className="truncate_amount text-right"
                                value={tax.bill_tax_amount || 0}
                                valueStyle={{ fontSize: "14px" }}
                                prefix={transactions?.organization?.base_currency?.symbol}
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
                value={transactions.expected_tax_to_pay || 0}
                className="text-right"
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                value={transactions.paid_tax || 0}
                className="text-right"
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

export default TaxSummaryDetailsSupplierTable;
