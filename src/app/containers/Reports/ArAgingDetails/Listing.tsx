/** @format */

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { Spinner } from "app/shared";
import { useAxios } from "app/Hooks";
import { FilterPopup } from "./Filters";
import { TooltipX } from "app/shared/ToolTip";
import ArAgingDetailsTable from "./ArAgingDetailsTable";

const todayDate = dayjs(new Date());

export const ArAgingDetailsListing = ({ listing, setparam, pagination }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [popOver, setPopOver] = useState(false);
  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      date_range: pagination.date_range || "this_week",
      custom_ranges:
        pagination.date_range === "custom"
          ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)]
          : [todayDate, todayDate],
    });
    setPopOver(pop);
  };

  const pdfDownload = () => {
    // const name = date_range.find((date) => date.value === pagination?.date_range)?.label;
    callAxios({
      url: `/report/aragingsummarydetailspdf?download=true&customer_id=${
        pagination?.contactId && typeof pagination?.contactId === "object"
          ? pagination.contactId.id
          : pagination?.contactId || ""
      }&view=${pagination.pageSize}&page=${
        pagination.page
      }&order_by=${"asc"}&sort_by=display_name&date_range=${
        pagination.date_range || "this_week"
      }&aging_by=${pagination.aging_by || "invoicedate"}&interval_type=${
        pagination.interval_type || "weeks"
      }&number_of_columns=${pagination.number_of_columns || "1"}&interval_range=${
        pagination.interval_range || "1"
      }&show_by=${pagination.show_by || "amount"}&is_include_credit_notes=${
        pagination.is_include_credit_notes === true
      }&interval=total`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = `Ar Aging Details Report.pdf`;
        element.click();
      }
    });
  };

  // const handleClearFilter = () => {
  //   setparam({
  //     ...pagination,
  //     show_by: "",
  //     aging_by: "",
  //     contactId: "",
  //     date_range: "",
  //     interval_type: "",
  //     interval_range: "",
  //     number_of_columns: "",
  //   });
  //   sessionStorage.removeItem("contactName");
  // };

  return (
    <>
      {false ? (
        <Spinner />
      ) : (
        <div className="item_listing">
          <div className="custom-filter pr-15">
            <div className="filter-bottom">
              <div className="d-flex">
                <FilterPopup
                  form={form}
                  popOver={popOver}
                  setparam={setparam}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                />
                {/* {(pagination?.date_range ||
                  pagination?.aging_by ||
                  pagination?.interval_range ||
                  pagination?.interval_type ||
                  pagination?.number_of_columns ||
                  pagination?.show_by) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )} */}
              </div>
              {listing && (
                <TooltipX title="Download">
                  <div onClick={pdfDownload} className="filter-toggle mr-10">
                    <img
                      className="downLoad hover-effect"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/downloadallattachments.svg`}
                    />
                    <span className={"color-gray"}>Download</span>
                  </div>
                </TooltipX>
              )}
            </div>
            {listing && <ArAgingDetailsTable transactions={listing} />}
          </div>
        </div>
      )}
    </>
  );
};
