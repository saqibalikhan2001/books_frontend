import { useNavigate } from "react-router";
import { Col, Progress, Row, Space, Typography } from "antd";
import { routeNames } from "static";
import { Spinner } from "app/shared";
import { getStringValueFromSS, setKeyInSS } from "utils";

const { INVOICES } = routeNames;

const CircularProgressBar = ({ qunatity, subtitle }) => {
  return (
    <Progress
      type="circle"
      style={{ marginLeft: "25px" }}
      percent={0}
      format={() => (
        <div style={{ fontSize: "14px" }}>
          {qunatity} {subtitle}
        </div>
      )}
      status="active"
    />
  );
};
type progressBarProps = {
  data: any;
  subtitle: String;
  loading: boolean;
  // dueColor: "#161616" | "#02ae4f";
};

export const ProgressBar = ({
  data,
  loading,
  subtitle,
}: // dueColor = "#161616",
progressBarProps) => {
  const navigate = useNavigate();

  return (
    <>
      {loading ? (
        <Spinner directionSize={"258px"} />
      ) : (
        <>
          <Row>
            <Col span={12} className="rec-pay-progress-sec">
              <Space
                size="middle"
                className="cursor"
                direction="vertical"
                style={{ display: "flex" }}
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: subtitle == "Bills" ? "bill_date" : "invoice_date",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    status: "due",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate(subtitle == "Bills" ? "/bills" : INVOICES);
                }}
              >
                <div className="progress-sec d-flex">
                  <Typography.Text>Due</Typography.Text>
                  <CircularProgressBar
                    subtitle={subtitle}
                    qunatity={subtitle == "Bills" ? data?.due?.bills : data?.due?.invoices}
                  />
                  <Typography.Title
                    level={5}
                    className={"truncate-2 receive_amount"}
                    style={{ textAlign: "center" }}
                  >
                    {`${data?.currency} ${data?.due?.amount?.toFixed(2)}`}
                  </Typography.Title>
                </div>
                <div className="rec-progress-bar-sec">
                  <Progress
                    strokeColor={"#118E03"}
                    strokeWidth={6}
                    percent={data?.due?.percent}
                    status="active"
                  />
                </div>
              </Space>
            </Col>
            <Col span={12} className="rec-pay-progress-sec">
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
                className="cursor"
                onClick={async () => {
                  const dataFromLS: any = getStringValueFromSS("params");
                  const params = {
                    ...dataFromLS,
                    sort: "desc",
                    sort_column: subtitle == "Bills" ? "bill_date" : "invoice_date",
                    start_range: data?.start_date,
                    end_range: data?.end_date,
                    status: "overdue",
                    search: "",
                    date_range: "custom",
                    contactId: "",
                    is_applied: true,
                  };
                  await setKeyInSS("params", params);
                  navigate(subtitle == "Bills" ? "/bills" : INVOICES);
                }}
              >
                <div className="progress-sec d-flex">
                  <Typography.Text type="danger" style={{ color: "#b2001e" }}>
                    Overdue
                  </Typography.Text>

                  <CircularProgressBar
                    subtitle={subtitle}
                    qunatity={subtitle == "Bills" ? data?.over_due.bills : data?.over_due.invoices}
                  />
                  <Typography.Title
                    level={5}
                    className={"truncate-2 receive_amount"}
                    style={{ textAlign: "center" }}
                  >
                    {`${data?.currency}${data?.over_due?.amount?.toFixed(2)}`}
                  </Typography.Title>
                </div>
                <div className="rec-progress-bar-sec">
                  <Progress
                    strokeWidth={6}
                    status="active"
                    strokeColor={"#b2001e"}
                    percent={data?.over_due?.percent}
                  />
                </div>
              </Space>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
