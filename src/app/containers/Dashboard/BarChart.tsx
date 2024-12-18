//@ts-nocheck
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Form } from "antd";
import { endpoints } from "static";
import { capitalize, getFullDate } from "utils";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";
import { StatsHeader } from "./dashboardStats/StatsHeader";

export function setDashboardAmount(amount) {
  return parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : amount;
}
const formatNumber = (number) =>
  new Intl.NumberFormat("en", {
    style: "decimal",
    maximumFractionDigits: 6,
  }).format(number);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <div className="intro">{label}</div>
        <div className="label">{`${capitalize(
          payload[0]?.name
        )}${"\u00A0"}${"\u00A0"}${"\u00A0"}${"\u00A0"}${"\u00A0"}${"\u00A0"}${"\u00A0"} : ${
          payload[0]?.payload.unit
        }${formatNumber(payload[0].value)}`}</div>
        <div className="label">{`${capitalize(payload[1]?.name)} : ${
          payload[1]?.payload.unit
        }${formatNumber(payload[1]?.value)}`}</div>
      </div>
    );
  }

  return null;
};
export const BarChartX = ({ preferences }: { preferences: any }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({ chartData: {} });

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useLayoutEffect(() => {
    preferences?.sales_vs_purchase &&
      form.setFieldValue("date_range", preferences?.sales_vs_purchase);
  }, [form, preferences?.sales_vs_purchase]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `${endpoints.SALES_PURCHASE}/${`${date}?starting_date=${getFullDate(
        custom_ranges[0]
      )} 00:00:00&ending_date=${getFullDate(custom_ranges[1])} 23:59:59`}`;
    } else if (date && date !== "custom") url = `${endpoints.SALES_PURCHASE}/${date}`;
    if (url) {
      callAxios({ url }).then((res) => {
        if (res) {
          setData({ chartData: prepareChartData(res.chart_details, res.currency) });
          setLoading(false);
        }
      });
    }
  }, [date, custom_ranges]);
  function prepareChartData(chartDetails, currency) {
    let resultData: any = [];

    Object.keys(chartDetails).forEach((val, i) => {
      resultData.push({});
      resultData[i]["name"] = val;
    });

    resultData.forEach((val, i) => {
      resultData[i].sales = chartDetails[val.name].invoices;
      resultData[i].purchase = chartDetails[val.name].bills;
    });

    resultData.forEach(function (res) {
      res.unit = currency;
    });

    return resultData;
  }
  const yaxisNumber = (label) => {
    if (label >= 1000) {
      return `${label / 1000}k`;
    } else {
      return `${label}`;
    }
  };
  return (
    <>
      <Card className="card-layout h-318">
        <StatsHeader tittle="Sales vs Purchase" form={form} remove_custom remove_total />
        {loading ? (
          <Spinner directionSize={"31.5vh"} />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={data?.chartData}
              style={{ backgroundColor: "#fff", paddingTop: 20 }}
              margin={{
                top: 5,
                bottom: 5,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(label) => yaxisNumber(label)} />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="sales" fill="#eea447" barSize={554} />
              <Bar dataKey="purchase" fill="#82ca9d" barSize={550} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </>
  );
};
