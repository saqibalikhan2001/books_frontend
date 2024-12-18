import { Fragment } from "react";
import { Statistic } from "antd";

const SalesPersonTable = ({ transactions = [] }: any) => {
  return (
    <>
      <div className="table-wrapper">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              <th className="item-name w-20">Name</th>
              <th className="count text-right">Invoice count</th>
              <th className="sale text-right">Invoice Sales</th>
              <th className="sale text-right">Invoice sales with tax</th>
              <th className="count text-right">CN count</th>
              <th className="sale text-right">CN sales</th>
              <th className="sale text-right">CN sales with tax</th>
              <th className="sale text-right">Total sales</th>
              <th className="sale text-right">Total sales with tax</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.data?.map((salesbysalescustomer, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{salesbysalescustomer?.sales_person_name}</td>
                  <td className="text-right">{salesbysalescustomer?.countTotal}</td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                      value={(
                        salesbysalescustomer?.sales_with_tax - salesbysalescustomer?.tax_amount
                      ).toFixed(2)}
                    />
                  </td>
                  <td className="text-right">
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={salesbysalescustomer?.sales_with_tax || 0}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      className="no-space"
                      value={salesbysalescustomer?.CreditTotal}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={salesbysalescustomer?.issuedCredits}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={salesbysalescustomer?.issuedCredits}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                      // value={(salesbysalescustomer?.sales_with_tax - salesbysalescustomer?.tax_amount) - (transactions?.issuedCredits) || 0}
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                      value={
                        transactions?.total_invoiced_amount - transactions?.total_issued_credits
                      }
                    />
                  </td>
                  <td>
                    <Statistic
                      precision={2}
                      className="no-space"
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      value={
                        salesbysalescustomer?.sales_with_tax - salesbysalescustomer?.issuedCredits
                      }
                    />
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={1}>Total</td>
              {/* INCOICE COUNT */}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  className="no-space"
                  value={transactions?.final_count_total}
                  valueStyle={{ fontSize: "14px", fontWeight: "500" }}
                />
              </td>
              {/* INOICE SALES */}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  value={transactions?.total_invoiced_amount - transactions?.total_tax_amount}
                />
              </td>
              {/*Invoice sales with tax	  */}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.total_invoiced_amount}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              {/* CN count	 */}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  className="no-space"
                  value={transactions?.final_credit_total}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                />
              </td>
              {/*  CN sales	*/}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.total_issued_credits}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              {/*  CN sales with tax	*/}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  value={transactions?.total_issued_credits}
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                />
              </td>
              {/* Total sales	 */}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  value={transactions?.total_invoiced_amount - transactions?.total_issued_credits}
                />
              </td>
              {/*  Total sales with tax*/}
              <td className="text-right" style={{ borderTop: "2px solid #ccc" }}>
                <Statistic
                  precision={2}
                  className="no-space"
                  valueStyle={{
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  prefix={transactions?.organization?.base_currency?.symbol}
                  value={transactions?.total_invoiced_amount - transactions?.total_issued_credits}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SalesPersonTable;
