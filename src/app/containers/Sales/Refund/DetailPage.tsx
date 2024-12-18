import { Divider } from "antd";
import { Buttonx, Spinner } from "app/shared";
import { useEffect, useState } from "react";
import { getOrganizationDate } from "utils";
import { useAxios, useStore } from "app/Hooks";
import { PageHeader } from "@ant-design/pro-layout";

export const RefundDetailPage = ({ detail, toggle, currency }) => {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const [loader, setLoader] = useState(true);
  const [details, setDetails] = useState<any>();
  useEffect(() => {
    if (detail?.id) {
      callAxios({
        url: `/creditrefund/${detail?.id}/show`,
      }).then((res) => {
        setDetails(res);
        setLoader(false);
      });
    }
  }, [detail]);
  return (
    <>
      {loader ? (
        <Spinner />
      ) : (
        <div>
          <PageHeader
            className=" __items_details_header modals-header"
            title={`Credit Refund Details | ${details?.credit_note_no}`}
          />
          <div className="__items-details_container mx-100 transaction-tab-main supplier-popup-main custom--statement-module">
            <span className="fw-md w-102 mr-10">Refund Date</span>{" "}
            <span>{getOrganizationDate(details?.refund_date, org_date_format)}</span>
            <Divider />
            <span className="fw-md w-102  mr-10">Amount</span>
            <span>
              {currency}
              {details?.refund_credits}
            </span>
            <Divider />
            <span className="fw-md w-102 mr-10">Payment Mode</span>{" "}
            <span>{details?.refund_mode}</span>
            <Divider />
            <span className="fw-md w-102 mr-10">Reference</span> <span>{details?.reference}</span>
            <Divider />
            <div className="button_flexbox flex-end ">
              <Buttonx
                type="default"
                btnText="Cancel"
                htmlType="button"
                clickHandler={toggle}
                className="btn-default btn-form-size cate_cancel_btn mr-20 mb-30"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
