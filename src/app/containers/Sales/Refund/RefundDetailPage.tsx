import { Divider } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { useStore } from "app/Hooks";
import { getOrganizationDate } from "utils";

export const DetailPage = ({ details, PaymentRefund, currency }: any) => {
  const { org_date_format } = useStore();
  return (
    <>
      <div className="__credit--refund-main">
        <PageHeader
          className=" __items_details_header modals-header"
          title={
            PaymentRefund
              ? `Credit Refund Details`
              : `Credit Refund Details | ${details?.credit_note_no}`
          }
        />
        <div className="__items-details_container mx-100 transaction-tab-main supplier-popup-main custom--statement-module">
          <span className="fw-md w-102 mr-10">Refund Date</span>
          <span>{getOrganizationDate(details?.refund_date, org_date_format)}</span>
          <Divider />
          <span className="fw-md w-102  mr-10">Amount</span>
          <span>
            {PaymentRefund
              ? `${currency}${details?.amount.toFixed(2)}`
              : `${currency}${details?.refund_credits.toFixed(2)}`}
          </span>
          <Divider />
          <span className="fw-md w-102 mr-10">Payment Mode</span>
          <span>{PaymentRefund ? details?.mode : details?.refund_mode}</span>
          <Divider />
          <div className="refrence--main">
          <span className="fw-md w-102 mr-10">Reference</span> <span>{details?.reference}</span>
          </div>
          <Divider />
          <div className="description--main">
          <span className="fw-md w-102 mr-10">Description</span> <span>{details?.note}</span>
            </div>
          <Divider />
        </div>
      </div>
    </>
  );
};
