import { Fragment } from "react";
import { Statistic } from "antd";

export const SalesTable = ({ transactions = [] }: any) => {
  return (
    <div className="table-wrapper">
      <table className="journal-tbl generic-column-division">
        <thead>
          <tr>
            <th className="item-name">Product name</th>
            <th className="sku ">SKU</th>
            <th className="average-price text-right">Average price</th>
            <th className="qty-sold text-right">Quantity sold</th>
            <th className="sale-amount text-right">Sales amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.data?.map((sales, index) => (
            <Fragment key={index}>
              <tr>
                <td>{sales.item_name}</td>
                <td>{sales.item_sku}</td>
                <td className="text-right">
                  <Statistic
                    precision={2}
                    className="no-space"
                    value={sales.sales_with_tax / sales.sales_quantity || 0}
                    prefix={transactions?.organization?.base_currency?.symbol}
                    valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
                  />
                </td>

                <td className="text-right">{sales?.sales_quantity || 0}</td>
                <td className="text-right">
                  {sales?.sales_with_tax && (
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={sales?.sales_with_tax || 0}
                      prefix={transactions?.organization?.base_currency?.symbol}
                      valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
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
                //precision={2}
                className="no-space"
                value={transactions?.total_quantity}
                valueStyle={{ fontSize: "14px", fontWeight: "500" }}
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
  );
};
