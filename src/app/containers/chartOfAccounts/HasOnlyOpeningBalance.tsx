import React, { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Statistic, Typography } from "antd";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";

export default function HasOnlyOpeningBalance({ data }) {
  const { callAxios } = useAxios();
  const [loading, setloading] = useState(false);
  const [openingBalanceData, setOpeningBalanceData] = useState<any>([]);

  useEffect(() => {
    if (data?.id) {
      setloading(true);
      callAxios({ url: `/accounts/opening_transactions/${data?.id}` }).then((res) => {
        setOpeningBalanceData(res);
        setloading(false);
      });
    }
  }, [data?.id]);

  return (
    <div style={{ minWidth: "100%" }}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div
            style={{ color: "orange", fontSize: "20px", width: "80px" }}
            className="d-flex justify_between align-center"
          >
            <FiAlertTriangle />
            <Typography style={{ color: "orange", fontSize: "20px" }}>Alert</Typography>
          </div>
          <Typography className="mt-20 d-flex">
            Account balance: &nbsp;
            <Statistic
              precision={2}
              className="no-space"
              valueStyle={{ fontSize: "14px" }}
              prefix={openingBalanceData?.symbol}
              value={data?.account_current_balance}
            />
          </Typography>
          <Typography className="mt-20">
            This account has the following transactions in journal.
          </Typography>
          <div className="mt-20">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th style={{ flex: 1 }}>Transaction Type</th>
                  <th style={{ flex: 1 }}>Account</th>
                  <th style={{ flex: 1 }}>Debit</th>
                  <th style={{ flex: 1 }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                <React.Fragment>
                  <tr>
                    <td rowSpan={2}>{openingBalanceData?.transaction_type}</td>
                  </tr>
                  {openingBalanceData?.journal_entries?.map((account, index) => (
                    <tr key={index}>
                      <td style={{ flex: 1 }}></td>
                      <td style={{ flex: 1 }}>{account?.account_title}</td>
                      <td style={{ flex: 1 }}>
                        <Statistic
                          precision={2}
                          className="no-space"
                          value={account?.amount}
                          valueStyle={{ fontSize: "14px" }}
                          prefix={openingBalanceData?.symbol}
                        />
                      </td>
                      <td style={{ flex: 1 }}>
                        <Statistic
                          precision={2}
                          value={account?.amount}
                          className="no-space text-right"
                          valueStyle={{ fontSize: "14px" }}
                          prefix={openingBalanceData?.symbol}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "transparent" }}>
                    <td style={{ flex: 1 }}></td>
                    <td style={{ flex: 1 }}></td>
                    <td
                      style={{
                        flex: 1,
                        borderTop: "1px solid gray",
                        borderBottom: "1px solid gray",
                      }}
                    >
                      <Statistic
                        precision={2}
                        className="no-space"
                        valueStyle={{ fontSize: "14px" }}
                        prefix={openingBalanceData?.symbol}
                        value={openingBalanceData?.total_debit}
                      />
                    </td>
                    <td
                      style={{
                        flex: 1,
                        borderTop: "1px solid gray",
                        borderBottom: "1px solid gray",
                      }}
                    >
                      <Statistic
                        precision={2}
                        className="no-space"
                        valueStyle={{ fontSize: "14px" }}
                        prefix={openingBalanceData?.symbol}
                        value={openingBalanceData?.total_credit}
                      />
                    </td>
                  </tr>
                </React.Fragment>
              </tbody>
            </table>
          </div>
          <Typography className="mt-20">
            These journal entries will also be deleted if you delete this account. Continue?
          </Typography>
        </>
      )}
    </div>
  );
}
