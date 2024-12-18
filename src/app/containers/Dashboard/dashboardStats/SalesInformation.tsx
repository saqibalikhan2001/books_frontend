/** @format */

import { useCallback, useEffect, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Divider, Form, Row } from "antd";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { useAxios } from "app/Hooks";
import { routeNames } from "static";
import { Spinner } from "app/shared";
import { StatsHeader } from "./StatsHeader";
import NoSaleOrderIcon from "./NoSaleOrderIcon";
import { getFullDate, getStringValueFromSS, setKeyInSS } from "utils";

const { ESTIMATES } = routeNames;

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    //percent,
    innerRadius,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  //@ts-ignore
  const textAnchor = cos <= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#00000"}>
        Estimates
      </text>
      <Sector
        cx={cx}
        cy={cy}
        fill={fill}
        endAngle={endAngle}
        startAngle={startAngle}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      />
      <Sector
        cx={cx}
        cy={cy}
        fill={fill}
        endAngle={endAngle}
        startAngle={startAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#000">
        {`${payload.name}`}
      </text>
    </g>
  );
};

// function capitalizeFirstWord(str) {
//   if (!str) return str; // Return if the string is empty or undefined

//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

export const SaleInformation = ({ preferences }: { preferences: any }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);
  useLayoutEffect(() => {
    preferences && form.setFieldValue("date_range", preferences);

    //eslint-disable-next-line
  }, [form, preferences]);
  useEffect(() => {
    setLoading(true);
    let url;
    if (date && date === "custom" && custom_ranges) {
      url = `/dashboard/estimates_information/${`${date}?starting_date=${getFullDate(
        custom_ranges[0]
      )} 00:00:00&ending_date=${getFullDate(custom_ranges[1])} 23:59:59`}`;
    } else if (date && date !== "custom") url = `/dashboard/estimates_information/${date}`;

    if (url) {
      callAxios({ url }).then((res) => {
        if (res) {
          setActiveIndex(res?.chart_data?.findIndex((obj) => obj.value !== 0));
          setData(res);
          setLoading(false);
        }
      });
    }
  }, [date, custom_ranges]);

  const capitalizedData = data?.chart_data?.map((item) => ({
    ...item, // Spread the other properties (e.g., value)
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1), // Capitalize first letter
  }));

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  return (
    <Card className="card-layout">
      <StatsHeader tittle={"Estimates Information"} form={form} />
      {loading ? (
        <Spinner directionSize={"258px"} />
      ) : (
        <Row className="estimateSec ">
          <Col span={12}>
            <Row>
              {data?.found_data ? (
                <ResponsiveContainer height={218}>
                  <PieChart width={254} height={134}>
                    <Pie
                      cx="50%"
                      cy="50%"
                      fill="#dfe1e5"
                      dataKey="value"
                      innerRadius={45}
                      outerRadius={60}
                      data={capitalizedData}
                      activeIndex={activeIndex}
                      onMouseEnter={onPieEnter}
                      activeShape={renderActiveShape}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="no_data_icon">
                  <NoSaleOrderIcon />
                </div>
              )}
              <Divider type="vertical" style={{ height: "100%" }} />
            </Row>
          </Col>

          <Col span={12} className="dashboard-invoice-sec d-flex align-center">
            <div className="d-flex">
              <div className="dashboard-invoice-top">
                <img
                  className="mb-10"
                  src={`${
                    import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                  }/static/media/dashboard-invoice.svg`}
                  alt="invoice logo"
                />
                <h4>Invoices</h4>
              </div>

              <div
                className="cursor textStyle mb-5"
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: "created_at",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    status: "accepted",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate(ESTIMATES);
                }}
              >
                <span>Required: </span>
                <span>{data?.required}</span>
              </div>

              <div
                className="cursor textStyle"
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: "created_at",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    status: "closed",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate(ESTIMATES);
                }}
              >
                <span>Invoiced: </span>
                <span>{data?.invoiced}</span>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Card>
  );
};
