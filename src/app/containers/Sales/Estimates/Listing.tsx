/** @format */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import {
  FilterPopup,
  SelectedRows,
  EstimateTiles,
  DetailpageHeader,
} from "./DetailPlusListingHeader";
import { Columns } from "./constant";
import { useAxios } from "app/Hooks";
import { EstimateListingProp } from "./Types";
import { InvoiceModal } from "./InvoiceModal";
import { Buttonx, EmptyIcon, PdfViewer, Toast } from "app/shared";
import { endpoints, routeNames } from "static";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";
import {
  setKeyInLS,
  ReturnWidth,
  handletoggle,
  handleActionpref,
  setSessionAndLocalObj,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";
import { TooltipX } from "app/shared/ToolTip";

const todayDate = dayjs(new Date());

export const EstimateListing = ({
  Prev,
  Next,
  status,
  refetch,
  listing,
  setparam,
  showDetail,
  handlePage,
  pagination,
  handleClick,
  handleRowSize,
  handleConfirm,
  handleViewClick,
  sidebarPosition,
  handleFullScreen,
  setcustomLoading,
}: EstimateListingProp) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [check, setCheck] = useState(false);
  const [details, setDetails] = useState<any>();
  const [popOver, setPopOver] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [ColumnOrderRef, setColumnOrderRef] = useState();
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableFiltersForunlockcols, setTableFilters] = useState([]);
  const [tableFilterForLockedCols, setTableFiltersForLockedcols] = useState([]);
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  //@ts-ignore
  const handleRowHover = (index) => {
    // setHoveredRow(index);
  };

  const handleSetCheck = () => {
    setTimeout(() => {
      setCheck(!check);
    }, 2000);
  };
  const handleClearFilter = () => {
    setparam({
      ...pagination,
      page: 1,
      status: "",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
      is_applied: "",
    });
    form.setFieldValue("customer_id", null);
    sessionStorage.removeItem("contactName");
  };
  useEffect(() => {
    if (!listing?.estimates?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.estimates?.data?.length]);
  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      status: pagination.status || listing?.filter_preference?.preferences?.status?.id || "all",
      date_range:
        pagination.date_range || listing?.filter_preference?.preferences?.date_range?.id || null,
      customer_id: contactName
        ? contactName
        : listing?.filter_preference?.preferences?.customer_id?.id
        ? {
            id: listing?.filter_preference?.preferences?.customer_id?.id,
            label: listing?.filter_preference?.preferences?.customer_id?.field_name,
          }
        : null,
      custom_ranges:
        pagination.date_range === "custom"
          ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)] || [
              dayjs(listing?.filter_preference?.preferences?.date_range?.start),
              dayjs(listing?.filter_preference?.preferences?.date_range?.end),
            ]
          : [todayDate, todayDate],
    });
    setPopOver(pop);
  };
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const handleTableFilters = (filter) => setTableFilters(filter);
  const toggleInvoiceModal = () => setInvoiceModal(!invoiceModal);

  //@ts-ignore
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handleClone = (data) => navigate(`${routeNames.ESTIMATES_ClONE}?id=${data?.id}`);

  const handlePdf = (data) => {
    setPdfUrl(`${endpoints.ESTIMATES}/${data?.id}/pdf`);
    togglePdfModal();
  };
  const convertToInvoice = (data) => {
    setDetails(data);
    toggleInvoiceModal();
  };

  const sentMark = useCallback(
    (data) =>
      callAxios({
        url: `${endpoints.ESTIMATES}/${data?.id}${endpoints.ESTIMATE_SENT}`,
        method: "put",
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch();
        }
      }),
    //eslint-disable-next-line
    [refetch]
  );

  const sendEmail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.id, true, endpoints.ESTIMATES);
    handleFullScreen(true);
  };
  //@ts-ignore
  const handleBulkActions = (name: string) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.id);
    data = {
      ids: ids,
    };

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: name === "delete" ? endpoints.ESTIMATES : `${endpoints.ESTIMATES}/${name}`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") handletoggle(handleFullScreen);
    });
  };
  const columns = Columns(
    showDetail,
    listing,
    handleClone,
    handlePdf,
    () => null,
    handleClick,
    handleConfirm,
    convertToInvoice,
    sentMark,
    sendEmail
  );

  const downloadCurrentView = () => {
    const ids = listing?.estimates?.data.map((estimate) => estimate?.id);
    callAxios({
      method: "post",
      url: `${endpoints.ESTIMATES}/exportCurrentView`,
      data: {
        estimates_ids: ids,
      },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `estimates.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Downloaded successfully" });
    });
  };

  const items: MenuProps["items"] = [
    // {
    //   key: "1",
    //   label: "Send",
    //   // onClick: () => handleBulkActions("active"),
    // },
    // {
    //   key: "2",
    //   label: "Print",
    //   // onClick: () => handleBulkActions("inactive"),
    // },
    {
      key: "3",
      label: (
        <Popconfirm
          showCancel
          key="confirm"
          okText={"Yes"}
          cancelText="No"
          placement="right"
          overlayClassName="w-200"
          onCancel={(e) => e?.stopPropagation()}
          getPopupContainer={() => document.body}
          title={`Are you sure you want to delete selected estimate?`}
          onConfirm={(e) => {
            e?.stopPropagation();
            handleBulkActions("delete");
          }}
        >
          <label style={{ display: "block", width: "100%" }} onClick={(e) => e?.stopPropagation()}>
            Delete
          </label>
        </Popconfirm>
      ),
    },
    // {
    //   key: "4",
    //   label: "Change status",
    //   children: ["Accepted", "Expired", "Rejected"].map((status) => ({
    //     key: Math.random().toString(),
    //     label: status,
    //     onClick: () => handleBulkActions("status", status),
    //   })),
    // },
  ];

  const handleBack = () => {
    setparam({
      ...pagination,
      page: 1,
      status: "",
      sort_by: "estimate_date",
      order_by: "asc",
      search: "",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
      is_applied: "",
    });
    sessionStorage.removeItem("contactName");
  };
  return (
    <div className="item_listing">
      {showDetail && (
        <DetailpageHeader
          form={form}
          Prev={Prev}
          Next={Next}
          refetch={refetch}
          popOver={popOver}
          listing={listing}
          setparam={setparam}
          handlePage={handlePage}
          pagination={pagination}
          moduleName={"Estimates"}
          sortPopOver={sortPopOver}
          navigateTo={"/estimates-new"}
          handleRowSize={handleRowSize}
          selectedProducts={selectedProducts}
          handleSortPopOver={handleSortPopOver}
          handleFullScreen={handleFullScreen}
          handleOpenChange={handleOpenChange}
          showDetail={showDetail}
        />
      )}
      {/* {selectedProducts.length > 0 && showDetail && (
        <>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )} */}
      {/* {selectedProducts.length > 0 && !showDetail && (
        <>
          <div className="custom-filter">
            <EstimateTiles pagination={pagination} listing={listing} setparam={setparam} />
          </div>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )} */}
      {!showDetail && (
        <div className="custom-filter">
          <EstimateTiles pagination={pagination} listing={listing} setparam={setparam} />
          {!selectedProducts.length && (
            <div className="filter-bottom">
              <div className="d-flex">
                <FilterPopup
                  form={form}
                  refetch={refetch}
                  popOver={popOver}
                  setparam={setparam}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                  filterPreference={listing?.filter_preference?.preferences}
                />
                {(pagination?.status || pagination?.date_range || pagination?.contactId) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              {listing?.estimates?.data?.length > 0 && (
                <div className="d-flex align-center">
                  <TooltipX title="Download">
                    <div className="filter-toggle mr-10" onClick={downloadCurrentView}>
                      <img
                        className="downLoad hover-effect"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/downloadallattachments.svg`}
                      />
                      {!showDetail && <span className={"color-gray show_column"}>Download</span>}
                    </div>
                  </TooltipX>
                  <TableFilters
                    // url="item"
                    refetch={refetch}
                    table_slug="estimates"
                    moduleName="Estimates"
                    ColumnhideRef={ColumnhideRef}
                    ColumnOrderRef={ColumnOrderRef}
                    handleSetCheck={handleSetCheck}
                    setcolsheader={handleTableFilters}
                    tableSetting={listing.table_setting}
                    colsHeader={tableFiltersForunlockcols}
                    preferences={listing.table_setting?.preferences}
                    columns={columns.filter((val) => val.locked === false)}
                    column_reset_button={listing?.table_setting?.column_reset_button}
                    freeze_table_width={listing.table_setting?.freez_table_width}
                  />
                  <CustomPaginate
                    Prev={Prev}
                    Next={Next}
                    paginate={pagination}
                    handlePage={handlePage}
                    className="pagination_row"
                    handleRowSize={handleRowSize}
                    totalPages={listing.estimates.last_page}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {selectedProducts.length > 0 && (
        <>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )}
      {listing?.estimates?.data?.length > 0 ? (
        <div
          style={{
            animation: showDetail ? "fadeInLeft" : "",
            animationDuration: "0.3s",
          }}
          className="my-custom-table unset-height"
        >
          <div
            id="wrapper"
            className={`generic-popover-width ${!showDetail ? "item_table" : "bg-transparent "}`}
          >
            <div className={"sticky_table"}>
              <FreezTable
                loading={false}
                refetch={refetch}
                setparam={setparam}
                table_slug="estimates"
                showDetail={showDetail}
                pagination={pagination}
                ReturnWidth={ReturnWidth}
                totalCountName="Total Estimates"
                data={listing?.estimates?.data}
                total={listing?.estimates?.total}
                handleViewClick={handleViewClick}
                sidebarPosition={sidebarPosition}
                setcolsheader={handleTableFilters}
                setcustomLoading={setcustomLoading}
                selectedProducts={selectedProducts}
                tableSetting={listing.table_setting}
                colsHeader={tableFiltersForunlockcols}
                setSelectedProducts={setSelectedProducts}
                preferences={listing.table_setting?.preferences}
                colsHeaderForlockedCols={tableFilterForLockedCols}
                columns={columns.filter((val) => val.locked === true)}
                handleTableFilterslockedcols={handleTableFilterslockedcols}
                detailPageColumns={["selection", "estimate_date"]}
                defaultFreezTableWidth={defaultFreezTableWidth(
                  listing.table_setting?.freez_table_width
                )}
                actionPref={handleActionpref(
                  listing.table_setting?.action_preference,
                  columns.filter((val) => val.locked === true)?.length
                )}
              />
            </div>
            {!showDetail && (
              <>
                <div className="no_sticky_table">
                  <ResizeableTable
                    check={check}
                    refetch={refetch}
                    loading={false}
                    setparam={setparam}
                    table_slug="estimates"
                    pagination={pagination}
                    ReturnWidth={ReturnWidth}
                    data={listing.estimates.data}
                    handleSetCheck={handleSetCheck}
                    handleViewClick={handleViewClick}
                    sidebarPosition={sidebarPosition}
                    setcolsheader={handleTableFilters}
                    setcustomLoading={setcustomLoading}
                    setColumnHideRef={setColumnHideRef}
                    selectedProducts={selectedProducts}
                    tableSetting={listing.table_setting}
                    setColumnOrderRef={setColumnOrderRef}
                    colsHeader={tableFiltersForunlockcols}
                    setSelectedProducts={setSelectedProducts}
                    preferences={listing.table_setting?.preferences}
                    colsHeaderForlockedCols={tableFilterForLockedCols}
                    columns={columns?.filter((val) => val.locked === false)}
                    handleTableFilterslockedcols={handleTableFilterslockedcols}
                    defaultUnFreezTableWidth={defaultResizeableTableWidth(
                      listing.table_setting?.freez_table_width
                    )}
                    freeze_table_width={listing.table_setting?.freez_table_width}
                    column_reset_button={listing?.table_setting?.column_reset_button}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {Boolean(status) && (
            <div className="center-align-icon vh-239">
              <EmptyIcon />
              <span>No data found</span>
              <Buttonx type="link" btnText="Go Back" clickHandler={handleBack} />
            </div>
          )}
        </>
      )}

      <div
        className="item_listing_count"
        style={{ display: !showDetail && listing?.estimates?.data?.length > 0 ? "" : "none" }}
      >
        <p>Total Estimates : {listing?.estimates?.total}</p>
      </div>
      {pdfModal && (
        <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
      )}
      <InvoiceModal
        invoiceModal={invoiceModal}
        toggleInvoiceModal={toggleInvoiceModal}
        details={details}
        refetch={refetch}
      />
    </div>
  );
};
