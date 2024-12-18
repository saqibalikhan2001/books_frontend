import { Statistic } from "antd";
import { Fragment } from "react";

const aggingReportsTable = ({ transactions = [] }: any) => {
  const calculateTotal = (intervals) => {
    return intervals.reduce((acc, interval) => {
      const value = interval.count !== undefined ? interval.count : interval.amount;
      return acc + (value !== undefined ? value : 0);
    }, 0);
  };

  // const findCount = (intervals) => {
  //   return intervals.filter((interval) => interval.count); // Add your condition to filter
  // };

  return (
    <>
      <div className="table-wrapper aging-sumary_report--fixer">
        <table className="journal-tbl generic-column-division">
          <thead>
            <tr>
              {transactions?.headers?.map((column: any) => {
                return (
                  <th
                    className={`${
                      column.header == "Customer Name" ? "customer-name" : "interval text-right"
                    }`}
                  >
                    {column?.header}
                  </th>
                );
              })}
              <th className="total-price text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.aging_summary_data?.data?.map((aggingReport, index) => (
              <Fragment key={index}>
                <tr>
                  <td>{aggingReport.customer_name}</td>
                  {aggingReport.intervals.map((interval: any) => {
                    return (
                      <td>
                        <Statistic
                          precision={interval.count >= 0 ? 0 : 2}
                          valueStyle={{
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          value={interval.count ? interval.count || 0 : interval.amount || 0}
                          className="text-right"
                          prefix={interval.count >= 0 ? "" : transactions?.currency?.symbol}
                        />
                      </td>
                    );
                  })}
                  <td className="text-right">
                    {
                      <Statistic
                        precision={
                          aggingReport.intervals.some((interval) => interval.count !== undefined)
                            ? 0
                            : 2
                        }
                        valueStyle={{ fontSize: "14px" }}
                        value={calculateTotal(aggingReport.intervals)}
                        className="text-right"
                        prefix={
                          aggingReport.intervals.some((interval) => interval.count !== undefined)
                            ? ""
                            : transactions?.currency?.symbol
                        }
                      />
                    }
                  </td>
                </tr>
              </Fragment>
            ))}
            <tr>
              <td colSpan={0} className="text-left">
                Total
              </td>
              {transactions?.sum_columns?.map((total) => {
                if (total.interval !== "") {
                  return (
                    <td className={total.interval == "total" ? "text-right" : ""}>
                      <Statistic
                        precision={total.count >= 0 ? 0 : 2}
                        valueStyle={{
                          fontSize: "14px",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                        value={total.count ? total.count || 0 : total.amount || 0}
                        className="text-right"
                        prefix={total.count >= 0 ? "" : transactions?.currency?.symbol}
                      />
                    </td>
                  );
                } else {
                  return null;
                }
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default aggingReportsTable;
