/** @format */

import { Labels } from "static";
import { Typography, Table, Statistic } from "antd";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";
import { DetailLinkedInvoicesTab } from "./Types";

const { NAME, SYMBOL } = Labels;
const { Text, Title } = Typography;

export const DetailLinkedInvoices = ({ details, type }: DetailLinkedInvoicesTab) => {
  const { org_date_format } = useStore();

  const columns = [
    {
      title: "Invoice number",
      dataIndex: "",
      className: "link_invoice_table",
      key: NAME,
      width: 55,
      ellipsis: true,
      render: (props: any) => {
        return (
          <Typography>
            <Text>
              {type === "advance" ? props?.get_invoice?.invoice_no : props?.invoice?.invoice_no}
            </Text>
          </Typography>
        );
      },
    },
    {
      title: "Issue date",
      dataIndex: "",
      key: NAME,
      width: 80,
      ellipsis: true,
      render: (props: any) =>
        getOrganizationDate(
          type === "advance" ? props?.get_invoice?.invoice_date : props?.invoice?.invoice_date,
          org_date_format
        ),
    },
    {
      title: "Due date",
      dataIndex: "",
      key: NAME,
      width: 80,
      ellipsis: true,
      render: (props: any) =>
        getOrganizationDate(
          type === "advance" ? props?.get_invoice?.due_date : props?.invoice?.due_date,
          org_date_format
        ),
    },
    {
      title: "Status",
      dataIndex: "",
      key: NAME,
      width: 50,
      ellipsis: true,
      showSorterTooltip: false,
      render: (props: any) => {
        return (
          <Typography>
            <Text
              className={`generic-badge ${
                type === "advance"
                  ? props?.get_invoice?.status === "partially paid"
                    ? "partially-paid"
                    : props?.get_invoice?.status
                  : props?.invoice?.status === "partially paid"
                  ? "partially-paid"
                  : props?.invoice?.status
              }`}
            >
              {type === "advance"
                ? props?.get_invoice?.status === "partially paid"
                  ? "PRTL Paid"
                  : props?.get_invoice?.status
                : props?.invoice?.status === "partially paid"
                ? "PRTL Paid"
                : props?.invoice?.status}
            </Text>
          </Typography>
        );
      },
    },
    {
      title: "Original amount",
      dataIndex: "",
      key: SYMBOL,
      width: 80,
      ellipsis: true,
      className: "text-right link_invoice_table",
      render: (props: any) => {
        return (
          <Typography>
            <Statistic
              precision={2}
              className="no-space w-break"
              prefix={`${details?.currency?.symbol}`}
              valueStyle={{ fontSize: "14px",display:"flex",justifyContent:"flex-end" }}
              value={type === "advance" ? props?.get_invoice?.total : props?.invoice?.total || 0}
            />
          </Typography>
        );
      },
    },
    {
      title: "Amount applied",
      dataIndex: "",
      key: NAME,
      ellipsis: true,
      width: 70,
      className: "text-right link_invoice_table",
      render: (props: any) => {
        return (
          <Typography>
            <Statistic
              precision={2}
              className="no-space w-break"
              prefix={`${details?.currency?.symbol}`}
              valueStyle={{ fontSize: "14px",display:"flex",justifyContent:"flex-end" }}
              value={props?.payment_made || 0}
            />
          </Typography>
        );
      },
    },
  ];
  //eslint-disable-next-line
  return (
    <>
      <Table
        columns={columns}
        className="link-invoices generic-table"
        pagination={false}
        dataSource={type === "advance" ? details?.invoice_payments : [details]}
      />

      {details.invoice?.length && (
        <div className="product_row  closing_balance total-charges">
          <div className="product_key">
            <Title level={5}>Total charges</Title>
          </div>
          <div className="product_value">
            <Statistic
              precision={2}
              className="no-space"
              prefix={`${details?.currency?.symbol}`}
              valueStyle={{ fontSize: "14px" }}
              value={
                type === "advance"
                  ? details?.payment - details?.unused_amount
                  : details?.payment_made - details?.unused_amount || 0
              }
            />
          </div>
        </div>
      )}
    </>
  );
};
