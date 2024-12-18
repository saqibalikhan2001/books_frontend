/** @format */

import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Col, Form, Progress, Row, Typography } from "antd";
import { endpoints } from "static";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";
import { StatsHeader } from "./StatsHeader";
import { getFullDate, getStringValueFromSS, setKeyInSS } from "utils";

const { Title } = Typography;

export const PurchaseInformation = ({ preferences }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const date = Form.useWatch("date_range", form);
  const custom_ranges = Form.useWatch("custom_ranges", form);

  useLayoutEffect(() => {
    preferences?.purchase_information &&
      form.setFieldValue("date_range", preferences?.purchase_information);
  }, [form, preferences?.purchase_information]);

  useEffect(() => {
    setLoading(true);
    let url;
    if (date) {
      if (date === "custom" && custom_ranges) {
        url = `${endpoints.PURCHASE_INFO}/${date}?starting_date=${
          getFullDate(custom_ranges[0]) + " 00:00:00"
        }&ending_date=${getFullDate(custom_ranges[1]) + " 23:59:59"}`;
      } else if (date !== "custom") {
        url = `${endpoints.PURCHASE_INFO}/${date}`;
      }
      if (url) {
        callAxios({
          url,
        }).then((res) => {
          if (res) {
            setData(res);
            setLoading(false);
          }
        });
      }
    }
  }, [date, custom_ranges]);

  return (
    <Card className="card-layout">
      <StatsHeader tittle="Purchase Information" form={form} />
      {/* <> */}
      {loading ? (
        <Spinner directionSize={"258px"} />
      ) : (
        <div className="dash-purchase-info">
          <Row>
            <Col span={12} className="border-bottom-e5e5e5 pb-2">
              <div className="border-container">
                <div className="purch-info-row d-flex justify_between align-center">
                  <span>Quantity Ordered</span>
                  <span>{data?.ordered}</span>
                </div>
                <div
                  className="purch-info-row d-flex justify_between align-center cursor"
                  onClick={async () => {
                    const dataFromLS: any = getStringValueFromSS("params");
                    const params = {
                      ...dataFromLS,
                      sort: "desc",
                      sort_column: "bill_date",
                      start_range: data?.start_date,
                      end_range: data?.end_date,
                      status: "all",
                      search: "",
                      date_range: "custom",
                      contactId: "",
                      is_applied: true,
                    };
                    await setKeyInSS("params", params);
                    navigate("/bills");
                  }}
                >
                  <span>Total Cost</span>
                  <span>
                    {data?.currency}&nbsp;
                    {data?.total_cost.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="border-container">
                {/*<div className="purch-info-row d-flex justify_between align-center">
                  <span>Quantity to be received</span>
                  <span>{data?.quantity_to_be_received}</span>
                </div>*/}

                <div
                  className="purch-info-row d-flex justify_between align-center cursor"
                  onClick={async () => {
                    const dataFromLS: any = getStringValueFromSS("params");
                    const params = {
                      ...dataFromLS,
                      sort: "desc",
                      sort_column: "bill_date",
                      start_range: data?.start_date,
                      end_range: data?.end_date,
                      status: "open",
                      search: "",
                      date_range: "custom",
                      contactId: "",
                      is_applied: true,
                    };
                    await setKeyInSS("params", params);
                    navigate("/bills");
                  }}
                >
                  <span>Bills to be paid</span>
                  <span>
                    {data?.currency}&nbsp;
                    {data?.bills_to_be_paid.toFixed(2)}
                  </span>
                </div>
              </div>

              <div
                className="purch-info-row d-flex justify_between align-center cursor pb-10 m-0 border-bottom-e5e5e5"
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: "created_at",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    stock_status: "lowstock",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate("/items");
                }}
              >
                <span style={{ color: "#b2001e" }}>Low stock Products</span>
                <span style={{ color: "#b2001e" }}>{data?.low_stock_items}</span>
              </div>
            </Col>
            <Col span={12}>
              <div
                className="d-flex align-center justify-center purchase-progress "
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: "created_at",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    status: "active",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate("/items");
                }}
              >
                <Title className="cursor-pointer" level={5}>
                  Active Products
                </Title>
                <div className="active-item-bar d-flex w-100 cursor-pointer">
                  <Title level={5}>
                    {data?.active_items}/{data?.total_items}
                  </Title>
                  <Progress
                    size="small"
                    showInfo={false}
                    strokeWidth={6}
                    percent={data?.items_percentage}
                  />
                  <Title level={5}> {data?.items_percentage}% </Title>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {/* </> */}
    </Card>
  );
};
