import { PageHeader } from "@ant-design/pro-layout";
import { Statistic, Table, Typography } from "antd";
import { useAxios, useStore } from "app/Hooks";
import { Spinner } from "app/shared";
import React, { useEffect, useMemo, useState } from "react";
import { getOrganizationDate } from "utils";

export default function INVPaymentDetailPage({ detail }) {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState<any>();

  useEffect(() => {
    if (detail?.id) {
      callAxios({
        url: `/advancepayment/${detail?.id}`,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
      });
    }
  }, [detail]);
  const memoColumns: any = useMemo(
    () => [
      {
        title: "Invoice No.",
        width: 80,
        dataIndex: "invoice_no",
        ellipsis: true,
        key: "invoice_no",
      },
      {
        title: "Invoice Date",
        width: 50,
        ellipsis: true,
        key: "invoice_date",
        dataIndex: "",
        render: (props: any) => getOrganizationDate(props?.invoice_date, org_date_format),
      },

      {
        title: "Invoice Amount",
        width: 50,
        dataIndex: "",
        ellipsis: true,
        align: "right",
        key: "payment_made",
        className: "right-align_amount",
        render: (props: any) => (
          <Statistic
            precision={2}
            className="no-space"
            value={props?.total}
            prefix={details?.currency?.symbol}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Payment Received",
        width: 50,
        dataIndex: "",
        ellipsis: true,
        align: "right",
        key: "payment_made",
        className: "right-align_amount",
        render: () => (
          <Statistic
            precision={2}
            className="no-space"
            value={details?.payment_made}
            prefix={details?.currency?.symbol}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
    ],
    //eslint-disable-next-line
    [details]
  );
  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <>
          <PageHeader
            className=" __items_details_header modals-header"
            title={`Payment | Payment  #${details?.payment_no}`}
          />
          <div className="__items-details_container mx-100 transaction-tab-main supplier-popup-main custom--statement-module">
            <div className="product_row w-100 divider f--bold pb-8">
              <Typography className="f-16">Payment Details</Typography>
            </div>
            <div className="d-flex justify_between bill_customer_info align-top-values--payments">
              <div className="w-100">
                <div className="__customer_info">
                  <span className="fw-md info_detail">Reference No</span>
                  <span className='aligned-dots'>:</span>
                  <span>{details?.reference}</span>
                </div>

                <div className="__customer_info">
                  <span className="fw-md info_detail">Date</span>
                  <span className='aligned-dots'>:</span>
                  <span>{getOrganizationDate(details?.payment_date, org_date_format)}</span>
                </div>

                <div className="__customer_info">
                  <span className="fw-md info_detail">Amount paid</span>
                  <span className='aligned-dots'>:</span>
                  <span>
                    <Statistic
                      precision={2}
                      className="no-space"
                      value={details?.payment_made}
                      valueStyle={{ fontSize: "14px" }}
                      prefix={details?.currency?.symbol}
                    />
                  </span>
                </div>
                <div className="__customer_info">
                  <span className="fw-md info_detail">Payment method </span>
                  <span className='aligned-dots'>:</span>
                  <span>{details?.payment_mode}</span>
                </div>
              </div>
            </div>
            <Table
              rowKey="key"
              pagination={false}
              columns={memoColumns}
              dataSource={[details?.invoice]}
              className="mt-20 generic-table no-radius transaction-subtabs"
            />
          </div>
        </>
      )}
    </>
  );
}
