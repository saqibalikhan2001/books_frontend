/** @format */

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { Spinner } from "app/shared";
import { useAxios } from "app/Hooks";
import { FilterPopup } from "./Filters";
import ArAgingTable from "./ArAgingTable";
import { TooltipX } from "app/shared/ToolTip";
import { CustomPaginate } from "app/shared/CustomPaginate";

const todayDate = dayjs(new Date());

export const ArAgingSummaryListing = ({
  Prev,
  Next,
  listing,
  setparam,
  pagination,
  handlePage,
  handleRowSize,
}: any) => {
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
      url: `/report/aragingsummarypdf?download=true&date_range=${
        pagination?.date_range || "this_week"
      }&view=20&page=${pagination?.page}&order_by=${pagination?.sort}&sort_by=created_at&aging_by=${
        pagination?.aging_by || "invoiceduedate"
      }&interval_type=${pagination?.interval_type || "weeks"}&number_of_columns=${
        pagination?.number_of_columns || "1"
      }&interval_range=${pagination?.interval_range || "1"}&show_by=${
        pagination?.show_by || "amount"
      }&is_include_credit_notes=${pagination?.is_include_credit_notes === true}`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = `Ar Aging Summary Report.pdf`;
        element.click();
      }
    });
  };

  // const handleClearFilter = () => {
  //   setparam({
  //     ...pagination,
  //     date_range: null,
  //     aging_by: null,
  //     interval_range: null,
  //     interval_type: null,
  //     number_of_columns: null,
  //     show_by: null,
  //   });
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
                <div className="d-flex">
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
                  <CustomPaginate
                    Prev={Prev}
                    Next={Next}
                    paginate={pagination}
                    handlePage={handlePage}
                    className="pagination_row"
                    handleRowSize={handleRowSize}
                    totalPages={listing?.aging_summary_data?.last_page}
                  />
                </div>
              )}
            </div>
            {listing && <ArAgingTable transactions={listing} />}
          </div>
        </div>
      )}
    </>
  );
};
