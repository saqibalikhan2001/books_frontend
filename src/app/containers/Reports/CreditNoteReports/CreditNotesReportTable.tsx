import { Fragment } from "react";
import { Statistic } from "antd";
import { getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";

const CreditNotesReportTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="date">Credit Date</th>
              <th className="document-no">Credit Note No.</th>
              <th className="document-no">Status</th>
              <th className="customer-name">Customer Name</th>
              <th className="price text-right">Balance</th>
              <th className="price text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((report, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{report?.date ? getOrganizationDate(report?.date, org_date_format) : ""}</td>
                  <td>{report?.credit_note_no}</td>
                  <td>
                    <div className="action-preference w-100">
                      <div
                        className={`generic-badge ${
                          report?.status === "partially applied"
                            ? "partially-applied"
                            : report?.status
                        }`}
                      >
                        {report?.status}
                      </div>
                    </div>
                  </td>
                  <td>{report?.customer_name}</td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={report?.balance || 0}
                      valueStyle={{ fontSize: "14px" }}
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space truncate_amount text-right"
                      value={report?.amount || 0}
                      valueStyle={{ fontSize: "14px" }}
                      prefix={transactions?.organization?.base_currency?.symbol}
                    />
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
                  className="no-space truncate_amount text-right"
                  value={transactions?.balance}
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space truncate_amount text-right"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  value={transactions?.total}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CreditNotesReportTable;
