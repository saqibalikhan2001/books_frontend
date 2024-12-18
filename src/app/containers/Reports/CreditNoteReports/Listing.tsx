/** @format */

import { Form } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { Spinner } from "app/shared";
import { FilterPopup } from "./Filters";
import { date_range } from "./FilterOptions";
import { TooltipX } from "app/shared/ToolTip";
import CreditNotesReportTable from "./CreditNotesReportTable";

const todayDate = dayjs(new Date());

export const CreditNotesReportListing = ({
  listing,
  popOver,
  setparam,
  setApply,
  pagination,
  setPopOver,
  customer = false,
}: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();

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
      url: customer
        ? `/report/creditnote/pdf?download=true&date_range=${pagination?.date_range}&contact_id=${
            pagination?.contactId && typeof pagination?.contactId === "object"
              ? pagination.contactId.id
              : pagination?.contactId || ""
          }`
        : `/report/creditnote/pdf?download=true&date_range=${pagination?.date_range}`,
    }).then((res) => {
      if (res) {
        const element = document.createElement("a");
        element.href = res;
        element.download = customer
          ? `${name} Credit Notes By Customer Report.pdf`
          : `${name} Credit Notes Report.pdf`;
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
                  setApply={setApply}
                  customer={customer}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                />
              </div>
              {listing?.data?.length > 0 && (
                <TooltipX title="Download">
                  <div className="filter-toggle mr-10" onClick={pdfDownload}>
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
            {listing?.data?.length > 0 && <CreditNotesReportTable transactions={listing} />}
          </div>
        </div>
      )}
    </>
  );
};
