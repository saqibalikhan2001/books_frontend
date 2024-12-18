/** @format */

import { useEffect, useState } from "react";
import { Button, Form, MenuProps } from "antd";
import { useAxios } from "app/Hooks";
import { Columns, itemActions } from "./constant";
import { Buttonx, EmptyIcon, Toast } from "app/shared";
import { CustomPaginate } from "app/shared/CustomPaginate";
import FreezTable from "app/shared/ResizeableTable/FreezTable";
import TableFilters from "app/shared/ResizeableTable/TableFilters";
import ResizeableTable from "app/shared/ResizeableTable/ResizealeTable";
import { DetailpageHeader, FilterPopup, SelectedRows } from "./DetailPlusListingHeader";
import {
  ReturnWidth,
  handletoggle,
  defaultFreezTableWidth,
  defaultResizeableTableWidth,
} from "utils";

export const AccountsListing = ({
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
  sidebarPosition,
  handleFullScreen,
  setcustomLoading,
}: any) => {
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

  const handleSetCheck = () => {
    setTimeout(() => {
      setCheck(!check);
    }, 2000);
  };

  const handleClearFilter = () => {
    setparam({
      ...pagination,
      page: 1,
      added_by: "",
      account_type_id: "",
      account_subtype_id: "",
      account_category_id: "",
      is_applied: "",
    });
  };

  useEffect(() => {
    if (!listing?.accounts?.data?.length) {
      handletoggle(handleFullScreen);
    }
  }, [listing?.accounts?.data?.length]);
  const handleOpenChange = (pop: boolean) => {
    const accountTypeId = listing?.filter_preference?.preferences?.account_type_id;
    const accountSubTypeId = listing?.filter_preference?.preferences?.account_subtype_id;
    form.setFieldsValue({
      account_category_id:
        pagination.account_category_id ||
        listing?.filter_preference?.preferences.account_category_id?.id ||
        null,
      account_subtype_id:
        accountSubTypeId?.id !== ""
          ? {
              id: accountSubTypeId?.id,
              label: accountSubTypeId?.field_name,
            }
          : pagination?.account_subtype_id || undefined,
      account_type_id: accountTypeId?.id
        ? {
            id: accountTypeId?.id,
            label: accountTypeId?.field_name,
          }
        : pagination?.account_type_id || undefined,
      added_by:
        pagination?.added_by || listing?.filter_preference?.preferences.added_by?.id || "all",
    });
    setPopOver(pop);
  };
  const handleTableFilters = (filter) => setTableFilters(filter);
  const handleSortPopOver = (popover: boolean) => setSortPopOver(popover);
  const handleTableFilterslockedcols = (filter) => setTableFiltersForLockedcols(filter);

  const handleStatus = (data) => {
    callAxios({
      method: "put",
      url: data?.is_active ? `/accounts/${data?.id}/inactive` : `/accounts/${data?.id}/active`,
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
      url: name === "delete" ? "/accounts" : `/accounts/${name}`,
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
    handleStatus,
    handleClick,
    handleConfirm,
    base_currency
  );
  const handleBack = () => {
    setparam({
      ...pagination,
      page: 1,
      added_by: "",
      is_applied: "",
      account_type_id: "",
      account_subtype_id: "",
      account_category_id: "",
    });
  };
  const items: MenuProps["items"] = itemActions(handleBulkActions);
  return (
    <div className="item_listing">
      {showDetail && (
        <DetailpageHeader
          form={form}
          Prev={Prev}
          Next={Next}
          navigateTo=""
          refetch={refetch}
          popOver={popOver}
          listing={listing}
          setparam={setparam}
          moduleName="accounts"
          showDetail={showDetail}
          handlePage={handlePage}
          pagination={pagination}
          sortPopOver={sortPopOver}
          handleRowSize={handleRowSize}
          selectedProducts={selectedProducts}
          handleFullScreen={handleFullScreen}
          handleOpenChange={handleOpenChange}
          handleSortPopOver={handleSortPopOver}
        />
      )}

      {!showDetail && (
        <div className="custom-filter pr-15 pt-0">
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
                  filterPreference={listing?.filter_preference}
                />
                {(pagination?.added_by ||
                  pagination?.is_applied ||
                  pagination?.account_type_id ||
                  pagination?.account_category_id ||
                  pagination?.account_subtype_id) && (
                  <Button
                    type="link"
                    className="d-flex align-items-end clear_filter_btn"
                    onClick={handleClearFilter}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
              {listing?.accounts?.data?.length > 0 && (
                <div className="d-flex align-center">
                  <TableFilters
                    url="accounts"
                    refetch={refetch}
                    table_slug="accounts"
                    moduleName="Accounts"
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
                    totalPages={listing.accounts.last_page}
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
      {listing?.accounts?.data?.length > 0 ? (
        <div
          style={{
            animationDuration: "0.3s",
            animation: showDetail ? "fadeInLeft" : "",
          }}
          className="my-custom-table unset-height cof_listing_table"
        >
          <div
            id="wrapper"
            className={`accounts-listing ${!showDetail ? "item_table" : "bg-transparent"}`}
          >
            <div className="sticky_table">
              <FreezTable
                loading={false}
                refetch={refetch}
                setparam={setparam}
                table_slug="accounts"
                showDetail={showDetail}
                pagination={pagination}
                ReturnWidth={ReturnWidth}
                handleViewClick={() => null}
                data={listing.accounts.data}
                totalCountName="Total Accounts"
                total={listing?.accounts?.total}
                sidebarPosition={sidebarPosition}
                setcolsheader={handleTableFilters}
                setcustomLoading={setcustomLoading}
                selectedProducts={selectedProducts}
                tableSetting={listing.table_setting}
                colsHeader={tableFiltersForunlockcols}
                detailPageColumns={["selection", "name"]}
                setSelectedProducts={setSelectedProducts}
                preferences={listing.table_setting?.preferences}
                colsHeaderForlockedCols={tableFilterForLockedCols}
                columns={columns.filter((val) => val.locked === true)}
                handleTableFilterslockedcols={handleTableFilterslockedcols}
                defaultFreezTableWidth={defaultFreezTableWidth(
                  listing.table_setting?.freez_table_width
                )}
              />
            </div>
            {!showDetail && (
              <>
                <div className="no_sticky_table">
                  <ResizeableTable
                    url="accounts"
                    check={check}
                    loading={false}
                    refetch={refetch}
                    setparam={setparam}
                    table_slug="accounts"
                    pagination={pagination}
                    ReturnWidth={ReturnWidth}
                    handleViewClick={() => null}
                    handleSetCheck={handleSetCheck}
                    sidebarPosition={sidebarPosition}
                    setcolsheader={handleTableFilters}
                    setcustomLoading={setcustomLoading}
                    setColumnHideRef={setColumnHideRef}
                    selectedProducts={selectedProducts}
                    tableSetting={listing.table_setting}
                    data={listing?.accounts?.data ?? []}
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
              <span>No data found</span>
              <Buttonx type="link" btnText="Go Back" clickHandler={handleBack} />
            </div>
          )}
        </>
      )}

      <div
        className="item_listing_count"
        style={{ display: !showDetail && listing.accounts.data.length > 0 ? "" : "none" }}
      >
        <p className={`${showDetail ? "mb-15" : ""}`}>
          Total Accounts : {listing?.accounts?.total}
        </p>
      </div>
    </div>
  );
};
