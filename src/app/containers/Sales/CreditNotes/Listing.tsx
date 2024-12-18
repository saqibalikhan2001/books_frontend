/** @format */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
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
  CreditNoteTiles,
  DetailpageHeader,
} from "./DetailPlusListingHeader";
import { Columns } from "./constant";
import { useAxios } from "app/Hooks";
import { endpoints, routeNames } from "static";
import { TooltipX } from "app/shared/ToolTip";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import { Buttonx, EmptyIcon, PdfViewer, Toast } from "app/shared";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";

const todayDate = dayjs(new Date());

export const CreditNoteListing = ({
  Prev,
  Next,
  refetch,
  listing,
  status,
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
}: any) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
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
      sort_by: "credit_note_date",
      order_by: "desc",
      date_range: "",
      start_range: "",
      end_range: "",
      contactId: "",
      is_applied: "",
      dashboard: "",
    });
    form.setFieldValue("customer_id", null);
    sessionStorage.removeItem("contactName");
  };

  useEffect(() => {
    if (!listing?.credit_notes?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.credit_notes?.data?.length]);

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
  const togglePdfModal = () => setPdfModal(!pdfModal);
  const handleTableFilters = (filter) => setTableFilters(filter);
  //@ts-ignore
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handleClone = (data) => navigate(`${routeNames.INVOICE_ClONE}?id=${data?.id}`);

  const handlePdf = (data) => {
    setPdfUrl(`${endpoints.CREDIT_NOTES}/${data?.id}/pdf`);
    togglePdfModal();
  };
  const convertToInvoice = useCallback(
    (data) =>
      callAxios({
        url: `${endpoints.CREDIT_NOTES}/${data?.id}${endpoints.CREDIT_NOTES}`,
        method: "post",
        data: data,
      }).then((res) => {
        if (res) {
          Toast({ message: res.message });
          refetch();
        }
      }),
    //eslint-disable-next-line
    [refetch]
  );

  const markOpen = useCallback(
    (data) => {
      callAxios({
        method: "put",
        url: `${endpoints.CREDIT_NOTES}/${data?.id}/confirmed`,
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

  const downloadCurrentView = () => {
    const ids = listing?.credit_notes?.data.map((invoice) => invoice?.id);
    callAxios({
      method: "post",
      url: `${endpoints.CREDIT_NOTES}/exportSelected`,
      data: {
        ids: ids,
      },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `credit notes.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Downloaded successfully" });
    });
  };

  const sendEmail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.id, true, endpoints.CREDIT_NOTES);
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
      url: name === "delete" ? endpoints.CREDIT_NOTES : `${endpoints.CREDIT_NOTES}/${name}`,
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
    markOpen,
    sendEmail
  );

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
          overlayClassName="w-200"
          onCancel={(e) => e?.stopPropagation()}
          getPopupContainer={() => document.body}
          title={`Are you sure you want to delete selected creditNote?`}
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
          moduleName={"Credit notes"}
          handleRowSize={handleRowSize}
          selectedProducts={selectedProducts}
          handleFullScreen={handleFullScreen}
          handleOpenChange={handleOpenChange}
          handleSortPopOver={handleSortPopOver}
          navigateTo={routeNames.ADD_CREDIT_NOTE}
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
            <CreditNoteTiles pagination={pagination} listing={listing} setparam={setparam} />
          </div>
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        </>
      )} */}
      {!showDetail && (
        <div className="custom-filter">
          <CreditNoteTiles pagination={pagination} listing={listing} setparam={setparam} />
          {!selectedProducts.length && (
            <div className="filter-bottom">
              <div className="d-flex">
                <FilterPopup
                  form={form}
                  popOver={popOver}
                  setparam={setparam}
                  pagination={pagination}
                  handleOpenChange={handleOpenChange}
                  filterPreference={listing?.filter_preference?.preferences}
                />
                {(pagination?.contactId || pagination?.date_range || pagination?.status) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              {listing?.credit_notes?.data.length > 0 && (
                <div className="d-flex align-center">
                  <TooltipX title="Download">
                    <div className="filter-toggle mr-10" onClick={downloadCurrentView}>
                      <img
                        alt="download icon"
                        className="hover-effect"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/downloadallattachments.svg`}
                      />
                      {!showDetail && <span className={"color-gray show_column"}>Download</span>}
                    </div>
                  </TooltipX>
                  <TableFilters
                    url="item"
                    refetch={refetch}
                    table_slug="credit-notes"
                    moduleName="Credit notes"
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
                    totalPages={listing.credit_notes.last_page}
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
      {listing?.credit_notes?.data.length > 0 ? (
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
                showDetail={showDetail}
                pagination={pagination}
                table_slug="credit-notes"
                ReturnWidth={ReturnWidth}
                handleViewClick={handleViewClick}
                sidebarPosition={sidebarPosition}
                data={listing?.credit_notes?.data}
                totalCountName="Total Credit notes"
                setcolsheader={handleTableFilters}
                setcustomLoading={setcustomLoading}
                selectedProducts={selectedProducts}
                total={listing?.credit_notes?.total}
                tableSetting={listing.table_setting}
                colsHeader={tableFiltersForunlockcols}
                setSelectedProducts={setSelectedProducts}
                preferences={listing.table_setting?.preferences}
                colsHeaderForlockedCols={tableFilterForLockedCols}
                columns={columns.filter((val) => val.locked === true)}
                handleTableFilterslockedcols={handleTableFilterslockedcols}
                detailPageColumns={["selection", "credit_note_date"]}
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
                    check={check}
                    loading={false}
                    refetch={refetch}
                    setparam={setparam}
                    pagination={pagination}
                    table_slug="credit-notes"
                    ReturnWidth={ReturnWidth}
                    handleSetCheck={handleSetCheck}
                    handleViewClick={handleViewClick}
                    sidebarPosition={sidebarPosition}
                    data={listing?.credit_notes?.data}
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
              <Buttonx type="link" btnText="Go Back" clickHandler={handleClearFilter} />
            </div>
          )}
        </>
      )}

      <div
        className="item_listing_count"
        style={{ display: !showDetail && listing?.credit_notes?.data.length ? "" : "none" }}
      >
        <p>Total Credit notes : {listing?.credit_notes?.total}</p>
      </div>
      {pdfModal && (
        <PdfViewer pdfModal={pdfModal} togglePdfModal={togglePdfModal} pdfUrl={pdfUrl} />
      )}
    </div>
  );
};
