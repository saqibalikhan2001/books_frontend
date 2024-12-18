import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const PaymentMadeTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="date">Date</th>
              <th className="document-no">Bill No.</th>
              <th className="document-no">Reference No.</th>
              <th className="customer-name w-20">Supplier Name</th>
              <th className="method">Payment Method</th>
              <th className="note">Notes</th>
              <th className="price text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((paymentreport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>
                    {paymentreport?.payment_date
                      ? getOrganizationDate(paymentreport?.payment_date, org_date_format)
                      : ""}
                  </td>
                  <td>{paymentreport?.bill_no}</td>
                  <td>{paymentreport?.reference}</td>
                  <td>{paymentreport?.display_name}</td>
                  <td>{paymentreport?.payment_mode}</td>
                  <td>{paymentreport?.note}</td>

                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={paymentreport?.payment_made || 0}
                      className="no-space  truncate_amount text-right"
                      prefix={transactions?.organization?.base_currency?.symbol}
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
                  value={transactions?.total_payment_made}
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

export default PaymentMadeTable;
