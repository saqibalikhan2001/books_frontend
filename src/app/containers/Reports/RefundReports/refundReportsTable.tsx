import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const RefundReportTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="date">Date</th>
              <th className="document-no">Transaction No.</th>
              <th className="customer-name">Customer Name</th>
              <th className="method">Payment Method</th>
              <th className="refs">Reference</th>
              <th className="price text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((refundReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{getOrganizationDate(refundReport.date, org_date_format)}</td>
                  <td>{refundReport.transaction_no}</td>
                  <td>{refundReport.display_name}</td>
                  <td>{refundReport.payment_type}</td>
                  <td>{refundReport.reference}</td>
                  <td>
                    {refundReport?.amount && (
                      <Statistic
                        precision={2}
                        value={refundReport?.amount || 0}
                        valueStyle={{ fontSize: "14px" }}
                        className="no-space  truncate_amount text-right"
                        prefix={transactions?.organization?.base_currency?.symbol}
                      />
                    )}
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={5} className="text-right">
                Total
              </td>

              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.total_paid_amount}
                  className="no-space  truncate_amount text-right"
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

export default RefundReportTable;
