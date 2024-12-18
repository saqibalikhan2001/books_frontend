//@ts-nocheck
import { Fragment } from "react";
import { Statistic } from "antd";

const genaricStyle = {
  display: "flex",
  flexDirection: "column",
};

const TaxSummaryDetailsReportTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="product-name w-20">Product name</th>
              <th className="record-count">Sku</th>
              <th className="tax-name">Tax name</th>
              <th className="count">Current rate</th>
              <th className="price text-right">Expected tax to collect</th>
              <th className="price text-right">Collected tax</th>
              <th className="price text-right">Expected tax to pay</th>
              <th className="price text-right">Paid tax</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.data?.map((taxReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{taxReport.name}</td>
                  <td>{taxReport.sku}</td>
                  <td>
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return <div style={genaricStyle}>{tax.tax_name ?? "-"}</div>;
                        })
                      : "-"}
                  </td>
                  <td>
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return <div style={genaricStyle}>{tax.tax_rate ?? "-"}</div>;
                        })
                      : "-"}
                  </td>
                  <td className="truncate_amount text-right">
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return (
                            <div style={genaricStyle}>
                              {tax?.invoice_tax_amount !== null
                                ? `${
                                    transactions?.organization?.base_currency?.symbol
                                  }${tax?.invoice_tax_amount?.toFixed(2)}` ?? "-"
                                : `${transactions?.organization?.base_currency?.symbol}0.00`}
                            </div>
                          );
                        })
                      : "-"}
                  </td>
                  <td className="truncate_amount text-right">
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return (
                            <div style={genaricStyle}>
                              {tax?.invoice_paid_tax !== null
                                ? `${
                                    transactions?.organization?.base_currency?.symbol
                                  }${tax?.invoice_paid_tax?.toFixed(2)}` ?? "-"
                                : `${transactions?.organization?.base_currency?.symbol}0.00`}
                            </div>
                          );
                        })
                      : "-"}
                  </td>
                  <td className="truncate_amount text-right">
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return (
                            <div style={genaricStyle}>
                              {tax?.bill_tax_amount !== null
                                ? `${
                                    transactions?.organization?.base_currency?.symbol
                                  }${tax?.bill_tax_amount?.toFixed(2)}` ?? "-"
                                : `${transactions?.organization?.base_currency?.symbol}0.00`}
                            </div>
                          );
                        })
                      : "-"}
                  </td>
                  <td className="truncate_amount text-right">
                    {taxReport?.taxes?.length > 0
                      ? taxReport?.taxes?.map((tax) => {
                          return (
                            <div style={genaricStyle}>
                              {tax?.bill_paid_tax !== null
                                ? `${
                                    transactions?.organization?.base_currency?.symbol
                                  }${tax?.bill_paid_tax?.toFixed(2)}` ?? "-"
                                : `${transactions?.organization?.base_currency?.symbol}0.00`}
                            </div>
                          );
                        })
                      : "-"}
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={4} className="text-right">
                Total
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount text-right"
                  value={transactions?.expected_tax_to_collect}
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount text-right"
                  value={transactions?.collected_tax}
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount text-right"
                  value={transactions?.expected_tax_to_pay}
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount text-right"
                  value={transactions?.paid_tax}
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

export default TaxSummaryDetailsReportTable;
