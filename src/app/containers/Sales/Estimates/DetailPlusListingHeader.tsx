/**@format */

import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { SortContent } from "./constant";
import { Breadcrumbx } from "app/shared";
import { EstimateFilters } from "./Filters";
import { CustomPaginate } from "app/shared/CustomPaginate";
import { DetailpageHeaderProps, FilterPopupProps, SelectedRowsProps } from "./Types";
import { TooltipX } from "app/shared/ToolTip";

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
  navigateTo,
  handlePage,
  pagination,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleSortPopOver,
  handleFullScreen,
  handleOpenChange,
  showDetail,
}: DetailpageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="product_detail_pagination">
      <div className="breadcrumb_row">
        <Breadcrumbx
          name=""
          detailPage
          refetch={refetch}
          moduleName={moduleName}
          handleFullScreen={handleFullScreen}
        />
        <div className="add_btn_outer">
          <TooltipX title={"Add new Estimate"}>
            <Button
              icon={
                <img
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                  alt="plus icon"
                  className="plus-icon"
                />
              }
              onClick={() => navigate(navigateTo)}
            />
          </TooltipX>
          {!selectedProducts.length && (
            <Fragment>
              <TooltipX title="Sort">
                <Popover
                  title={
                    <Title className="text-align dialog-heading" level={5}>
                      Sorting
                    </Title>
                  }
                  trigger="click"
                  open={sortPopOver}
                  onOpenChange={handleSortPopOver}
                  content={
                    <SortContent
                      setparam={setparam}
                      pagination={pagination}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                  placement="bottomRight"
                  overlayClassName={`adjust-filter-main dropdown--scroll ${
                    showDetail ? "w-300x" : ""
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    className={`sort-icon mx-20 hover-effect ${sortPopOver && "toggle"}`}
                  />
                </Popover>
              </TooltipX>
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
          totalPages={listing.estimates.last_page}
        />
      )}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: SelectedRowsProps) => {
  return (
    <div
      className={
        showDetail ? " product_list h-60 gray-color ml-10" : "product_list gray-color h-60"
      }
    >
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length} Estimate selected`
          : `${selectedProducts.length} Estimates selected`}
      </Typography.Title>
      <Dropdown menu={{ items }} trigger={["click"]} overlayClassName="generic_dropdown overlay_style">
        <span style={{ cursor: "pointer" }}>
          Batch actions
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
            alt="icon"
            className=" ml-10"
          />
        </span>
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
  filterPreference,
  handleOpenChange,
  showDetail,
}: FilterPopupProps) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <EstimateFilters
            form={form}
            refetch={refetch}
            setparam={setparam}
            pagination={pagination}
            filterPreference={filterPreference}
            handleOpenChange={handleOpenChange}
          />
        }
        placement="bottomRight"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main custom-dropdown ${showDetail ? "width_px" : ""}`}
      >
        <div className="filter-toggle">
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            alt=""
            className={`popup-over hover-effect ${popOver ? "toggle" : ""}`}
          />
          {!showDetail && (
            <span className={`${popOver ? "color-dark" : "color-gray"}  `}>Filters</span>
          )}
        </div>
        {/* <RiEqualizerFill className="popup-over another-filter" /> */}
      </Popover>
    </TooltipX>
  );
};

export const EstimateTiles = ({ pagination, listing, setparam }: any) => {
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
  return (
    <div className="filter-top align-center">
      <div
        className={
          pagination?.status === "sent"
            ? `filter-badge newBluish_Shade cursor ${delayedString}`
            : "filter-badge newBluish_Shade cursor"
        }
        onClick={() => handleStatusFilter("sent")}
      >
        <Typography.Text className="key">{listing?.total_sent_amount}</Typography.Text>
        <Typography.Text className="value">{listing?.total_sent_estimates} Sent</Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "rejected"
            ? `filter-badge newRedish_Shade cursor ${delayedString}`
            : "filter-badge newRedish_Shade cursor"
        }
        onClick={() => handleStatusFilter("rejected")}
      >
        <Typography.Text className="key">{listing?.total_rejected_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_rejected_estimates} Rejected
        </Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "closed"
            ? `filter-badge newGrey_shade cursor ${delayedString}`
            : "filter-badge newGrey_shade cursor"
        }
        onClick={() => handleStatusFilter("closed")}
      >
        <Typography.Text className="key">{listing?.total_closed_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_closed_estimates} Closed
        </Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "accepted"
            ? `filter-badge newgreenish_shade cursor ${delayedString}`
            : "filter-badge newgreenish_shade cursor"
        }
        onClick={() => handleStatusFilter("accepted")}
      >
        <Typography.Text className="key">{listing?.total_accepted_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_accepted_estimates} Accepted
        </Typography.Text>
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
