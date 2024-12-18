/** @format */

import { DetailPaymentsTabProps } from "./Types";
import { Typography, Statistic } from "antd";

// const { TextArea } = Input;

export const DetailPayments = ({ details }: DetailPaymentsTabProps) => {
  return (
    <>
      <div className="payment_received_detail">
        <div className="product-details-right ">
          <div className="__customer_info">
            <Typography.Title level={5} className="fw-black ">
              Amount received
            </Typography.Title>
            <Statistic
              precision={2}
              className="no-space  padding-block"
              prefix={details?.currency?.symbol}
              value={
                details?.payment_type === "advance" ? details?.payment : details?.payment_made || 0
              }
            />
          </div>
          <div className="__customer_info ">
            <Typography.Title level={5} className="fw-black ">
              Total charges
            </Typography.Title>
            <Statistic
              precision={2}
              className="no-space  padding-block"
              prefix={details?.currency?.symbol}
              value={
                (details?.payment_type === "advance" ? details?.payment : details?.payment_made) -
                  details?.unused_amount || 0
              }
            />
          </div>
          <div className="__customer_info">
            <Typography.Title level={5} className="fw-black">
              Amount credited
            </Typography.Title>
            <Statistic
              precision={2}
              className="no-space border-block  padding-block"
              prefix={details?.currency?.symbol}
              value={details?.unused_amount || 0}
            />
          </div>
        </div>
        {(details?.invoice?.customer?.terms_and_condition || details?.terms_and_condition) && (
          <div className="form_group payment-terms-box ">
            <Typography.Title level={5} className="terms-condition-heading lh-18">
              Terms and conditions
            </Typography.Title>
            <span className="term_condition_detail">
              {details?.invoice?.customer?.terms_and_condition || details?.terms_and_condition}
            </span>
            <br />
            <br />
          </div>
        )}
      </div>
    </>
  );
};
