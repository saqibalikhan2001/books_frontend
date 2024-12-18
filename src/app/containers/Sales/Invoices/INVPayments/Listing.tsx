/** @format */

import { Button, Statistic, Table, Typography } from "antd";
import type { TableProps } from "antd/es/table";
import { useAxios, useStore } from "app/Hooks";
import { ActionMenu, Spinner } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import { useEffect, useMemo, useState } from "react";
import { Labels } from "static";
import { getOrganizationDate } from "utils";
import { PaymentReceivedDataSourceProps } from "../../PaymentsReceived/Types";
import { PaymentListingProps } from "./Types";

const { DELETE } = Labels;

export const PaymentsListing = ({
  url,
  from,
  isModal = false,
  detail,
  toggle,
  loading,
  fetchList,
  showButton,
  toggleModal,
  dashboardProp,
  handleConfirm,
  handleConfirmCredit,
  has_permission,
  toggleAppliedModal,
}: PaymentListingProps) => {
   
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [payments, setPayments] = useState<any>();
  const [filter, setFilter] = useState<any>({
    sortOrder: "descend",
    columnType: "payment_date",
  });
  useEffect(() => {
    toggle();
    if (url) {
      callAxios({
        url: `${url}?sort_by=${filter.columnType}&order_by=${
          filter.sortOrder === "ascend" ? "asc" : "desc"
        }`,
      }).then((res) => {
        toggle();
        setPayments(res);
      });
    }
  }, [url, fetchList, filter]);

  const handleFilter: TableProps<any>["onChange"] = (_, __, sorter: any) => {
    setFilter({
      ...filter,
      columnType: sorter.columnKey,
      sortOrder: filter.sortOrder === "ascend" ? "descend" : "ascend",
    });
  };
  const Title = ({ type, title }) => {
    return (
      <div className="">
        {title}
        {!isModal && filter.columnType === type && (
          <TooltipX title={`Sort by ${filter.sortOrder === "ascend" ? "ascending" : "descending"}`}>
            {filter.sortOrder === "ascend" ? ascendingIcon : descendingIcon}
          </TooltipX>
        )}
      </div>
    );
  };

  const dummypaymentReceivedColumns: any = useMemo(
    () =>
      [
        {
          title: "Date",
          width: 50,
          ellipsis: true,
          key: "payment_date",
          // showSorterTooltip: false,
          dataIndex: "",
          // sorter: payments?.invoicePayments?.length && !isModal,
          // render: (props: any) => getOrganizationDate(props?.payment_date, org_date_format),
        },
        {
          title: () => <Title type="payment_no" title="Payment number" />,
          width: 80,
          dataIndex: "",
          ellipsis: true,
          key: "payment_no",
        },
        {
          title: () => <Title type="payment_mode" title="Payment method" />,
          width: 70,
          ellipsis: true,
          key: "payment_mode",
        },
        {
          title: () => <Title type="payment_made" title="Amount" />,
          width: 50,
          dataIndex: "",
          ellipsis: true,
          align: "right",
          key: "payment_made",
          className: "right-align_amount",
        },
        {
          title: "",
          dataIndex: "",
          width: 20,
          key: "x",
          hide: isModal,
        },
      ].filter((show) => !show.hide),
    //eslint-disable-next-line
    [has_permission, filter, payments]
  );

  const paymentReceivedColumns: any = useMemo(
    () =>
      [
        {
          title: () => <Title type="payment_date" title="Date" />,
          width: 50,
          ellipsis: true,
          key: "payment_date",
          showSorterTooltip: false,
          dataIndex: "",
          sorter: payments?.invoicePayments?.length && !isModal,
          render: (props: any) => getOrganizationDate(props?.payment_date, org_date_format),
        },
        {
          title: () => <Title type="payment_no" title="Payment number" />,
          width: 80,
          dataIndex: "",
          ellipsis: true,
          key: "payment_no",
          showSorterTooltip: false,
          sorter: payments?.invoicePayments?.length && !isModal,
          render: (props) => (
            <Typography>
              Payment #
              {props?.advance_payment ? props?.advance_payment?.payment_no : props?.payment_no}
            </Typography>
          ),
        },
        {
          title: () => <Title type="payment_mode" title="Payment method" />,
          width: 70,
          ellipsis: true,
          key: "payment_mode",
          showSorterTooltip: false,
          dataIndex: "payment_mode",
          sorter: payments?.invoicePayments?.length && !isModal,
        },
        {
          title: () => <Title type="payment_made" title="Amount" />,
          width: 50,
          dataIndex: "",
          ellipsis: true,
          align: "right",
          key: "payment_made",
          className: "right-align_amount",
          showSorterTooltip: false,
          sorter: payments?.invoicePayments?.length && !isModal,
          render: (props: PaymentReceivedDataSourceProps) => (
            <Statistic
              precision={2}
              className="no-space"
              value={props.payment_made}
              prefix={props?.currency?.symbol}
              valueStyle={{ fontSize: "14px" }}
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          width: 20,
          key: "x",
          hide: isModal,
          align: "right" as const,
          render: (props: any) => (
            <ActionMenu
              data={props}
              invoicePayment
              handleConfirm={handleConfirm}
              deletePermission={has_permission && detail?.invoice_info?.platform_type !== "ims"}
              title={
                has_permission
                  ? `Do you want to Delete Payment# ${
                      props?.advance_payment
                        ? props?.advance_payment?.payment_no
                        : props?.payment_no
                    }?`
                  : "Access Denied"
              }
            />
          ),
        },
      ].filter((show) => !show.hide),
    //eslint-disable-next-line
    [has_permission, filter, payments]
  );  const creditsAppliedColumns: any = useMemo(
    () =>
      [
        {
          title: "Date",
          ellipsis: true,
          key: "payment_date",
          dataIndex: "",
          render: (props: any) => getOrganizationDate(props?.credit_utilize_date, org_date_format),
        },
        {
          title: "Credit Note No.",
          dataIndex: "",
          ellipsis: true,
          key: "credit_note_no",
          render: (props) => <Typography>{props?.credit_note?.credit_note_no}</Typography>,
        },
        {
          title: "Credits applied",
          ellipsis: true,
          key: "payment_mode",
          dataIndex: "",
          align: "right",
          className: "right-align_amount",
          render: (props: any) => (
            <Statistic
              precision={2}
              className="no-space"
              value={props.used_credits}
              prefix={props?.currency?.symbol}
              valueStyle={{ fontSize: "14px" }}
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          width: 20,
          key: "x",
          hide: isModal || from,
          align: "right" as const,
          render: (props: any) => (
            <ActionMenu
              data={props}
              invoicePayment
              handleConfirm={handleConfirmCredit}
              deletePermission={has_permission}
              title={
                has_permission
                  ? `${DELETE} "${props?.credit_note.credit_note_no}"? `
                  : "Access Denied"
              }
            />
          ),
        },
      ].filter((data) => !data.hide),
    //eslint-disable-next-line
    []
  );

  return (
    <>
      <>
        {showButton && !isModal && (
          <div className="add_new_btn">
            <Button
              className="btn-primary btn-form-size "
              disabled={detail.invoice_info.total === 0}
              style={{ marginRight: "5px" }}
              onClick={() => {
                toggleModal();
              }}
            >
              <span className="add-new-btn" style={{ margin: "5px" }}>
                <img
                  alt="add icon"
                  className="mr-5 "
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                />{" "}
                Receive Payments
              </span>
            </Button>
            {
              //adding new payment option according to BMS-3827
            }
            {detail?.utilizeableCredits && detail?.invoice_info?.status !== "paid" && (
              <Button
                className="btn-primary btn-form-size "
                onClick={() => {
                  toggleAppliedModal();
                }}
              >
                <span className="add-new-btn" style={{ margin: "5px" }}>
                  <img
                    alt="add icon"
                    className="mr-5 "
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_1x.svg`}
                  />{" "}
                  Pay via Credits
                </span>
              </Button>
            )}
          </div>
        )}

        {loading ? (
          // <h1>amar ali anwar</h1>
          <Spinner directionSize={window.innerWidth >= 1600 ? '345px' : '132px'} size={'50px'} />
        ) : (
          <>
            {payments?.invoicePayments.length === 0 && payments?.creditPayments.length === 0 ? (
              <div>
                <Table
                  rowKey={"1"}
                  bordered={false}
                  pagination={false}
                  loading={loading}
                  onChange={handleFilter}
                  columns={dummypaymentReceivedColumns}
                  dataSource={[]}
                  className={`generic-table no-radius transaction-subtabs`}
                />
              </div>
            ) : (
              <>
                {payments?.invoicePayments.length > 0 && (
                  <>
                    <Typography className="bold">Payments receipts</Typography>
                    <Table
                      rowKey={"1"}
                      bordered={false}
                      pagination={false}
                      loading={loading}
                      onChange={handleFilter}
                      columns={paymentReceivedColumns}
                      dataSource={payments?.invoicePayments || []}
                      className={`generic-table no-radius transaction-subtabs invoice_payment_receipt_detail`}
                    />
                  </>
                )}
                {payments?.creditPayments.length > 0 && (
                  <>
                    <Typography className="bold">Credits applied</Typography>
                    <Table
                      rowKey={"1"}
                      bordered={false}
                      pagination={false}
                      loading={loading}
                      columns={creditsAppliedColumns}
                      dataSource={payments?.creditPayments || []}
                      className={`generic-table no-radius transaction-subtabs  ${dashboardProp?.id ? 'invoice-credit--applied':''}`}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    </>
  );
};

const ascendingIcon = (
  <span className="white-circle">
    <img
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-ascending.svg`}
      alt="ascending order"
      className="ascending order"
    />
  </span>
);
const descendingIcon = (
  <span className="white-circle">
    <img
      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sort-descending.svg`}
      alt="descending order"
      className="ascending order"
    />
  </span>
);
