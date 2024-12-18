//@ts-nocheck
/** @format */

import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, MenuProps, Form, Popconfirm } from "antd";
import dayjs from "dayjs";
import { Columns } from "./constant";
import { TooltipX } from "app/shared/ToolTip";
import { endpoints, routeNames } from "static";
import { useAxios, usePermissions } from "app/Hooks";
import { CreatePayment } from "./BillPayments/Create";
import {
  setKeyInLS,
  ReturnWidth,
  handletoggle,
  handleStockColors,
  setSessionAndLocalObj,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";
import { Buttonx, EmptyIcon, PdfViewer, Spinner, Toast } from "app/shared";
import { Tiles, FilterPopup, SelectedRows, DetailpageHeader } from "./DetailPlusListingHeader";

const { ADD_BILLS } = routeNames;
const todayDate = dayjs(new Date());
const { BILLS, PAYMENT_RECORDS } = endpoints;

export const BillListing = ({
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
  base_currency,
  handleConfirm,
  handleRowSize,
  sidebarPosition,
  handleViewClick,
  handleFullScreen,
  setcustomLoading,
}: any) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [check, setCheck] = useState(false);
  const [billId, setbillId] = useState<any>();
  const { checkPermission } = usePermissions();
  const [popOver, setPopOver] = useState(false);
  const [pdfModal, setPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [billModal, setbillModal] = useState(false);
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [ColumnOrderRef, setColumnOrderRef] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableFiltersForunlockcols, setTableFilters] = useState([]);
  const [tableFilterForLockedCols, setTableFiltersForLockedcols] = useState([]);
  const { has_PaymentRecordCreate_permission } = checkPermission("PaymentRecordCreate");
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
    if (!listing?.bills?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.bills?.data?.length]);

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
        pagination?.date_range === "custom"
          ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)] || [
              dayjs(listing?.filter_preference?.preferences?.date_range?.start),
              dayjs(listing?.filter_preference?.preferences?.date_range?.end),
            ]
          : [todayDate, todayDate],
    });
    setPopOver(pop);
  };
  const handleBillModal = (data) => {
    setbillId(data?.id);
    toggleBillModal();
  };
  const toggleBillModal = () => setbillModal(!billModal);

  const togglePdfModal = () => setPdfModal(!pdfModal);
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilters = (filter) => setTableFilters(filter);
  const handleClone = (data) => navigate(`${routeNames.CLONE_BILLS}?id=${data?.id}`);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handlePdf = (data) => {
    setPdfUrl(`${endpoints.BILLS}/${data?.id}/pdf`);
    togglePdfModal();
  };

  const markOpen = useCallback(
    (data) => {
      callAxios({
        method: "put",
        url: `${endpoints.BILLS}/${data?.id}/markasopen`,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch();
        }
      });
    },
    //eslint-disable-next-line
    [refetch]
  );
  // const handleClone = (data) => navigate(`${routeNames.ITEM_CLONE}?id=${data?.id}`);
  // const handleStatus = (data) => {
  //   callAxios({
  //     method: "put",
  //     url: data?.is_active ? `/items/${data?.id}/inactive` : `/items/${data?.id}/active`,
  //   }).then((res) => {
  //     Toast({ message: res?.message });
  //     refetch();
  //   });
  // };
  const handleBulkActions = (name: string) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.id);
    data = {
      ids: ids,
    };

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: name === "delete" ? BILLS : `${BILLS}/${name}`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") handletoggle(handleFullScreen);
    });
  };
  const downloadCurrentView = () => {
    const ids = listing?.bills?.data.map((bill) => bill?.id);
    callAxios({
      method: "post",
      url: `${endpoints.BILLS}/exportSelected`,
      data: { ids: ids },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `bills.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Downloaded successfully" });
    });
  };

  const sendEmail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.id, true, endpoints.BILLS);
    handleFullScreen(true);
  };

  const columns = Columns(
    showDetail,
    handleStockColors,
    handleClone,
    listing,
    handlePdf,
    sendEmail,
    handleBillModal,
    // handleClone,
    // handleStatus,
    handleClick,
    markOpen,
    handleConfirm,
    base_currency
  );

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
          title={`Are you sure you want to delete selected bill?`}
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
      sort_by: "bill_date",
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
    <>
      <div className="item_listing bill_filter">
        {showDetail && (
          <DetailpageHeader
            form={form}
            Prev={Prev}
            Next={Next}
            refetch={refetch}
            popOver={popOver}
            listing={listing}
            moduleName="Bills"
            setparam={setparam}
            navigateTo={ADD_BILLS}
            handlePage={handlePage}
            showDetail={showDetail}
            pagination={pagination}
            sortPopOver={sortPopOver}
            handleRowSize={handleRowSize}
            selectedProducts={selectedProducts}
            handleFullScreen={handleFullScreen}
            handleOpenChange={handleOpenChange}
            handleSortPopOver={handleSortPopOver}
          />
        )}
        {/* {selectedProducts.length > 0 && !showDetail && (
          <>
            <div className="custom-filter">
              <Tiles pagination={pagination} listing={listing} setparam={setparam} />
            </div>
            <SelectedRows
              items={items}
              showDetail={showDetail}
              selectedProducts={selectedProducts}
            />
          </>
        )} */}
        {!showDetail && (
          <div className="custom-filter pr-15">
            <Tiles listing={listing} setparam={setparam} pagination={pagination} />
            {!selectedProducts.length && (
              <div className="filter-bottom  ">
                <div className="d-flex">
                  <FilterPopup
                    form={form}
                    refetch={refetch}
                    popOver={popOver}
                    setparam={setparam}
                    showDetail={showDetail}
                    pagination={pagination}
                    handleOpenChange={handleOpenChange}
                    filterPreference={listing?.filter_preference?.preferences}
                  />
                  {(pagination?.status || pagination?.category_id || pagination?.type) && (
                    <Button
                      type="link"
                      className="d-flex align-items-end clear_filter_btn"
                      onClick={handleClearFilter}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
                {listing?.bills?.data.length > 0 && (
                  <div className="d-flex align-center">
                    <TooltipX title="Download">
                      <div className="filter-toggle mr-10" onClick={downloadCurrentView}>
                        <img
                          className="downLoad hover-effect"
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/downloadallattachments.svg`}
                        />
                        {!showDetail && (
                          <span className={`${popOver ? "color-dark" : "color-gray"} show_column`}>
                            Download
                          </span>
                        )}
                      </div>
                    </TooltipX>
                    <TableFilters
                      url="items"
                      refetch={refetch}
                      table_slug="bills"
                      moduleName="Bills"
                      ColumnhideRef={ColumnhideRef}
                      ColumnOrderRef={ColumnOrderRef}
                      handleSetCheck={handleSetCheck}
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
                      totalPages={listing?.bills?.last_page}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {selectedProducts.length > 0 && (
          <SelectedRows showDetail={showDetail} selectedProducts={selectedProducts} items={items} />
        )}
        {listing?.bills?.data?.length > 0 ? (
          <div
            style={{
              animation: showDetail ? "fadeInLeft" : "",
              animationDuration: "0.5s",
            }}
            className="my-custom-table unset-height"
          >
            {/* {listing.bills.data.length > 0 ? ( */}
            <div
              id="wrapper"
              className={`generic-popover-width ${!showDetail ? "item_table" : "bg-transparent "}`}
            >
              <div className={"sticky_table"}>
                <FreezTable
                  loading={false}
                  refetch={refetch}
                  setparam={setparam}
                  table_slug="bills"
                  showDetail={showDetail}
                  pagination={pagination}
                  ReturnWidth={ReturnWidth}
                  data={listing?.bills?.data}
                  totalCountName="Total Bills"
                  total={listing?.bills?.total}
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
                  detailPageColumns={["selection", "bill_date"]}
                  defaultFreezTableWidth={defaultFreezTableWidth(
                    listing.table_setting?.freez_table_width
                  )}
                />
              </div>
              {!showDetail && (
                <>
                  <div className="no_sticky_table">
                    <ResizeableTable
                      check={check}
                      loading={false}
                      refetch={refetch}
                      table_slug="bills"
                      setparam={setparam}
                      pagination={pagination}
                      ReturnWidth={ReturnWidth}
                      data={listing?.bills?.data}
                      handleSetCheck={handleSetCheck}
                      handleViewClick={handleViewClick}
                      sidebarPosition={sidebarPosition}
                      setcolsheader={handleTableFilters}
                      setcustomLoading={setcustomLoading}
                      selectedProducts={selectedProducts}
                      setColumnHideRef={setColumnHideRef}
                      tableSetting={listing?.table_setting}
                      setColumnOrderRef={setColumnOrderRef}
                      colsHeader={tableFiltersForunlockcols}
                      setSelectedProducts={setSelectedProducts}
                      preferences={listing?.table_setting?.preferences}
                      colsHeaderForlockedCols={tableFilterForLockedCols}
                      columns={columns?.filter((val) => val.locked === false)}
                      handleTableFilterslockedcols={handleTableFilterslockedcols}
                      freeze_table_width={listing.table_setting?.freez_table_width}
                      column_reset_button={listing?.table_setting?.column_reset_button}
                      defaultUnFreezTableWidth={defaultResizeableTableWidth(
                        listing.table_setting?.freez_table_width
                      )}
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
          style={{ display: !showDetail && listing.bills.data.length ? "" : "none" }}
        >
          <p>Total Bills : {listing?.bills?.total}</p>
        </div>
        {pdfModal && (
          <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
        )}
      </div>
      {billModal && (
        <CreatePayment
          bill_id={billId}
          showModal={billModal}
          refetchBills={refetch}
          toggleModal={toggleBillModal}
          has_permission={has_PaymentRecordCreate_permission}
          url={`${BILLS}/${billId}${PAYMENT_RECORDS}/create`}
        />
      )}
    </>
  );
};
