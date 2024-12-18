import { Fragment } from "react";
import { Statistic, Typography } from "antd";

const LedgerReportsTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl __general--Ledger">
          <thead>
            <tr>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
              <th style={{ width: 260 }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((ledgerReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>
                    <Typography>{ledgerReport.title}</Typography>
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={ledgerReport.debit || 0}
                      prefix={ledgerReport?.currency_symbol}
                      valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={ledgerReport.credit || 0}
                      prefix={ledgerReport?.currency_symbol}
                      valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      prefix={ledgerReport?.currency_symbol}
                      value={ledgerReport.total_balance || 0}
                      valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LedgerReportsTable;
