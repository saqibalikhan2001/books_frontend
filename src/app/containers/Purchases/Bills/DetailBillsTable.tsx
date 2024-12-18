/**@format */

import { Statistic, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { InvoiceItemDetailTable } from "app/shared";
import { getOverallTaxDetails, getSubTotalForInvBills } from "utils/calculation";

export const DetailBillsTable = ({ details, isModal }: any) => {
  const handleDisplaydiscount = () => {
    let discount: number;
    if (details?.bill_info?.discount_type === "percent") {
      discount =
        (getSubTotalForInvBills(
          details?.bill_info?.bill_item_details,
          details?.bill_info?.discount_level
        ) *
          details?.bill_info?.discount_transaction_level) /
        100;
      return discount;
    } else return details?.bill_info?.discount_transaction_level || 0;
  };

  const TaxImplemented = details?.bill_info?.bill_item_details.some((obj) => obj.tax_name !== null);

  return (
    <>
      <InvoiceItemDetailTable
        expenseAccount
        details={details}
        isModal={isModal}
        tableData={details?.bill_info?.bill_item_details}
      />

      <div className="product-details-right ">
        <div className=" d-flex justify_between gap-10">
          <div className="form_group payment-terms-box ">
            {(details?.bill_info?.terms_and_condition || details?.terms_and_condition) && (
              <>
                <div className="product_note">
                  <Typography.Title level={5} className="fw-md">
                    Terms and conditions
                  </Typography.Title>
                </div>
                <TextArea
                  rows={4}
                  disabled={true}
                  value={details?.bill_info?.terms_and_condition || details?.terms_and_condition}
                  className={`bills_term_condition ${
                    details?.bill_info?.terms_and_condition || details?.terms_and_condition
                      ? "text_bg_color"
                      : ""
                  }`}
                />
              </>
            )}
          </div>

          <div className="_item_details_summary_sec">
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Subtotal
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space amount---fix "
                prefix={details?.base_currency?.symbol}
                value={
                  getSubTotalForInvBills(
                    details?.bill_info?.bill_item_details,
                    details?.bill_info?.discount_level
                  ) || 0
                }
              />
            </div>
            {/* use in future */}
            {/* {details?.invoice_info?.discount_level === "transaction" && ( */}

            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Discount
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={handleDisplaydiscount()}
                prefix={`(-) ${details?.base_currency?.symbol}`}
              />
            </div>
            {TaxImplemented &&
              getOverallTaxDetails(details?.bill_info?.bill_item_details)?.flatMap((item: any) => (
                <div className="__customer_info mb-10" key={item?.id}>
                  <Typography.Title level={5} className="fw-regular">
                    {`${item.name} (${item.rate}%)`}:
                  </Typography.Title>
                  <Statistic
                    precision={2}
                    className="no-space amount---fix"
                    prefix={details?.base_currency?.symbol}
                    value={item?.total || 0}
                  />
                </div>
              ))}
            {/* <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Shipping
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                value={details?.bill_info?.shipping_charge || 0}
                prefix={details?.base_currency?.symbol}
              />
            </div> */}
            <div className="__customer_info">
              <Typography.Title level={5} className="fw-regular">
                Adjustment
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space bills_value"
                value={details?.bill_info?.adjustment || 0}
                prefix={details?.base_currency?.symbol}
              />
            </div>
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-bold">
                Bill total
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space amount---fix "
                value={details?.bill_info?.total}
                prefix={details?.base_currency?.symbol}
              />
            </div>
            <div className="__customer_info mb-10">
              <Typography.Title level={5} className="fw-regular">
                Payments made
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space"
                prefix={details?.base_currency?.symbol}
                value={details?.bill_info?.total - details?.bill_info?.balance_due}
              />
            </div>
            <div className="__customer_info mb-10 bottom-line">
              <Typography.Title level={5} className="fw-bold">
                Balance due
              </Typography.Title>
              <Statistic
                precision={2}
                className="no-space amount---fix "
                value={details?.bill_info?.balance_due}
                prefix={details?.base_currency?.symbol}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
