import dayjs from "dayjs";
import { Table } from "antd";
import { capitalize } from "utils";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const InvoicesOrderDetails = () => {
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    callAxios({
      url: "dashboard/order_details/invoices",
    }).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const columns = [
    {
      title: "Order Date",
      dataIndex: "invoice_date",
      key: "invoice_date",
      width: "19%",
      render: (date: string) => dayjs(date).format("MMM DD, YY"),
    },
    {
      title: "Invoices No",
      dataIndex: "invoice_no",
      key: "invoice_no",
      width: "19%",
      render: (text: string, record) => (
        <span
          className="customer_name"
          style={{ fontWeight: "400", color: "blue", cursor: "pointer" }}
          onClick={() => navigate(`/invoice/${record?.id}`)}
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
          onClick={() => navigate(`/customer/${record?.customer_id}`)}
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
      className={tableClass}
      pagination={false}
      loading={tableLoading}
      dataSource={data}
      columns={columns}
      size="small"
    />
  );
};
