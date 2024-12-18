/** @format */

import { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Button, Form, Popconfirm } from "antd";
import dayjs from "dayjs";
import { useAxios } from "app/Hooks";
import { endpoints, routeNames } from "static";
import { Buttonx, EmptyIcon, Toast } from "app/shared";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";
import {
  setKeyInLS,
  ReturnWidth,
  handletoggle,
  setSessionAndLocalObj,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";
import {
  FilterPopup,
  SelectedRows,
  DetailpageHeader,
  PaymentReceiveTiles,
} from "./DetailPlusListingHeader";
import { Columns } from "./constant";
import { PaymentReceivedListingProps } from "./Types";

const todayDate = dayjs(new Date());
const { ADVANCE_PAYMENT } = endpoints;
const { ADD_PAYMENTS_RECEIVED } = routeNames;

export const PaymentReceivedListing = ({
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
}: PaymentReceivedListingProps) => {
  const [form] = Form.useForm();
  const { callAxios } = useAxios();
  const [check, setCheck] = useState(false);
  const [popOver, setPopOver] = useState(false);
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [ColumnOrderRef, setColumnOrderRef] = useState();
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
      sort_by: "payment_date",
      order_by: "desc",
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
    if (!listing?.advancePayments?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.advancePayments?.data?.length]);

  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      status: pagination.status || listing?.filter_preference?.preferences?.status?.id || "all",
      customer_id: contactName
        ? contactName
        : listing?.filter_preference?.preferences?.customer_id?.id
        ? {
            id: listing?.filter_preference?.preferences?.customer_id?.id,
            label: listing?.filter_preference?.preferences?.customer_id?.field_name,
          }
        : null,
      date_range:
        pagination.date_range || listing?.filter_preference?.preferences?.date_range?.id || null,
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
  const handleTableFilters = (filter) => setTableFilters(filter);
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const sendEmail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.payment_no, true, ADVANCE_PAYMENT);
    handleFullScreen(true);
  };

  const handleBulkActions = (name: string) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.payment_no);

    data = {
      ids: ids,
    };

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: name === "delete" ? ADVANCE_PAYMENT : `${ADVANCE_PAYMENT}/${name}`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") handletoggle(handleFullScreen);
    });
  };
  const columns = Columns(showDetail, listing, handleClick, handleConfirm, sendEmail);

  const items: MenuProps["items"] = [
    {
      key: "3",
      label: (
        <Popconfirm
          showCancel
          key="confirm"
          okText={"Yes"}
          cancelText="No"
          placement="right"
          overlayClassName={"w-200"}
          onCancel={(e) => e?.stopPropagation()}
          getPopupContainer={() => document.body}
          title={`Are you sure you want to delete selected payment receipt?`}
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
      status: "",
      sort_by: "payment_date",
      order_by: "desc",
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
          showDetail={showDetail}
          handlePage={handlePage}
          pagination={pagination}
          sortPopOver={sortPopOver}
          handleRowSize={handleRowSize}
          moduleName={"payment receipts"}
          navigateTo={ADD_PAYMENTS_RECEIVED}
          selectedProducts={selectedProducts}
          handleFullScreen={handleFullScreen}
          handleOpenChange={handleOpenChange}
          handleSortPopOver={handleSortPopOver}
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
            <PaymentReceiveTiles pagination={pagination} listing={listing} setparam={setparam} />
          </div>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )} */}
      {!showDetail && (
        <div className="custom-filter generic_filter">
          <PaymentReceiveTiles pagination={pagination} listing={listing} setparam={setparam} />
          {!selectedProducts.length && (
            <div className="filter-bottom">
              <div className="d-flex">
                <FilterPopup
                  form={form}
                  popOver={popOver}
                  refetch={refetch}
                  setparam={setparam}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                  showDetail={showDetail}
                  filterPreference={listing?.filter_preference?.preferences}
                />
                {(pagination?.contactId ||
                  pagination?.date_range ||
                  pagination?.filter ||
                  pagination?.status) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              {listing?.advancePayments?.data.length > 0 && (
                <div className="d-flex align-center">
                  {/* <TooltipX title="Export payment receipts in current view">
                <TfiDownload
                  size={18}
                  className="downLoad"
                  // onClick={downloadCurrentView}
                />
              </TooltipX > */}
                  <TableFilters
                    url="item"
                    refetch={refetch}
                    moduleName="Payment receipts"
                    table_slug="payment-received"
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
                    totalPages={listing?.advancePayments?.last_page}
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
      {listing?.advancePayments?.data.length > 0 ? (
        <div
          style={{
            animation: showDetail ? "fadeInLeft" : "",
            animationDuration: "0.3s",
          }}
          className="my-custom-table"
        >
          <div
            id="wrapper"
            className={`generic-popover-width ${!showDetail ? "item_table" : "bg-transparent "} 
        ${showDetail ? "payment-table" : ""}`}
          >
            <div className={"sticky_table"}>
              <FreezTable
                paymentReceive
                loading={false}
                refetch={refetch}
                setparam={setparam}
                showDetail={showDetail}
                pagination={pagination}
                ReturnWidth={ReturnWidth}
                table_slug="payment-received"
                handleViewClick={handleViewClick}
                sidebarPosition={sidebarPosition}
                setcolsheader={handleTableFilters}
                selectedProducts={selectedProducts}
                setcustomLoading={setcustomLoading}
                tableSetting={listing.table_setting}
                data={listing?.advancePayments?.data}
                colsHeader={tableFiltersForunlockcols}
                totalCountName="Total Payment receipts"
                total={listing?.advancePayments?.total}
                setSelectedProducts={setSelectedProducts}
                preferences={listing?.table_setting?.preferences}
                colsHeaderForlockedCols={tableFilterForLockedCols}
                columns={columns.filter((val) => val.locked === true)}
                handleTableFilterslockedcols={handleTableFilterslockedcols}
                detailPageColumns={["selection", "payment_date"]}
                defaultFreezTableWidth={defaultFreezTableWidth(
                  listing.table_setting?.freez_table_width
                )}
                // actionPref={handleActionpref(
                //   listing.table_setting?.action_preference,
                //   columns.filter((val) => val.locked === true)?.length
                // )}
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
                    table_slug="payment-received"
                    handleSetCheck={handleSetCheck}
                    handleViewClick={handleViewClick}
                    sidebarPosition={sidebarPosition}
                    setcolsheader={handleTableFilters}
                    setcustomLoading={setcustomLoading}
                    setColumnHideRef={setColumnHideRef}
                    selectedProducts={selectedProducts}
                    tableSetting={listing.table_setting}
                    data={listing?.advancePayments?.data}
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
        className="item_listing_count "
        style={{ display: !showDetail && listing?.advancePayments?.data.length ? "" : "none" }}
      >
        <p>Total Payments receipts: {listing?.advancePayments?.total}</p>
      </div>
      {/* {isModalOpen && (
        <PdfViewer isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} pdf={pdf} />
      )} */}
    </div>
  );
};
