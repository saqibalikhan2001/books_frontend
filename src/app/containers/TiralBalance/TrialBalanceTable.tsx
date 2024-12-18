import React, { useState } from "react";
import { Statistic, Typography } from "antd";

const TrialBalanceTable = ({ transactions = [] }: any) => {
  const maxLength = 150;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="table-wrapper journal_item_table">
        <table className="journal-tbl">
          <thead>
            <tr>
              <th style={{ width: "11%" }}>Account</th>
              <th style={{ width: "8%" }}>Account No.</th>
              <th style={{ width: "14%" }}>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Sub-type</th>
              <th className="text-right">Debit Balance</th>
              <th className="text-right">Credit Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.trial_balance?.map((TrialBalance, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    <Typography>{TrialBalance?.title}</Typography>
                  </td>
                  <td>{TrialBalance?.account_no}</td>
                  {/* <td>{TrialBalance?.description}</td> */}
                  <td>
                    {TrialBalance?.description && isExpanded
                      ? TrialBalance?.description
                      : TrialBalance?.description?.length > maxLength
                      ? `${TrialBalance.description.slice(0, maxLength)}...`
                      : !TrialBalance?.description?.length
                      ? ""
                      : TrialBalance?.description}
                    {TrialBalance?.description?.length > maxLength && (
                      <span
                        className="read_more"
                        onClick={toggleReadMore}
                       
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </span>
                    )}
                  </td>
                  <td>{TrialBalance?.category}</td>
                  <td>{TrialBalance?.type}</td>
                  <td>{TrialBalance?.sub_type}</td>
                  <td className="text-right ">
                    {TrialBalance?.debit && (
                      <Statistic
                        precision={2}
                        className="no-space"
                        value={TrialBalance?.debit}
                        prefix={transactions?.currency_symbol}
                        valueStyle={{
                          fontSize: "14px",
                          fontWeight: "500",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      />
                    )}
                  </td>
                  <td className="text-right">
                    {TrialBalance?.credit && (
                      <Statistic
                        precision={2}
                        className="no-space"
                        value={TrialBalance?.credit}
                        prefix={transactions?.currency_symbol}
                        valueStyle={{
                          fontSize: "14px",
                          fontWeight: "500",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      />
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
            <tr>
              <td className="text-right" colSpan={6}></td>
              <td
                className="text-right ledger-values-alignment"
                style={{ borderTop: "2px solid #ccc" }}
              >
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px", fontWeight: "500", display: "flex" }}
                  value={transactions?.debit}
                  prefix={transactions?.currency_symbol}
                />
              </td>
              <td
                className="text-right ledger-values-alignment"
                style={{ borderTop: "2px solid #ccc" }}
              >
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.credit}
                  prefix={transactions?.currency_symbol}
                  valueStyle={{ fontSize: "14px", fontWeight: "500", display: "flex" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TrialBalanceTable;
