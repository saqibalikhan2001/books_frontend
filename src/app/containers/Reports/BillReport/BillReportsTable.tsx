import { Fragment } from "react";
import { Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const BillReportsTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="date">Bill date</th>
              <th className="date">Due date</th>
              <th className="document-no">Bill no</th>
              <th className="customer-name">Supplier Name</th>
              <th className="status-badge">Status</th>
              <th className="price text-right">Due Balance</th>
              <th className="price text-right">Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((billReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{getOrganizationDate(billReport.bill_date, org_date_format)}</td>
                  <td>{getOrganizationDate(billReport.due_date, org_date_format)}</td>
                  <td>{billReport.bill_no}</td>
                  <td>{billReport.display_name}</td>
                  <td>
                    <div className="action-preference w-100">
                      <div
                        className={`generic-badge ${
                          billReport?.status && billReport?.status === "partially paid"
                            ? "partially-paid"
                            : billReport?.status
                        }`}
                      >
                        {billReport?.status === "partially paid" ? "PRTL Paid" : billReport?.status}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      valueStyle={{ fontSize: "14px" }}
                      value={billReport.balance_due || 0}
                      prefix={billReport?.currency_symbol}
                      className="no-space  truncate_amount text-right"
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      value={billReport.total || 0}
                      valueStyle={{ fontSize: "14px" }}
                      prefix={billReport?.currency_symbol}
                      className="no-space  truncate_amount text-right"
                    />
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
                  value={transactions?.total_balance_due}
                  className="no-space  truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  value={transactions?.total_billed_amount}
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

export default BillReportsTable;
