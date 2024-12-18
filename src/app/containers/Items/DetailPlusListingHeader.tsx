import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Breadcrumbx } from "app/shared";
import { ItemFilters } from "./Filters";
import { SortContent } from "./constant";
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
  categories,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleSortPopOver,
  handleFullScreen,
  handleOpenChange,
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
          <TooltipX title="Add new Product">
            <Button
              icon={
                <img
                  alt="plus icon"
                  className="plus-icon"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                ></img>
              }
              onClick={() => navigate(navigateTo)}
            />
          </TooltipX>
          {!selectedProducts.length && (
            <Fragment>
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
                  overlayClassName={`adjust-filter-main dropdown--scroll ${
                    showDetail ? "w-300x" : ""
                  }`}
                  content={
                    <SortContent
                      setparam={setparam}
                      pagination={pagination}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                >
                  <img
                    className={`sort-icon hover-effect mx-20 ${sortPopOver ? "toggle" : ""}`}
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
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
                categories={categories}
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
          totalPages={listing.items.last_page}
        />
      )}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: any) => {
  return (
    <div
      className={
        showDetail ? "h-60 gray-color ml-10  product_list" : "product_list gray-color h-60"
      }
    >
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length}  Product selected`
          : `${selectedProducts.length}  Products selected`}
      </Typography.Title>
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        overlayClassName="overlay_style"
        className="uniqueDrpdownClose"
      >
        <div className="d-flex align-center">
          <span>Batch actions </span>
          <img
            alt="icon"
            className="ml-10"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        </div>
      </Dropdown>
    </div>
  );
};

export const FilterPopup = ({
  form,
  popOver,
  refetch,
  setparam,
  pagination,
  categories,
  showDetail,
  handleOpenChange,
  filterPreference,
}: any) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <ItemFilters
            form={form}
            refetch={refetch}
            setparam={setparam}
            pagination={pagination}
            categories={categories}
            handleOpenChange={handleOpenChange}
            filterPreference={filterPreference?.preferences}
          />
        }
        placement="bottomRight"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main unique-diffrence custom-dropdown  space-control ${
          showDetail ? "fix--placement width_px" : ""
        } `}
      >
        <div className="filter-toggle">
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            alt=""
            className={`popup-over hover-effect ${showDetail ? "" : "m--unset"} ${
              popOver ? "toggle" : ""
            } `}
          />
          {!showDetail && (
            <span className={`${popOver ? "color-dark" : "color-gray"}`}>Filters</span>
          )}
        </div>
        {/* <RiEqualizerFill className="popup-over another-filter" /> */}
      </Popover>
    </TooltipX>
  );
};

export const Tiles = ({ pagination, setparam, listing }) => {
  const [delayedString, setDelayedString] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      // Simulate an asynchronous operation (e.g., API call) with a 3-second delay
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

export const TableModalForResizing = ({
  content,
  isModalOpen,
  //@ts-ignore
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
          <Button className="btn-form-size btn-primary" onClick={handleSubmitSuitableWidth}>
            Reset
          </Button>
        </Space>
      </Row>
    </Modal>
  );
};
