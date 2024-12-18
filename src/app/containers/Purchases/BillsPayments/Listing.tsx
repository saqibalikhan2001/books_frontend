import { useEffect, useState } from "react";
import { Button, Form, MenuProps, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { endpoints } from "static";
import { Columns } from "./constant";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import { Buttonx, EmptyIcon, PdfViewer, Toast } from "app/shared";
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
import { DetailpageHeader, FilterPopup, SelectedRows } from "./DetailPlusListingHeader";

const todayDate = dayjs(new Date());
const { BILL_PAYMENTS, BILL_PAYMENTS_RECORDS } = endpoints;

export const BillPaymentsListing = ({
  Prev,
  Next,
  refetch,
  listing,
  status,
  setparam,
  handlePage,
  pagination,
  showDetail,
  handleClick,
  handleConfirm,
  handleRowSize,
  sidebarPosition,
  handleViewClick,
  handleFullScreen,
  currentModulestatus,
  setcustomLoading,
}: any) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [check, setCheck] = useState(false);
  const [popOver, setPopOver] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [ColumnOrderRef, setColumnOrderRef] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableFiltersForunlockcols, setTableFilters] = useState([]);
  const [tableFilterForLockedCols, setTableFiltersForLockedcols] = useState([]);
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleSetCheck = () => {
    setTimeout(() => {
      setCheck(!check);
    }, 2000);
  };
  const handleClearFilter = () => {
    setparam({
      ...pagination,
      page: 1,
      type: "",
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
    if (!listing?.billPayments?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.billPayments?.data?.length]);

  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      status: pagination.status || listing?.filter_preference?.preferences?.status?.id || "all",
      date_range:
        pagination.date_range || listing?.filter_preference?.preferences?.date_range?.id || null,
      supplier_id: contactName
        ? contactName
        : listing?.filter_preference?.preferences?.supplier_id?.id
        ? {
            id: listing?.filter_preference?.preferences?.supplier_id?.id,
            label: listing?.filter_preference?.preferences?.supplier_id?.field_name,
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
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilters = (filter) => setTableFilters(filter);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handlePdf = (data) => {
    setPdfUrl(`${BILL_PAYMENTS_RECORDS}/${data?.id}/pdf`);
    togglePdfModal();
  };
  const pdfDownload = (data) => {
    callAxios({
      url: `${BILL_PAYMENTS_RECORDS}/${data?.id}/pdf?download=true`,
    }).then((res) => {
      const element = document.createElement("a");
      element.href = res;
      element.download = `Bill Payment No. ${data?.bill_no}.pdf`;
      element.click();
    });
  };
  const sendEmail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.id, true, BILL_PAYMENTS);
    handleFullScreen(true);
  };
  const handleBulkActions = (name: string) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.id);
    data = {
      ids: ids,
    };

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: `${BILL_PAYMENTS}/bulk_delete`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") handletoggle(handleFullScreen);
    });
  };
  //@ts-ignore
  const downloadCurrentView = () => {
    const ids = listing?.billPayments?.data.map((bill) => bill?.bill_id);
    callAxios({
      method: "post",
      url: `${BILL_PAYMENTS}/exportSelected`,
      data: { ids: ids },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Bill Payments.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Bill payments exported successfully" });
    });
  };

  const columns = Columns(
    showDetail,
    listing,
    handlePdf,
    handleClick,
    handleConfirm,
    pdfDownload,
    sendEmail
  );
  const items: MenuProps["items"] = [
    {
      key: "1",
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
          title={`Are you sure you want to delete selected bill payment?`}
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
  ];
  const handleBack = () => {
    setparam({
      ...pagination,
      page: 1,
      filter: "",
      sort_by: "payment_date",
      order_by: "asc",
      search: "",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
    });
    sessionStorage.removeItem("contactName");
  };
  return (
    <div className="item_listing bill_filter bill_payment_listing">
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
          showDetail={showDetail}
          sortPopOver={sortPopOver}
          moduleName="Bill Payments"
          handleRowSize={handleRowSize}
          selectedProducts={selectedProducts}
          handleFullScreen={handleFullScreen}
          handleOpenChange={handleOpenChange}
          handleSortPopOver={handleSortPopOver}
        />
      )}
      {selectedProducts.length > 0 && showDetail && (
        <SelectedRows showDetail={showDetail} selectedProducts={selectedProducts} items={items} />
      )}
      {selectedProducts.length > 0 && !showDetail && (
        <>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )}
      {!selectedProducts.length && !showDetail && (
        <div className="custom-filter px-20" style={{ marginTop: "12px" }}>
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
              {(pagination?.contactId || pagination?.is_applied) && (
                <Button
                  type="link"
                  onClick={handleClearFilter}
                  className="d-flex align-items-end clear_filter_btn"
                >
                  Clear filters
                </Button>
              )}
            </div>
            {listing?.billPayments?.data?.length > 0 && (
              <div className="d-flex align-center">
                {/* <TooltipX title="Download">
                      <div className="filter-toggle mr-10"> 
                        <img
                          src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/downloadallattachments.svg"
                          onClick={downloadCurrentView}
                          className="downLoad hover-effect"
                            />
                        {!showDetail && <span className={`${popOver ? 'color-dark' : 'color-gray'}`} >Download</span>}
                      </div>
                      </TooltipX > */}
                <TableFilters
                  url="items"
                  refetch={refetch}
                  moduleName="Bill payments"
                  ColumnhideRef={ColumnhideRef}
                  ColumnOrderRef={ColumnOrderRef}
                  handleSetCheck={handleSetCheck}
                  table_slug="bill-payment-received"
                  setcolsheader={handleTableFilters}
                  tableSetting={listing.table_setting}
                  colsHeader={tableFiltersForunlockcols}
                  preferences={listing.table_setting?.preferences}
                  columns={columns.filter((val) => val.locked === false)}
                  freeze_table_width={listing.table_setting?.freez_table_width}
                  column_reset_button={listing?.table_setting?.column_reset_button}
                />
                <CustomPaginate
                  Prev={Prev}
                  Next={Next}
                  paginate={pagination}
                  handlePage={handlePage}
                  className="pagination_row"
                  handleRowSize={handleRowSize}
                  totalPages={listing?.billPayments?.last_page}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {listing?.billPayments?.data?.length > 0 ? (
        <div
          style={{
            animation: showDetail ? "fadeInLeft" : "",
            animationDuration: "0.5s",
          }}
          className="my-custom-table unset-height table_custom_style"
        >
          {listing?.billPayments?.data?.length > 0 ? (
            <div
              id="wrapper"
              className={`generic-popover-width ${!showDetail ? "item_table" : "bg-transparent"}`}
            >
              <div className={"sticky_table"}>
                <FreezTable
                  loading={false}
                  refetch={refetch}
                  setparam={setparam}
                  showDetail={showDetail}
                  pagination={pagination}
                  ReturnWidth={ReturnWidth}
                  table_slug="bill-payment-received"
                  data={listing?.billPayments?.data}
                  totalCountName="Total Bill payments"
                  handleViewClick={handleViewClick}
                  sidebarPosition={sidebarPosition}
                  setcolsheader={handleTableFilters}
                  setcustomLoading={setcustomLoading}
                  selectedProducts={selectedProducts}
                  total={listing?.billPayments?.total}
                  tableSetting={listing.table_setting}
                  colsHeader={tableFiltersForunlockcols}
                  setSelectedProducts={setSelectedProducts}
                  preferences={listing.table_setting?.preferences}
                  colsHeaderForlockedCols={tableFilterForLockedCols}
                  columns={columns.filter((val) => val.locked === true)}
                  handleTableFilterslockedcols={handleTableFilterslockedcols}
                  detailPageColumns={["selection", "payment_date", "action"]}
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
                      paymentReceive
                      check={check}
                      loading={false}
                      refetch={refetch}
                      setparam={setparam}
                      pagination={pagination}
                      ReturnWidth={ReturnWidth}
                      handleSetCheck={handleSetCheck}
                      handleViewClick={handleViewClick}
                      setcolsheader={handleTableFilters}
                      table_slug="bill-payment-received"
                      data={listing?.billPayments?.data}
                      setcustomLoading={setcustomLoading}
                      selectedProducts={selectedProducts}
                      tableSetting={listing?.table_setting}
                      colsHeader={tableFiltersForunlockcols}
                      setSelectedProducts={setSelectedProducts}
                      preferences={listing?.table_setting?.preferences}
                      colsHeaderForlockedCols={tableFilterForLockedCols}
                      columns={columns?.filter((val) => val.locked === false)}
                      handleTableFilterslockedcols={handleTableFilterslockedcols}
                      defaultUnFreezTableWidth={defaultResizeableTableWidth(
                        listing.table_setting?.freez_table_width
                      )}
                      column_reset_button={listing?.table_setting?.column_reset_button}
                      setColumnOrderRef={setColumnOrderRef}
                      setColumnHideRef={setColumnHideRef}
                      freeze_table_width={listing.table_setting?.freez_table_width}
                      sidebarPosition={sidebarPosition}
                    />
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {Boolean(currentModulestatus) && (
                <div className="center-align-icon vh-239">
                  <EmptyIcon />
                  <span>No data found</span>
                  <Buttonx type="link" btnText="Go Back" clickHandler={handleBack} />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {Boolean(status) && (
            <div className="center-align-icon vh-239">
              <EmptyIcon />
              <span>No data found</span>
            </div>
          )}
        </>
      )}
      <div
        className="item_listing_count"
        style={{ display: !showDetail && listing?.billPayments?.data.length ? "" : "none" }}
      >
        <p>Total Bill payments : {listing?.billPayments?.total}</p>
      </div>
      {pdfModal && (
        <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
      )}
    </div>
  );
};
