/** @format */

import { useState, Fragment, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Typography, Popover, Dropdown, Popconfirm } from "antd";
import type { MenuProps } from "antd";
import { useAxios } from "app/Hooks";
import { SortContent } from "./SortContent";
import { TooltipX } from "app/shared/ToolTip";
import { endpoints, routeNames } from "static";
import { CustomerListingProps } from "./Types";
import { FilterContent } from "./FilterContent";
import { Columns, alphabets } from "./constants";
import { Toast, Spinner, Breadcrumbx, EmptyIcon, Buttonx } from "app/shared";
import { InfiniteFreezeTable } from "app/shared/InfiniteResizeableTable/FreezeTable";
import { InfiniteUnFreezeTable } from "app/shared/InfiniteResizeableTable/UnFreezeTable";
import InfiniteTableFilters from "app/shared/InfiniteResizeableTable/InfiniteTableFilters";
import {
  setKeyInLS,
  handletoggle,
  setSessionAndLocalObj,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";

const { Title } = Typography;
const { ADD_SUPPLIER, ADD_CUSTOMER } = routeNames;
const { CUSTOMERS } = endpoints;

export const CustomerListing = ({
  next,
  loader,
  status,
  loading,
  refetch,
  listing,
  products,
  setEmail,
  supplier,
  setparam,
  setLoader,
  showDetail,
  pagination,
  handleClick,
  setProducts,
  handleConfirm,
  externalClass,
  setEmailLoading,
  handleViewClick,
  sidebarPosition,
  handleFullScreen,
  setcustomLoading,
}: CustomerListingProps) => {
  const listInnerRef = useRef();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const [check, setCheck] = useState(false);
  const [popOver, setPopOver] = useState(false);
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [delayedString, setDelayedString] = useState("");
  const [ColumnOrderRef, setColumnOrderRef] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableFiltersForunlockcols, setTableFilters] = useState([]);
  const [tableFilterForLockedCols, setTableFiltersForLockedcols] = useState([]);
  //@ts-ignore
  const [hoveredRow, setHoveredRow] = useState(null);
  //@ts-ignore
  const handleRowHover = (index) => {
    // setHoveredRow(index);
  };
  const url = `${supplier ? "supplier" : "customer"}`;
  let totalContacts = listing?.contacts?.total
    ? listing?.contacts?.total
    : listing?.contacts?.data.length;

  const handleSetCheck = () => {
    setTimeout(() => {
      setCheck(!check);
    }, 2000);
  };
  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setDelayedString("active");
      }, 300);
    };

    fetchData();
  }, []);
  const handleTableFilterslockedcols = (filter) => {
    setTableFiltersForLockedcols(filter);
  };
  const handleTableFilters = (filter) => {
    setTableFilters(filter);
  };

  //@ts-ignore
  const ReturnWidth = (name = "") => {
    const filteredData = listing.table_setting?.preferences.find((val) => val.slug === name);
    // const persent = parseFloat(filteredData?.width);
    // const pixel = (persent * window.innerWidth) / 100;
    const width_without_pixel = Boolean(Number(parseFloat(filteredData?.width_px)))
      ? Number(parseFloat(filteredData?.width_px))
      : listing?.table_setting?.freez_table_width === 100
      ? NaN
      : 120;
    return width_without_pixel;
  };

  const CheckLocakedStatus = (name = "") => {
    const filteredData = listing.table_setting?.preferences.find((val) => val.slug === name);
    return filteredData?.locked;
  };

  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      status: pagination.status || listing?.filter_preference?.preferences?.status?.id || "all",
      current_balance:
        pagination.current_balance ||
        listing?.filter_preference?.preferences?.current_balance?.id ||
        "all",
      start_range:
        pagination.start_range ||
        listing?.filter_preference?.preferences?.current_balance?.start_range ||
        null,
      end_range:
        pagination.end_range ||
        listing?.filter_preference?.preferences?.current_balance?.end_range ||
        null,
    });
    setPopOver(pop);
  };
  const handleClearFilter = () => {
    setparam({
      ...pagination,
      page: 1,
      sort: "asc",
      sort_column: "display_name",
      status: "",
      searchByAlphabet: "",
      current_balance: "",
      start_range: "",
      end_range: "",
      is_applied: "",
    });
  };

  useEffect(() => {
    if (!listing?.contacts?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.contacts?.data?.length]);

  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);

  const handleClone = (data) =>
    navigate(`${supplier ? routeNames.SUPPLIER_CLONE : routeNames.CUSTOMER_CLONE}?id=${data?.id}`);

  const handleStatus = (data) => {
    callAxios({
      method: "put",
      url: data?.is_active
        ? `${supplier ? endpoints.SUPPLIERS : endpoints.CUSTOMERS}/${data?.id}/inactive`
        : `${supplier ? endpoints.SUPPLIERS : endpoints.CUSTOMERS}/${data?.id}/active`,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
    });
  };

  const handleBulkActions = (name: string) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.id);
    data = {
      ids: ids,
    };

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: name === "delete" ? CUSTOMERS : `${CUSTOMERS}/${name}`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") {
        handletoggle(handleFullScreen);
      }
    });
  };

  const sendEmail = (data) => {
    setEmail(false);
    setEmailLoading(true);
    setKeyInLS("email", false);
    setTimeout(() => {
      refetchemail(data);
    }, 0);
  };

  const refetchemail = (data) => {
    setKeyInLS("email", true);
    setSessionAndLocalObj(data?.id, true, supplier ? endpoints.SUPPLIERS : endpoints.CUSTOMERS);
    handleFullScreen(true);
    setEmail(true);
    setEmailLoading(false);
  };

  const columns = Columns(
    showDetail,
    handleStatus,
    listing,
    handleClone,
    handleClick,
    handleConfirm,
    supplier,
    ReturnWidth,
    CheckLocakedStatus,
    sendEmail
  );

  const items: MenuProps["items"] = [
    /*{
      key: "1",
      label: "Send",
      disabled: true,
    },
    {
      key: "2",
      label: "Print",
      disabled: true,
    },*/
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
          title={`Are you sure you want to delete selected ${supplier ? "supplier" : "customer"}?`}
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

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (Math.ceil(scrollTop + clientHeight + 50) >= scrollHeight - 2) {
        if (listing.contacts.last_page > listing.contacts.current_page && !loader) {
          setLoader(true);
          next();
        }
      }
    }
  };

  const downloadCurrentView = () => {
    const ids = listing?.contacts?.data.map((contact) => contact?.id);
    callAxios({
      method: "post",
      url: `${
        supplier ? endpoints.SUPPLIERS : endpoints.CUSTOMERS
      }/exportcurrentview?contact_type=${supplier ? "supplier" : "customer"}`,
      data: {
        contact_ids: ids,
      },
    }).then((res) => {
      let csvFile = "data:text/csv;charset=utf-8," + res;
      let encodedUri = encodeURI(csvFile);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${supplier ? "supplier" : "customers"}.csv`);
      document.body.appendChild(link);
      link.click();
      Toast({ message: "Downloaded successfully" });
    });
  };
  const handleBack = () => {
    setparam({
      ...pagination,
      page: 1,
      sort: "asc",
      sort_column: "display_name",
      status: "",
      searchByAlphabet: "",
      current_balance: "",
      start_range: "",
      end_range: "",
      is_applied: "",
    });
  };

  const handleStatusFilter = (status) => {
    if (pagination?.status === status) {
      setDelayedString("");
      setTimeout(() => {
        setparam({ ...pagination, status: "" });
      }, 400);
    } else {
      setDelayedString("");
      setTimeout(() => {
        setparam({ ...pagination, status: status, is_applied: true });
      }, 400);
    }
  };
  const type = supplier ? "Suppliers" : "Customers";
  return (
    <div
      className={
        url == "customer" ? "customer_listing_page generic-popover-width" : "supplier_listing_page"
      }
      style={{
        animation: showDetail ? "fadeInLeft" : "",
        animationDuration: "0.3s",
      }}
    >
      {!showDetail && (
        <>
          <div className="custom-filter">
            <div className="filter-top align-center">
              <div
                className={`filter-badge newgreenish_shade cursor ${
                  pagination.status === "active" ? `${delayedString}` : ""
                }  `}
                onClick={() => handleStatusFilter("active")}
              >
                <Typography.Text className="key">Active</Typography.Text>
                <Typography.Text className="value">
                  {listing?.contacts?.active_count} {type}
                </Typography.Text>
              </div>
              <div
                className={`filter-badge newRedish_Shade cursor ${
                  pagination.status === "inactive" ? `${delayedString}` : ""
                }  `}
                onClick={() => handleStatusFilter("inactive")}
              >
                <Typography.Text className="key">Inactive</Typography.Text>
                <Typography.Text className="value">
                  {listing?.contacts?.in_active_count} {type}
                </Typography.Text>
              </div>
            </div>
            {!selectedProducts.length && (
              <div className="filter-bottom ">
                <div className="d-flex no-line-height ">
                  <Popover
                    title=""
                    open={popOver}
                    trigger="click"
                    placement="bottomLeft"
                    content={
                      <FilterContent
                        form={form}
                        refetch={refetch}
                        supplier={supplier}
                        setparam={setparam}
                        pagination={pagination}
                        setPopOver={setPopOver}
                        filterPreference={listing?.filter_preference?.preferences}
                      />
                    }
                    onOpenChange={handleOpenChange}
                    overlayClassName="adjust-filter-main"
                  >
                    <div className="d-flex">
                      <TooltipX title="Filter">
                        <div className="filter-toggle">
                          <img
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/filters.svg`}
                            alt="filter icon"
                            className={`${"popup-over hover-effect"} ${popOver ? "toggle" : ""}`}
                          />
                          {!showDetail && (
                            <span className={`${popOver ? "color-dark" : "color-gray"}`}>
                              Filters
                            </span>
                          )}
                        </div>
                      </TooltipX>
                      {(pagination?.status ||
                        pagination?.current_balance ||
                        pagination?.start_range ||
                        pagination?.end_range ||
                        pagination?.searchByAlphabet) && (
                        <Button
                          type="link"
                          className="clear_filter_btn"
                          onClick={handleClearFilter}
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                    {/* <RiEqualizerFill className="popup-over another-filter" /> */}
                  </Popover>
                </div>
                {listing?.contacts?.data?.length > 0 && (
                  <div className="d-flex align-center">
                    <TooltipX title="Download">
                      <div className="filter-toggle mr-10" onClick={downloadCurrentView}>
                        <img
                          className={`${"downLoad hover-effect"} ${popOver ? "toggle" : ""}`}
                          src={`${
                            import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                          }/static/media/downloadallattachments.svg`}
                          alt="download icon"
                        />
                        {!showDetail && <span className={"color-gray show_column"}>Download</span>}
                      </div>
                    </TooltipX>
                    <InfiniteTableFilters
                      url={url}
                      refetch={refetch}
                      ColumnhideRef={ColumnhideRef}
                      ColumnOrderRef={ColumnOrderRef}
                      handleSetCheck={handleSetCheck}
                      setcolsheader={handleTableFilters}
                      tableSetting={listing.table_setting}
                      colsHeader={tableFiltersForunlockcols}
                      table_slug={supplier ? "supplier" : "customer"}
                      preferences={listing.table_setting?.preferences}
                      moduleName={supplier ? "Suppliers" : "Customers"}
                      columns={columns.filter((val) => val.locked === false)}
                      freeze_table_width={listing.table_setting?.freez_table_width}
                      column_reset_button={listing?.table_setting?.column_reset_button}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {selectedProducts.length > 0 ? (
        <Fragment>
          <div className={showDetail ? "product_list h-65 gray-color ml-10" : "h-65 gray-color"}>
            <Typography.Title className="selected_product" level={3}>
              {selectedProducts.length}{" "}
              {supplier
                ? selectedProducts.length === 1
                  ? "Supplier selected"
                  : "Suppliers selected"
                : selectedProducts.length === 1
                ? "Customer selected"
                : "Customers selected"}
            </Typography.Title>
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className="batch_btn"
              overlayClassName="generic_dropdown overlay_style"
            >
              <div className="d-flex align-center">
                Batch actions
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
                  alt="arrow icon"
                />
              </div>
            </Dropdown>
          </div>
        </Fragment>
      ) : showDetail ? (
        <div className="product_detail_pagination">
          <div
            className={`breadcrumb_row ${
              url === "customer" ? "customer_detail_breadcrumb" : "supplier_detail_breadcrumb"
            }`}
          >
            <Breadcrumbx
              name=""
              detailPage
              refetch={refetch}
              handleFullScreen={handleFullScreen}
              moduleName={supplier ? "Suppliers" : "Customers"}
            />
            <div className="add_btn_outer">
              <TooltipX title={supplier ? "Add new supplier" : "Add new customer"}>
                <Button
                  icon={
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                      alt="plus icon"
                      className="plus-icon"
                    />
                  }
                  onClick={() => navigate(`${supplier ? ADD_SUPPLIER : ADD_CUSTOMER}`)}
                />
              </TooltipX>
              <TooltipX title="Sort">
                <Popover
                  title={
                    <Title className="text-align" level={5}>
                      Sorting
                    </Title>
                  }
                  trigger="click"
                  open={sortPopOver}
                  placement="bottomRight"
                  onOpenChange={handleSortPopOver}
                  overlayClassName={`adjust-filter-main ${showDetail ? "w-300x" : ""}`}
                  content={
                    <SortContent
                      setparam={setparam}
                      pagination={pagination}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                >
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    className={` sort-icon hover-effect mx-20 ${sortPopOver ? "toggle" : ""}`}
                    alt="sorting Icon"
                  />

                  {/* <HiArrowsUpDown className="sort-icon another-filter" size={18} /> */}
                </Popover>
              </TooltipX>
              <TooltipX title="Filter">
                <Popover
                  title=""
                  open={popOver}
                  trigger="click"
                  content={
                    <FilterContent
                      form={form}
                      refetch={refetch}
                      supplier={supplier}
                      setparam={setparam}
                      pagination={pagination}
                      setPopOver={setPopOver}
                      filterPreference={listing?.filter_preference?.preferences}
                    />
                  }
                  placement="bottomRight"
                  className="filter_listing"
                  onOpenChange={handleOpenChange}
                  overlayClassName={`adjust-filter-main custom-dropdown ${
                    showDetail ? "width_px" : ""
                  }`}
                >
                  {/* <img
                    style={{ marginRight: "20px" }}
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/Filter.svg"
                    alt=""
                    className="popup-over another-filter"
                  /> */}
                  <div className="filter-toggle">
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
                      alt="sorting Icon"
                      className={`popup-over hover-effect ${popOver ? "toggle" : ""}`}
                    />
                    {!showDetail && <span className={"color-gray"}>Filters</span>}
                  </div>
                  {/* <RiEqualizerFill className="popup-over another-filter" /> */}
                </Popover>
              </TooltipX>
            </div>
          </div>
        </div>
      ) : null}

      {listing?.contacts?.data?.length > 0 ? (
        <div
          className={`my-custom-table d-flex unset-height ${
            url === "customer"
              ? "customer_listing_main customer_listing"
              : "supplier_listing_main supplier_listing"
          }`}
          onScroll={onScroll}
          ref={listInnerRef as any}
        >
          <div
            className={`${
              url === "customer"
                ? "customer_scroll_container"
                : "supplier_scroll_container generic-popover-width"
            } ${externalClass}`}
          >
            <div id="wrapper" className={`${loader ? "listing-events" : ""}`}>
              <div className={loader ? "sticky_table spinner" : "sticky_table"}>
                <InfiniteFreezeTable
                  data={products}
                  loader={loader}
                  refetch={refetch}
                  loading={loading}
                  setparam={setparam}
                  total={totalContacts}
                  setLoader={setLoader}
                  showDetail={showDetail}
                  pagination={pagination}
                  hoveredRow={hoveredRow}
                  ReturnWidth={ReturnWidth}
                  onRowHover={handleRowHover}
                  handleViewClick={handleViewClick}
                  sidebarPosition={sidebarPosition}
                  setcolsheader={handleTableFilters}
                  selectedProducts={selectedProducts}
                  setcustomLoading={setcustomLoading}
                  tableSetting={listing?.table_setting}
                  colsHeader={tableFiltersForunlockcols}
                  setSelectedProducts={setSelectedProducts}
                  table_slug={supplier ? "supplier" : "customer"}
                  preferences={listing.table_setting?.preferences}
                  detailPageColumns={["selection", "display_name"]}
                  colsHeaderForlockedCols={tableFilterForLockedCols}
                  columns={columns.filter((val) => val.locked === true)}
                  handleTableFilterslockedcols={handleTableFilterslockedcols}
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
                    <InfiniteUnFreezeTable
                      url={url}
                      check={check}
                      loader={loader}
                      data={products}
                      refetch={refetch}
                      loading={loading}
                      setparam={setparam}
                      setLoader={setLoader}
                      hoveredRow={hoveredRow}
                      pagination={pagination}
                      ReturnWidth={ReturnWidth}
                      onRowHover={handleRowHover}
                      handleSetCheck={handleSetCheck}
                      sidebarPosition={sidebarPosition}
                      handleViewClick={handleViewClick}
                      setcolsheader={handleTableFilters}
                      setcustomLoading={setcustomLoading}
                      selectedProducts={selectedProducts}
                      setColumnHideRef={setColumnHideRef}
                      tableSetting={listing.table_setting}
                      setColumnOrderRef={setColumnOrderRef}
                      colsHeader={tableFiltersForunlockcols}
                      setSelectedProducts={setSelectedProducts}
                      table_slug={supplier ? "supplier" : "customer"}
                      preferences={listing.table_setting?.preferences}
                      colsHeaderForlockedCols={tableFilterForLockedCols}
                      columns={columns.filter((val) => val.locked === false)}
                      freezeTableWidth={listing.table_setting?.freez_table_width}
                      handleTableFilterslockedcols={handleTableFilterslockedcols}
                      column_reset_button={listing?.table_setting?.column_reset_button}
                      fixedCollength={columns.filter((val) => val.locked === true)?.length}
                      defaultUnFreezTableWidth={defaultResizeableTableWidth(
                        listing.table_setting?.freez_table_width
                      )}
                    />
                  </div>
                  <div className="fixed_filter">
                    {loader && <Spinner directionSize={"66vh"} size={"small"} />}
                  </div>
                </>
              )}
              <div className="customer_loader">{loading && !loader && <Spinner />}</div>
            </div>
          </div>

          {listing.contacts.data.length > 0 && (
            <div className="sorting_filter ">
              <span
                className={!pagination.searchByAlphabet ? "custom_disabled" : "custom_activated"}
                onClick={() => {
                  setparam({
                    ...pagination,
                    page: 1,
                    searchByAlphabet: "",
                  });
                  setProducts([]);
                }}
              >
                <TooltipX title="Clear phonebook index">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14.063"
                    height="9.945"
                    viewBox="0 0 14.063 9.945"
                    className="hover-effect"
                  >
                    <g id="sort" transform="translate(0.5 0.5)">
                      <path
                        id="Union_4"
                        data-name="Union 4"
                        d="M0,8.945V7.178H10.158V8.945ZM1.454,5.351V3.591H11.6v1.76ZM2.9,1.769V0H13.063V1.769Z"
                        transform="translate(0 0)"
                        stroke="rgba(0,0,0,0)"
                        strokeMiterlimit="10"
                        strokeWidth="1"
                      />
                    </g>
                  </svg>
                  {/* <BsFilterLeft size={28} /> */}
                </TooltipX>
              </span>
              {alphabets.map((abc, index) => {
                return (
                  <span
                    className={
                      pagination.searchByAlphabet === abc.toLowerCase()
                        ? "custom_disabled"
                        : "custom_activated"
                    }
                    onClick={() => {
                      setparam({
                        ...pagination,
                        page: 1,
                        searchByAlphabet: abc.toLowerCase(),
                      });
                      handletoggle(handleFullScreen);
                      setProducts([]);
                    }}
                    key={index}
                  >
                    {abc}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <>
          {Boolean(status) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "600px",
                flexDirection: "column",
              }}
            >
              <EmptyIcon />
              <span>No data found</span>
              <Buttonx type="link" btnText="Go Back" clickHandler={handleBack} />
            </div>
          )}
        </>
      )}
      {!showDetail && (
        <div
          className="item_listing_count"
          style={{ display: listing.contacts.data.length > 0 ? "" : "none" }}
        >
          <p>
            {supplier ? `Total Suppliers : ${totalContacts}` : `Total Contacts : ${totalContacts}`}
          </p>
        </div>
      )}
    </div>
  );
};
