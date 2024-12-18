import { Fragment } from "react";
import { Statistic } from "antd";
const SalesCustomersTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="item-name">Customer name</th>
              <th className="count text-right">Record count</th>
              <th className="tax text-right">Tax</th>
              <th className="sale text-right">Sales</th>
              <th className="tax text-right">Sales with tax</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((salesbyCustomer, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{salesbyCustomer.customer_name}</td>
                  <td className="text-right">{salesbyCustomer.countTotal}</td>
                  <td className="text-right">
                    {/* {salesbyCustomer && ( */}
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={salesbyCustomer?.tax_amount || 0}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                    {/* )} */}
                  </td>
                  <td className="text-right">
                    <Statistic
                      precision={2}
                      className="no-space"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      value={salesbyCustomer?.sales_with_tax - salesbyCustomer?.tax_amount || 0}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                  <td className="text-right">
                    {salesbyCustomer?.sales_with_tax && (
                      <Statistic
                        precision={2}
                        className="no-space"
                        value={salesbyCustomer?.sales_with_tax || 0}
                        valueStyle={{
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        prefix={transactions?.organization?.base_currency?.symbol}
                      />
                    )}
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={3} className="text-right">
                Total
              </td>
              <td style={{ borderTop: "2px solid #ccc" }} className="text-right">
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  value={transactions?.total_invoiced_amount - transactions?.total_tax_amount}
                />
              </td>
              <td style={{ borderTop: "2px solid #ccc" }} className="text-right">
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.total_invoiced_amount}
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
export default SalesCustomersTable;