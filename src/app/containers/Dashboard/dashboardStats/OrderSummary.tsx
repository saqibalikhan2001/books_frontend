//@ts-nocheck
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Form } from "antd";
import { useAxios } from "app/Hooks";
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { StatsHeader } from "./StatsHeader";
import { Icons, Spinner } from "app/shared";
import { getFullDate, getStringValueFromSS, setKeyInSS } from "utils";

const { TbFileInvoice } = Icons;

export const OrderSummary = ({ preferences }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [chart_data, setChart_Data] = useState<any>();

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `/dashboard/estimate_summary/${`${date}?starting_date=${getFullDate(
        custom_ranges[0]
      )} 00:00:00&ending_date=${getFullDate(custom_ranges[1])} 23:59:59`}`;
    } else if (date && date !== "custom") url = `/dashboard/estimate_summary/${date}`;
    if (url) {
      callAxios({ url }).then((res) => {
        setData(res);
        setChart_Data(prepareChartData(res.currency, res.chart_data));
        setLoading(false);
      });
    }
  }, [date, custom_ranges]);

  useLayoutEffect(() => {
    preferences?.sales_order_summary &&
      form.setFieldValue("date_range", preferences?.sales_order_summary);
  }, [form, preferences?.sales_order_summary]);

  const setDashboardAmount = (amount) => {
    return parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : amount;
  };

  const prepareChartData = (currency, chartData: any = {}) => {
    let resultData: any = [];
    Object.keys(chartData.estimate).forEach((val, i) => {
      resultData.push({});
      resultData[i]["name"] = val;
    });

    Object.values(chartData.estimate).forEach((val, i) => {
      resultData[i]["Estimate"] = val;
    });
    Object.values(chartData.credit_notes).forEach((val, i) => {
      resultData[i]["Credit"] = val;
    });

    resultData.forEach(function (res) {
      res.unit = currency;
    });

    return resultData;
  };

  const yaxisNumber = (label) => {
    if (label >= 1000) {
      return `${label / 1000}k`;
    } else {
      return `${label}`;
    }
  };

  return (
    <>
      <Card className="card-layout est-summary-graph h-318">
        <StatsHeader tittle="Estimates Summary" form={form} />
        <div className="card-row">
          {loading ? (
            <div style={{ margin: "auto" }}>
              <Spinner directionSize={"260px"} />
            </div>
          ) : (
            <>
              <div className="card-chart-view">
                <ResponsiveContainer width="100%" height="100%" style={{ backgroundColor: "#fff" }}>
                  <LineChart
                    width={500}
                    height={300}
                    data={chart_data}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(label) => yaxisNumber(label)} />
                    <Tooltip
                      formatter={(value, name, props) => [`${data?.currency} ${value}`, name]}
                    />
                    <Line
                      type="monotone"
                      dataKey="Estimate"
                      stroke="#33A348"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="Credit" stroke="red" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card-total-status">
                <div
                  // style={{ float: 'left' }}
                  className="sales-summary-right"
                >
                  <div className="left_section">
                    <div className="gray_background so_sum_data">
                      <Typography.Title level={4}>
                        Estimate <span>(Total)</span>
                      </Typography.Title>
                      <Typography.Title level={3} className=" no_margin fs_20">
                        {data?.currency}
                        {`${setDashboardAmount(data?.total_estimates?.toFixed(2))}`}
                      </Typography.Title>
                    </div>
                    <div className="so_sum_data" style={{ marginBottom: 30 }}>
                      <h4 className="mt_0  fs_20">
                        Credits <span className=" fs_14">(Issued)</span>
                      </h4>
                      <Typography.Title level={3} className="no_margin fs_20">
                        {data?.currency}
                        {`${setDashboardAmount(data?.credit_notes?.total_amount?.toFixed(2))}`}
                      </Typography.Title>
                    </div>
                    {/* <div className="gray_background so_sum_data">
                          <h4 className="mt_0 mb__10 fs_20">
                            Sale <span className=" fs_14">(Net)</span>
                          </h4>
                          <Typography.Title level={3} className="bold__ no_margin fs_20">
                            {data?.currency}
                            {`${setDashboardAmount(data?.total_estimates)}`}
                          </Typography.Title>
                        </div> */}
                  </div>

                  <div className="right_section">
                    {/* <Link
                          // className="so_summ_sr_cn float-left w-100"
                          to={`creditnotes?filter=all&sort=created_at&page=1&orderBy=desc&view=20&start=${data?.start_date}&end=${data?.end_date}`}
                        > */}
                    <div
                      className="cursor"
                      onClick={async () => {
                        const dataFromLS: any = getStringValueFromSS("params");
                        const params = {
                          ...dataFromLS,
                          sort: "desc",
                          status: "",
                          start_range: data?.start_date,
                          end_range: data?.end_date,
                          date_range: "custom",
                          is_applied: true,
                          dashboard: true,
                        };
                        await setKeyInSS("params", params);
                        navigate("/creditnotes");
                      }}
                    >
                      <div>
                        <h3 className="dashboard-heading-sm mb-10">Credit Notes</h3>
                      </div>
                      <div className="d-flex align-center justify_between mb-10">
                        <span className="mini-heading">Number of Credit Notes:</span>
                        <span className="number-value">
                          {data?.credit_notes?.credit_notes_issued}
                        </span>
                      </div>
                      <div className="d-flex align-center justify_between">
                        <span className="mini-heading">Total Amount:</span>
                        <span className="number-value">
                          {data?.currency}
                          {`${setDashboardAmount(
                            data?.credit_notes?.total_amount?.toFixed(2)
                          )}`}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </>
  );
};
