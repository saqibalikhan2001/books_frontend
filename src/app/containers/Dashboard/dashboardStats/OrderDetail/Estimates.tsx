import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Table } from "antd";
import dayjs from "dayjs";
import { capitalize } from "utils";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";

export const EstimateOrderDetail = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    callAxios({
      url: "dashboard/order_details/estimates",
    }).then((res) => {
      const dataWithKeys = res.map((item, index) => ({ ...item, key: item.id || index }));
      setData(dataWithKeys);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "Estimate Date",
      dataIndex: "estimate_date",
      key: "estimate_date",
      width: "19%",
      render: (date: string) => dayjs(date).format("MMM DD, YY"),
    },
    {
      title: "Estimate No",
      dataIndex: "estimate_no",
      key: "estimate_no",
      width: "19%",
      render: (text: string, record) => (
        <span
          className="customer_name"
          style={{ fontWeight: "400", color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/estimate/${record?.id}`)}
        >
          <u>{text}</u>
        </span>
      ),
    },
    {
      title: "Customer Name",
      dataIndex: "display_name",
      key: "display_name",
      width: "25%",
      render: (text: string, record) => (
        <span
          className="customer_name"
          style={{ fontWeight: "400", color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/customer/${record?.contact?.id}`)}
        >
          <u>{text}</u>
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status: string) => (
        <span
          className={`generic-badge ${status === "partially paid" ? "partially-paid" : status}`}
        >
          {capitalize(status === "partially paid" ? "PRTL Paid" : status)}
        </span>
      ),
    },
    {
      title: "Amount",
      // dataIndex: 'total',
      key: "total",
      width: "15%",
      align: "right" as "right",
      render: (props) => {
        return `${props.currency.symbol}${props.total.toFixed(2)}`;
      },
    },
  ];
  const tableLoading = {
    spinning: loading,
    indicator: <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />,
  };
  const tableClass = `generic-table dashboard-table ${!data?.length ? "empty_table" : ""}`;
  return (
    <Table
      size="small"
      dataSource={data}
      columns={columns}
      pagination={false}
      loading={tableLoading}
      className={tableClass}
    />
  );
};
