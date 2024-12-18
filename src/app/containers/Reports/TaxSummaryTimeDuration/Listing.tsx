/** @format */

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { Spinner } from "app/shared";
import { useAxios } from "app/Hooks";
import { FilterPopup } from "./Filters";
import { date_range } from "./filterOptions";
import { TooltipX } from "app/shared/ToolTip";
import TaxSummaryTimeDurationTable from "./TaxSummaryTimeDurationTable";

const todayDate = dayjs(new Date());

export const TaxSummaryTimeDurationListing = ({ listing, setparam, pagination }) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [popOver, setPopOver] = useState(false);

  // const handleClearFilter = () => {
  //   setparam({
  //     ...pagination,
  //     date_range: ""
  //   });
  //   sessionStorage.removeItem("contactName");
  // };

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
    const name = date_range.find((date) => date.value === pagination?.date_range)?.label;
    callAxios({
      url: `/report/tax/summary/pdf_time_duration?view=5&download=true&page=1&order_by=asc&sort_by=created_at&date_range=${pagination?.date_range}`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = `${name || ""} Tax Summary (Time Duration) Report.pdf`;
        element.click();
      }
    });
  };
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
                {/* {(pagination?.date_range) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )} */}
              </div>
              {listing?.taxes?.length > 0 && (
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
            {listing?.taxes?.length > 0 && <TaxSummaryTimeDurationTable transactions={listing} />}
          </div>
        </div>
      )}
    </>
  );
};
