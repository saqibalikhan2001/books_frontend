import { Fragment, useState } from "react";
import { Statistic } from "antd";
import { BalanceModal } from "./Modal";
const CustomerBalancetable = ({ transactions = [], pagination }: any) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    date: pagination,
    type: "all",
    contactId: null,
  });
  const handleOpen = (type, Id) => {
    !open && setData({ ...data, type: type, contactId: Id });
    setOpen(!open);
  };
  return (
    <>
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division customer-balance-table">
        <thead>
          <tr>
            <th className="customer-name">Customer Name</th>
            <th className="cus-price text-right">Receivable </th>
            <th className="cus-price text-right">Unused Credits</th>
            <th className="cus-price text-right">Credit Note Balance</th>
            <th className="cus-price text-right">Advance Payment</th>
            <th className="cus-price text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.data?.map((customerbalance, index) => (
            <Fragment key={index}>
              <tr>
                <td>{customerbalance?.display_name}</td>
                <td onClick={() => handleOpen("invoice", customerbalance?.id)}>
                  <Statistic
                    precision={2}
                    className="no-space truncate_amount text-right"
                    value={customerbalance?.receivables}
                    valueStyle={{
                      fontSize: "14px",
                      justifyContent:'flex-end'
                    }}
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>
                <td>
                  <Statistic
                    precision={2}
                    className="no-space truncate_amount text-right"
                    value={customerbalance?.unused_balance || 0}
                    valueStyle={{ fontSize: "14px", justifyContent:'flex-end'}}
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>
                <td onClick={() => handleOpen("credit_notes", customerbalance?.id)}>
                  <Statistic
                    precision={2} 
                    className="no-space truncate_amount text-right"
                    value={customerbalance?.credit_note_balance || 0}
                    valueStyle={{
                      fontSize: "14px",
                      justifyContent:'flex-end'
                    }}
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>

                <td onClick={() => handleOpen("payments", customerbalance?.id)}>
                  <Statistic
                    precision={2}
                    className="no-space truncate_amount text-right"
                    value={customerbalance?.advance_payment_balance || 0}
                    valueStyle={{
                      fontSize: "14px",
                      justifyContent:'flex-end'
                    }}
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>

                <td onClick={() => handleOpen("all", customerbalance?.id)}>
                  <Statistic
                    precision={2}
                    className="no-space truncate_amount text-right"
                    value={customerbalance?.total_balance || 0}
                    valueStyle={{
                      fontSize: "14px",
                      justifyContent:'flex-end'
                    }}
                    prefix={transactions?.organization?.base_currency?.symbol}
                  />
                </td>
              </tr>
            </Fragment>
          ))}
          <tr>
            <td colSpan={2} className="text-right">
              Total
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="no-space truncate_amount"
                value={transactions?.final_unused_amount}
                valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent:'flex-end' }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="no-space truncate_amount"
                value={transactions?.final_credit_note}
                valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent:'flex-end' }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>

            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="no-space truncate_amount"
                value={transactions?.final_advance_payment}
                valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent:'flex-end' }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>

            <td style={{ borderTop: "2px solid #ccc" }}>
              <Statistic
                precision={2}
                className="no-space truncate_amount"
                value={transactions?.final_total}
                valueStyle={{ fontSize: "14px", fontWeight: "500", justifyContent:'flex-end' }}
                prefix={transactions?.organization?.base_currency?.symbol}
              />
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      <BalanceModal open={open} handleOpen={handleOpen} data={data} />
    </>
  );
};

export default CustomerBalancetable;
