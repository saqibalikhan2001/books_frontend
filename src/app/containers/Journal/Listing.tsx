/** @format */
//@ts-nocheck
import { useEffect, useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { date_range } from "./filterOptions";
import { TooltipX } from "app/shared/ToolTip";
import { EmptyIcon, Spinner } from "app/shared";
import TransactionTable from "./TransactionTable";
import { FilterPopup } from "./DetailPlusListingHeader";
import InfiniteScroll from "react-infinite-scroll-component";

const todayDate = dayjs(new Date());

export const JournalListng = ({
  refetch,
  listing,
  setparam,
  pagination,
  total,
  last_page,
}: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [page, setPage] = useState(2);
  const [customLoading] = useState(false);
  const [popOver, setPopOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setInfiniteLoading] = useState(false);
  const [transactionData, settransectionData] = useState([]);

  useEffect(() => {
    settransectionData(listing);
    //eslint-disable-next-line
  }, []);

  const loadProducts = () => {
    callAxios({
      url: `journal?page=${page}&view=10&date_range=${pagination?.date_range || "this_month"}`,
      method: "get",
    }).then((res) => {
      settransectionData((prevData) => [...prevData, ...res?.data?.journal?.data]);
      setPage(page + 1);
    });
    ``;
  };

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

  const pdfDownload = () => {
    setIsLoading(true);

    const name = date_range.find((date) => date.value === pagination?.date_range)?.label;

    callAxios({
      url: `/journal/pdf?download=true&date_range=${pagination?.date_range}`,
    })
      .then((res) => {
        if (res) {
          setIsLoading(false);
          const element = document.createElement("a");
          element.href = res;
          element.download = `${name ?? ""} Journal.pdf`;
          element.click();
        }
      })
      .catch(() => {
        setIsLoading(false); // Stop the spinner in case of error
      });
  };

  return (
    <>
      {customLoading || isLoading ? (
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
              {listing?.length > 0 && (
                <TooltipX title="Download">
                  <div className="filter-toggle mr-10" onClick={pdfDownload}>
                    <img
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/downloadallattachments.svg`}
                      alt="download icon"
                      className="hover-effect"
                    />
                    <span className={"color-gray"}>Download</span>
                  </div>
                </TooltipX>
              )}
            </div>
            {transactionData?.length > 0 ? (
              <TransactionTable
                page={page}
                last_page={last_page}
                loadProducts={loadProducts}
                transactions={transactionData}
              />
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
