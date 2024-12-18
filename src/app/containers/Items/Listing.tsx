/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "antd";
import type { MenuProps } from "antd";
import { routeNames } from "static";
import { useAxios } from "app/Hooks";
import { Columns, itemActions } from "./constant";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import { Buttonx, EmptyIcon, Toast } from "app/shared";
import { useGetAllCategoriesQuery } from "store/query/categories";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";
import {
  ReturnWidth,
  handletoggle,
  handleStockColors,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";
import { DetailpageHeader, FilterPopup, SelectedRows, Tiles } from "./DetailPlusListingHeader";

export const ItemListing = ({
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
  base_currency,
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
  const [ColumnhideRef, setColumnHideRef] = useState();
  const [sortPopOver, setSortPopOver] = useState(false);
  const [ColumnOrderRef, setColumnOrderRef] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [tableFiltersForunlockcols, setTableFilters] = useState([]);
  const [tableFilterForLockedCols, setTableFiltersForLockedcols] = useState([]);
  const { data: categories = [] } = useGetAllCategoriesQuery("", {
    refetchOnMountOrArgChange: true,
  });

  const handleSetCheck = () => {
    setTimeout(() => {
      setCheck(!check);
    }, 2000);
  };
  const handleClearFilter = () => {
    setparam({
      ...pagination,
      page: 1,
      stock_status: "",
      category_id: "",
      type: "",
      status: "",
      is_applied: "",
    });
  };

  useEffect(() => {
    if (!listing?.items?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.items?.data?.length]);

  const handleOpenChange = (pop: boolean) => {
    form.setFieldsValue({
      type: pagination.type || listing?.filter_preference?.preferences.type.id || "all",
      stock_status:
        pagination?.stock_status ||
        listing?.filter_preference?.preferences.stock_status.id ||
        "all",
      status: pagination.status || listing?.filter_preference?.preferences.status.id || "all",
      category_id:
        pagination.category_id === 0
          ? 0
          : pagination.category_id ||
            listing?.filter_preference?.preferences.category_id.id ||
            "all",
    });
    setPopOver(pop);
  };
  const handleTableFilters = (filter) => setTableFilters(filter);
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handleClone = (data) => navigate(`${routeNames.ITEM_CLONE}?id=${data?.id}`);
  const handleStatus = (data) => {
    callAxios({
      method: "put",
      url: data?.is_active ? `/items/${data?.id}/inactive` : `/items/${data?.id}/active`,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
    });
  };
  const handleBulkActions = (name: string, category_id?: number) => {
    let data = {};
    const ids = selectedProducts.map((product: any) => product?.original?.id);
    if (name === "category_assign") {
      data = {
        category_id: category_id,
        ids: ids,
      };
    } else {
      data = {
        ids: ids,
      };
    }

    callAxios({
      method: name === "delete" ? "delete" : "put",
      url: name === "delete" ? "/items" : `/items/${name}`,
      data,
    }).then((res) => {
      Toast({ message: res?.message });
      refetch();
      if (name === "delete") handletoggle(handleFullScreen);
    });
  };

  const columns = Columns(
    showDetail,
    handleStockColors,
    listing,
    handleClone,
    handleStatus,
    handleClick,
    handleConfirm,
    base_currency
  );
  const items: MenuProps["items"] = itemActions(handleBulkActions, categories);
  return (
    <>
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
            moduleName={"Products"}
            handlePage={handlePage}
            pagination={pagination}
            categories={categories}
            sortPopOver={sortPopOver}
            navigateTo={"/items-new"}
            handleRowSize={handleRowSize}
            selectedProducts={selectedProducts}
            handleSortPopOver={handleSortPopOver}
            handleFullScreen={handleFullScreen}
            handleOpenChange={handleOpenChange}
          />
        )}

        {!showDetail && (
          <div className="custom-filter pr-15 generic_filter">
            <Tiles listing={listing} setparam={setparam} pagination={pagination} />
            {!selectedProducts.length && (
              <div className="filter-bottom">
                <div className="d-flex">
                  <FilterPopup
                    form={form}
                    popOver={popOver}
                    refetch={refetch}
                    setparam={setparam}
                    pagination={pagination}
                    categories={categories}
                    handleOpenChange={handleOpenChange}
                    filterPreference={listing?.filter_preference}
                  />
                  {(pagination?.filter ||
                    pagination?.status ||
                    pagination?.category_id ||
                    pagination?.stock_status ||
                    pagination?.type) && (
                    <Button
                      type="link"
                      className="d-flex align-items-end clear_filter_btn"
                      onClick={handleClearFilter}
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
                {listing.items.data.length > 0 && (
                  <div className="d-flex align-center">
                    <TableFilters
                      showDetail={showDetail}
                      url="item"
                      table_slug="item"
                      refetch={refetch}
                      ColumnhideRef={ColumnhideRef}
                      ColumnOrderRef={ColumnOrderRef}
                      handleSetCheck={handleSetCheck}
                      moduleName="Products & Services"
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
                      totalPages={listing.items.last_page}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {selectedProducts.length > 0 && (
          <SelectedRows items={items} showDetail={showDetail} selectedProducts={selectedProducts} />
        )}
        {listing.items.data.length > 0 ? (
          <div
            style={{
              animation: showDetail ? "fadeInLeft" : "",
              animationDuration: "0.3s",
            }}
            className="my-custom-table unset-height"
          >
            <div
              id="wrapper"
              className={` product-tbl-main generic-popover-width ${!showDetail ? "item_table" : "bg-transparent"}`}
            >
              <div className={"sticky_table"}>
                <FreezTable
                  table_slug="item"
                  loading={false}
                  refetch={refetch}
                  setparam={setparam}
                  showDetail={showDetail}
                  pagination={pagination}
                  ReturnWidth={ReturnWidth}
                  data={listing.items.data}
                  total={listing?.items?.total}
                  totalCountName="Total Products"
                  sidebarPosition={sidebarPosition}
                  handleViewClick={handleViewClick}
                  setcolsheader={handleTableFilters}
                  setcustomLoading={setcustomLoading}
                  selectedProducts={selectedProducts}
                  tableSetting={listing.table_setting}
                  colsHeader={tableFiltersForunlockcols}
                  setSelectedProducts={setSelectedProducts}
                  detailPageColumns={["selection", "name"]}
                  preferences={listing.table_setting?.preferences}
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
                    <ResizeableTable
                      url="item"
                      check={check}
                      loading={false}
                      table_slug="item"
                      refetch={refetch}
                      setparam={setparam}
                      pagination={pagination}
                      ReturnWidth={ReturnWidth}
                      data={listing.items.data}
                      handleSetCheck={handleSetCheck}
                      handleViewClick={handleViewClick}
                      sidebarPosition={sidebarPosition}
                      setcolsheader={handleTableFilters}
                      setColumnHideRef={setColumnHideRef}
                      setcustomLoading={setcustomLoading}
                      selectedProducts={selectedProducts}
                      tableSetting={listing.table_setting}
                      setColumnOrderRef={setColumnOrderRef}
                      colsHeader={tableFiltersForunlockcols}
                      setSelectedProducts={setSelectedProducts}
                      preferences={listing.table_setting?.preferences}
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
                <Buttonx type="link" btnText="Go Back" clickHandler={handleClearFilter} />
              </div>
            )}
          </>
        )}

        <div
          className="item_listing_count"
          style={{ display: !showDetail && listing.items.data.length > 0 ? "" : "none" }}
        >
          <p className={`${showDetail ? "mb-15" : ""}`}>Total Products : {listing?.items?.total}</p>
        </div>
      </div>
    </>
  );
};
