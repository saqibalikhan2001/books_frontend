import React from "react";
import { Statistic, Tag, Typography } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

const LedgerTable = ({ transactions = [] }: any) => {
  const { org_date_format } = useStore();

  return (
    <>
      <div className="table-wrapper ledger_item_table">
        <table className="journal-tbl">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>Account</th>
              <th>Transaction</th>
              <th>Transaction no</th>
              <th></th>
              {/* empty th is required by script(split) */}
              <th style={{ width: 260 }}>Date</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Running balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.ledger?.map((ledger, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={ledger.transactions.length + 1}>
                    <Typography>{ledger.title}</Typography>
                  </td>
                </tr>
                {ledger.transactions.map((_transaction, transactionIndex) => (
                  <React.Fragment key={`${index}-${transactionIndex}`}>
                    <tr>
                      <td>{_transaction.transaction}</td>
                      <td>{_transaction.transaction_no}</td>
                      <td></td>
                      <td>{getOrganizationDate(_transaction.date, org_date_format)}</td>
                      <td className="text-right ledger-values-alignment debit_col">
                        <Statistic
                          precision={2}
                          className="no-space"
                          valueStyle={{ fontSize: "14px", display: "flex" }}
                          value={_transaction?.debit === null ? " " : _transaction?.debit}
                          prefix={
                            _transaction?.debit === null ? " " : transactions?.currency_symbol
                          }
                        />
                      </td>
                      <td className="text-right ledger-values-alignment">
                        <Statistic
                          precision={2}
                          className="no-space"
                          valueStyle={{ fontSize: "14px", display: "flex" }}
                          value={_transaction?.credit === null ? " " : _transaction?.credit}
                          prefix={
                            _transaction?.credit === null ? " " : transactions?.currency_symbol
                          }
                        />
                      </td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {transactionIndex > 0 &&
                          transactionIndex <= ledger.transactions.length - 2 && (
                            <Tag
                              className={
                                _transaction.balance_type === "debit"
                                  ? "generic-badge debit_badge"
                                  : _transaction.balance_type === "credit"
                                  ? "generic-badge credit_badge"
                                  : "generic-badge nill"
                              }
                            >
                              {_transaction.balance_type === "debit"
                                ? "Debit balance"
                                : _transaction.balance_type === "credit"
                                ? "Credit balance"
                                : "Nil balance"}
                            </Tag>
                          )}
                        <Statistic
                          precision={2}
                          className="no-space"
                          valueStyle={{ fontSize: "14px", display: "flex" }}
                          value={_transaction?.balance === null ? " " : _transaction?.balance}
                          prefix={
                            _transaction?.balance === null ? " " : transactions?.currency_symbol
                          }
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr  style={{ borderTop: "2px solid lightgray" }}>
                  <td colSpan={5} style={{fontWeight: 600}} className="text-right">
                    TOTAL
                  </td>
                  <td
                    className="text-right ledger-values-alignment debit_col"
                    style={{ borderBottom: "2px solid #ccc" }}
                  >
                    <Statistic
                      precision={2}
                      className="no-space"
                      valueStyle={{ fontSize: "14px", fontWeight: 500, display: "flex" }}
                      value={ledger.debit}
                      prefix={transactions?.currency_symbol}
                    />
                  </td>
                  <td
                    className="text-right ledger-values-alignment"
                    style={{ borderBottom: "2px solid #ccc"}}
                  >
                    <Statistic
                      precision={2}
                      className="no-space"
                      valueStyle={{ fontSize: "14px", fontWeight: 500, display: "flex", maxWidth:"202px"  }}
                      value={ledger.credit}
                      prefix={transactions?.currency_symbol}
                    />
                  </td>
                  <td></td>
                </tr>
                <tr className="space-row" style={{height: "20px"}}>
                   <td colSpan={8}></td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LedgerTable;
