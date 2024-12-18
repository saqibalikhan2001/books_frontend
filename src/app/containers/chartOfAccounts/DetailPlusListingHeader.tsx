import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { Breadcrumbx } from "app/shared";
import { SortContent } from "./constant";
import { AccountFilters } from "./Filters";
import { TooltipX } from "app/shared/ToolTip";
import { CustomPaginate } from "app/shared/CustomPaginate";

const { Title } = Typography;

export const DetailpageHeader = ({
  form,
  Prev,
  Next,
  refetch,
  popOver,
  listing,
  setparam,
  moduleName,
  showDetail,
  navigateTo,
  handlePage,
  pagination,
  sortPopOver,
  handleRowSize,
  handleFullScreen,
  handleOpenChange,
  selectedProducts,
  handleSortPopOver,
}: any) => {
  const navigate = useNavigate();
  return (
    <div className="product_detail_pagination">
      <div className="breadcrumb_row ">
        <Breadcrumbx
          name=""
          detailPage
          refetch={refetch}
          moduleName={moduleName}
          handleFullScreen={handleFullScreen}
        />

        <div className="add_btn_outer">
          <TooltipX title="Add new account">
            <Button
              icon={
                <img
                  alt="plus icon"
                  className="plus-icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                />
              }
              onClick={() => navigate(navigateTo)}
            />
          </TooltipX>
          {!selectedProducts.length && (
            <Fragment>
              <TooltipX title="Sort">
                <Popover
                  trigger="click"
                  open={sortPopOver}
                  content={
                    <SortContent
                      setparam={setparam}
                      pagination={pagination}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                  title={
                    <Title className="text-align" level={5}>
                      Sorting
                    </Title>
                  }
                  placement="bottomRight"
                  onOpenChange={handleSortPopOver}
                  overlayClassName="adjust-filter-main"
                >
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    className={`sort-icon another-filter hover-effect mr-20 ${
                      sortPopOver ? "toggle" : ""
                    }`}
                  />
                </Popover>
              </TooltipX>
              <FilterPopup
                form={form}
                refetch={refetch}
                popOver={popOver}
                setparam={setparam}
                showDetail={showDetail}
                pagination={pagination}
                handleOpenChange={handleOpenChange}
                filterPreference={listing?.filter_preference}
              />
            </Fragment>
          )}
        </div>
      </div>
      {!selectedProducts.length && (
        <CustomPaginate
          Prev={Prev}
          Next={Next}
          paginate={pagination}
          handlePage={handlePage}
          className="pagination_row"
          handleRowSize={handleRowSize}
          totalPages={listing.accounts.last_page}
        />
      )}
    </div>
  );
};

export const FilterPopup = ({
  form,
  popOver,
  refetch,
  setparam,
  pagination,
  showDetail = false,
  filterPreference,
  handleOpenChange,
}) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        placement="bottomRight"
        onOpenChange={handleOpenChange}
        content={
          <AccountFilters
            form={form}
            popOver={popOver}
            refetch={refetch}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
            filterPreference={filterPreference?.preferences}
          />
        }
        overlayClassName="adjust-filter-main custom-dropdown width_px"
      >
        <div className="filter-toggle">
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            alt=""
            className={`popup-over hover-effect  ${showDetail ? "mr-20" : "m--unset"} ${
              popOver ? "toggle" : ""
            } `}
          />
          {!showDetail && (
            <span className={`${popOver ? "color-dark" : "color-gray"}`}>Filters</span>
          )}
        </div>
      </Popover>
    </TooltipX>
  );
};
export const SelectedRows = ({ showDetail, selectedProducts, items }) => (
  <div
    className={showDetail ? "h-60 gray-color ml-10  product_list" : "product_list gray-color h-60"}
  >
    <Typography.Title className="selected_product" level={3}>
      {selectedProducts.length === 1
        ? `${selectedProducts.length}  Account selected`
        : `${selectedProducts.length}  Accounts selected`}
    </Typography.Title>
    <Dropdown overlayClassName="overlay_style" menu={{ items }} trigger={["click"]}>
      <span style={{ cursor: "pointer" }}>
        Batch actions
        <img
          alt="icon"
          className=" ml-15"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
        />
      </span>
    </Dropdown>
  </div>
);
export const TableModalForResizing = ({
  content,
  isModalOpen,
  setIsModalOpen,
  handleSubmitSuitableWidth,
}) => {
  return (
    <Modal
      centered
      width={400}
      footer={null}
      destroyOnClose
      closable={false}
      open={isModalOpen}
      maskClosable={false}
      className="radius-5 default_modal"
    >
      <Space>
        <Typography.Text>{content}</Typography.Text>
      </Space>
      <Row justify="center">
        <Space>
          <Button className="btn-form-size btn-default" onClick={() => setIsModalOpen(false)}>
            {Labels.CANCEL}
          </Button>
          <Button className="btn-form-size btn-primary" onClick={handleSubmitSuitableWidth}>
            {Labels.SAVE}
          </Button>
        </Space>
      </Row>
    </Modal>
  );
};

export const Tiles = ({ pagination, setparam, listing }) => {
  const [delayedString, setDelayedString] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setDelayedString("active");
      }, 300);
    };

    fetchData();
  }, []);

  const handleStatusFilter = (status) => {
    if (pagination?.stock_status === status) {
      setDelayedString("");
      setTimeout(() => {
        setparam({ ...pagination, stock_status: "" });
      }, 400);
    } else {
      setDelayedString("");
      setTimeout(() => {
        setparam({ ...pagination, stock_status: status, is_applied: true });
      }, 400);
    }
  };
  return (
    <div className="filter-top align-center">
      <div
        className={
          pagination.stock_status === "lowstock"
            ? `filter-badge light_orange resistance_width stock-blocks cursor  ${delayedString}`
            : "filter-badge light_orange resistance_width stock-blocks cursor"
        }
        onClick={() => {
          handleStatusFilter("lowstock");
        }}
      >
        <Typography.Text className="key">Low stock</Typography.Text>
        <Typography.Text className="value">{listing.low_stock} Products</Typography.Text>
      </div>
      <div
        className={
          pagination.stock_status === "outofstock"
            ? `filter-badge newRedish_Shade resistance_width cursor  ${delayedString}`
            : "filter-badge newRedish_Shade resistance_width cursor"
        }
        onClick={() => {
          handleStatusFilter("outofstock");
        }}
      >
        <Typography.Text className="key">Out of stock</Typography.Text>
        <Typography.Text className="value">{listing.out_of_stock} Products</Typography.Text>
      </div>
    </div>
  );
};
