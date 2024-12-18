import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Breadcrumbx } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Labels } from "static";
import { JournalFilters } from "./Filters";

export const DetailpageHeader = ({
  refetch,
  form,
  setparam,
  popOver,
  moduleName,
  navigateTo,
  pagination,
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
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                  alt="plus icon"
                  className="plus-icon"
                ></img>
              }
              onClick={() => navigate(navigateTo)}
            />
          </TooltipX>
          {/* {!selectedProducts.length && (
            <Fragment>
              <TooltipX title="sort">
                <Popover
                  title={
                    <Title className="text-align" level={5}>
                      Sorting
                    </Title>
                  }
                  trigger="click"
                  open={sortPopOver}
                  onOpenChange={handleSortPopOver}
                  content={
                    <SortContent
                      pagination={pagination}
                      setparam={setparam}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                  placement="bottomRight"
                  overlayClassName="adjust-filter-main"
                >
                  <img
                    src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/sorting.svg"
                    className={`sort-icon another-filter hover-effect mr-20 ${
                      sortPopOver ? "toggle" : ""
                    }`}
                  />
                </Popover>
              </TooltipX >
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
          )} */}
          <FilterPopup
            form={form}
            refetch={refetch}
            popOver={popOver}
            setparam={setparam}
            showDetail={false}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
          />
        </div>
      </div>
      {/* {!selectedProducts.length && (
        <CustomPaginate
          Prev={Prev}
          Next={Next}
          paginate={pagination}
          handlePage={handlePage}
          className="pagination_row"
          handleRowSize={handleRowSize}
          totalPages={listing.items.last_page}
        />
      )} */}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: any) => {
  return (
    <div className={showDetail ? "h-60 gray-color ml-10  product_list" : "product_list gray-color"}>
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length}  Product selected`
          : `${selectedProducts.length}  Products selected`}
      </Typography.Title>
      <Dropdown overlayClassName="overlay_style" menu={{ items }} trigger={["click"]}>
        <div className="d-flex align-center">
          <span>Batch actions </span>
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
            alt="icon"
            className="ml-10"
          />
        </div>
      </Dropdown>
    </div>
  );
};

export const FilterPopup = ({
  form,
  popOver,
  setparam,
  pagination,
  showDetail,
  handleOpenChange,
}: any) => {
  return (
    <TooltipX title="Filter">
      <Popover
        style={{
          zIndex: 100,
        }}
        title=""
        open={popOver}
        trigger="click"
        content={
          <JournalFilters
            form={form}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
          />
        }
        placement="bottomLeft"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main custom-dropdown width_px space-control ${
          showDetail ? "fix--placement" : ""
        } `}
      >
        <div className="filter-toggle">
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            alt=""
            className={`popup-over hover-effect ${showDetail ? "mr-20" : "m--unset"} ${
              popOver ? "toggle" : ""
            } `}
          />
          {!showDetail && (
            <span className={`${popOver ? "color-dark" : "color-gray"}`}>Customize Report</span>
          )}
        </div>
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
          pagination?.stock_status === "lowstock"
            ? `filter-badge light_orange resistance_width stock-blocks cursor  ${delayedString}`
            : "filter-badge light_orange resistance_width stock-blocks cursor"
        }
        onClick={() => {
          handleStatusFilter("lowstock");
        }}
      >
        <Typography.Text className="key">Low stock</Typography.Text>
        <Typography.Text className="value">{listing?.low_stock} Products</Typography.Text>
      </div>
      <div
        className={
          pagination?.stock_status === "outofstock"
            ? `filter-badge newRedish_Shade resistance_width cursor  ${delayedString}`
            : "filter-badge newRedish_Shade resistance_width cursor"
        }
        onClick={() => {
          handleStatusFilter("outofstock");
        }}
      >
        <Typography.Text className="key">Out of stock</Typography.Text>
        <Typography.Text className="value">{listing?.out_of_stock} Products</Typography.Text>
      </div>
    </div>
  );
};

export const TableModalForResizing = ({
  content,
  isModalOpen,
  setIsModalOpen,
  handleSubmitSuitableWidth,
}) => {
  return (
    <Modal
      centered
      footer={null}
      destroyOnClose
      closable={false}
      open={isModalOpen}
      maskClosable={false}
      width={400}
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
