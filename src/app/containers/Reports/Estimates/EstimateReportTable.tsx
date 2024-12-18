import { Fragment } from "react";
import { Statistic } from "antd";
import { getOrganizationDate } from "utils";
import { useStore } from "app/Hooks";

const EstimateReportTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="est-date">Estimate Date</th>
              <th className="exp-date">Expiry Date</th>
              <th className="document-no">Estimate No.</th>
              <th className="item-name">Customer Name</th>
              <th className="status-badge">Status</th>
              <th className="price text-right">Estimate Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((estimatereport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>
                    {estimatereport?.estimate_date
                      ? getOrganizationDate(estimatereport?.estimate_date, org_date_format)
                      : ""}
                  </td>
                  <td>
                    {estimatereport?.expiry_date
                      ? getOrganizationDate(estimatereport?.expiry_date, org_date_format)
                      : ""}
                  </td>
                  <td>{estimatereport?.estimate_no}</td>
                  <td>{estimatereport?.customer_name}</td>
                  <td>
                    <div className="action-preference w-100">
                      <div className={`generic-badge ${estimatereport?.status}`}>
                        {estimatereport?.status}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      value={estimatereport?.estimate_amount || 0}
                      className="no-space text-right truncate_amount"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
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
                  className="no-space truncate_amount"
                  value={transactions?.total_estimate_amount}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent: "flex-end" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EstimateReportTable;
