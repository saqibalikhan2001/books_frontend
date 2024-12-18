import { Statistic, Table } from "antd";
import { useStore } from "app/Hooks";
import { capitalize, getOrganizationDate } from "utils";

export const DetailBillPaymentsTable = ({ details, payment_made }: any) => {
  const { org_date_format } = useStore();
  const TableColumn: any = [
    {
      title: "Bill number",
      width: 50,
      ellipsis: true,
      key: "bill_no",
      dataIndex: "bill_no",
    },
    {
      title: "Issue date",
      width: 80,
      dataIndex: "",
      ellipsis: true,
      key: "bill_date",
      render: (props: any) => <>{getOrganizationDate(props?.bill_date, org_date_format)}</>,
    },
    {
      title: "Due date",
      width: 70,
      ellipsis: true,
      key: "payment_mode",
      dataIndex: "",
      render: (props: any) => <>{getOrganizationDate(props?.due_date, org_date_format)}</>,
    },
    {
      title: "Payment",
      width: 50,
      dataIndex: "",
      ellipsis: true,
      align: "right",
      key: "payment_made",
      render: (props: any) => (
        <Statistic
          precision={2}
          className="no-space"
          value={payment_made}
          prefix={props?.currency_symbol}
          valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
        />
      ),
    },
    // {
    //   title: "Balance",
    //   width: 50,
    //   dataIndex: "",
    //   ellipsis: true,
    //   align: "right",
    //   key: "balance_due",
    //   render: (props: any) => (
    //     <Statistic
    //       precision={2}
    //       className="no-space"
    //       //as per instruction by Sir Basit on Date 12-JUL-2024  Balance = 0
    //       value={0}
    //       prefix={props?.currency_symbol}
    //       valueStyle={{ fontSize: "14px",display:"flex",justifyContent:"flex-end" }}
    //     />
    //   ),
    // },
    {
      title: "Status",
      width: 50,
      ellipsis: true,
      key: "status",
      dataIndex: "status",
      render: (status: string) => (
        <span
          className={`generic-badge ${status === "partially paid" ? "partially-paid" : status}`}
        >
          {capitalize(status)}
        </span>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="key"
        bordered={false}
        pagination={false}
        columns={TableColumn}
        dataSource={details}
        style={{ marginTop: "2px" }}
        className="generic-table report-period-tbl"
      />
    </>
  );
};
