/** @format */

import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { date_range } from "./filterOptions";
import { EmptyIcon, Spinner } from "app/shared";
import TrialBalanceTable from "./TrialBalanceTable";
import { FilterPopup } from "./DetailPlusListingHeader";

const todayDate = dayjs(new Date());

export const TrialBalanceListing = ({ refetch, listing, setparam, pagination }: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [customLoading] = useState(false);
  const [popOver, setPopOver] = useState(false);

  // const handleClearFilter = () => {
  //   setparam({
  //     ...pagination,
  //     date_range: "",
  //     start_range: "",
  //     end_range: "",
  //   });
  // };
  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      date_range: pagination.date_range || "this_month",

      custom_ranges:
        pagination.date_range === "custom"
          ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)]
          : [todayDate, todayDate],
    });
    setPopOver(pop);
  };

  //@ts-ignore
  const pdfDownload = () => {
    const name = date_range.find((date) => date.value === pagination?.date_range)?.label;
    callAxios({
      url: `/journal/pdf?download=true&date_range=${pagination?.date_range}`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = `${name} Journal.pdf`;
        element.click();
      }
    });
  };
  return (
    <>
      {customLoading ? (
        <Spinner directionSize={"87vh"} />
      ) : (
        <div className="item_listing">
          <div className="custom-filter pr-15 pt-0">
            <div className="filter-bottom">
              <div className="d-flex">
                <FilterPopup
                  form={form}
                  popOver={popOver}
                  refetch={refetch}
                  setparam={setparam}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                />
                {/* <Button
                      type="link"
                      className="d-flex align-items-end clear_filter_btn"
                      onClick={handleClearFilter}
                    >
                      Clear filters
                    </Button> */}
              </div>
              {/* {listing?.trial_balance?.length > 0 && (
                <TooltipX title="Download">
                <div className="filter-toggle mr-10" onClick={pdfDownload}>

                  <img
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/downloadallattachments.svg"
                    onClick={pdfDownload}
                    className="downLoad hover-effect"
                  />
                  <span className={"color-gray"} >Download</span>
                </div>
                </TooltipX >
              )} */}
            </div>
            {listing?.trial_balance?.length > 0 ? (
              <TrialBalanceTable transactions={listing} />
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "600px",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <EmptyIcon />
                <span>No record found</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
