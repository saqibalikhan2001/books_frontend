/** @format */

import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { BillFilters } from "./Filters";
import { SortContent } from "./constant";
import { Breadcrumbx } from "app/shared";
import { CustomPaginate } from "app/shared/CustomPaginate";
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
  categories,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleSortPopOver,
  handleFullScreen,
  handleOpenChange,
  showDetail,
}) => {
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
          <TooltipX title={"Add new Bill"}  >
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
          </TooltipX >
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
                  content={
                    <SortContent
                      pagination={pagination}
                      setparam={setparam}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                  overlayClassName={`adjust-filter-main ${showDetail ? 'w-300x' : ''}`}
                >
                  <img
                    className={`sort-icon mx-20 hover-effect ${sortPopOver && "toggle"}`}
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                  />
                </Popover>
              </TooltipX >
              <FilterPopup
                form={form}
                refetch={refetch}
                popOver={popOver}
                setparam={setparam}
                pagination={pagination}
                categories={categories}
                handleOpenChange={handleOpenChange}
                filterPreference={listing?.filter_preference?.preferences}
                showDetail={showDetail}
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
          totalPages={listing?.bills?.last_page}
        />
      )}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: any) => {
  return (
    <div className={showDetail ? "h-60 gray-color ml-10  product_list" : "product_list gray-color h-60"}>
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length} Bill selected`
          : `${selectedProducts.length} Bills selected`}
      </Typography.Title>
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        overlayClassName="overlay_style generic_dropdown"
      >
        <div className="d-flex align-center">
          <span>Batch actions</span>
          <img
            className="ml-10"
            alt="Dropdown Arrow"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        </div>
      </Dropdown>
    </div>
  );
};

export const FilterPopup = ({
  form,
  refetch,
  popOver,
  setparam,
  pagination,
  categories,
  filterPreference,
  handleOpenChange,
  showDetail,
}: any) => {
  return (
    <TooltipX title="Filter" >
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <BillFilters
            form={form}
            refetch={refetch}
            setparam={setparam}
            pagination={pagination}
            categories={categories}
            filterPreference={filterPreference}
            handleOpenChange={handleOpenChange}
          />
        }
        placement="bottomRight"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main custom-dropdown ${showDetail ? 'width_px' : ''} `}
      >
        <div className="filter-toggle">
          <img
            alt=""
            className={`popup-over hover-effect  ${popOver && "toggle"
              }`}
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
          />
          {!showDetail && (
            <span className={`${popOver ? "color-dark" : "color-gray"}`}>Filters</span>
          )}
        </div>
      </Popover>
    </TooltipX >
  );
};
//@ts-ignore
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
  //@ts-ignore
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
          pagination?.status === "open"
            ? `filter-badge newBluish_Shade cursor ${delayedString}`
            : "filter-badge newBluish_Shade cursor"
        }
        onClick={() => handleStatusFilter("open")}
      >
        <Typography.Text className="key">{listing?.total_open_bills_amount} </Typography.Text>
        <Typography.Text className="value">{listing?.total_open_bills} Open</Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "overdue"
            ? `filter-badge newRedish_Shade cursor  ${delayedString}`
            : "filter-badge newRedish_Shade cursor"
        }
        onClick={() => handleStatusFilter("overdue")}
      >
        <Typography.Text className="key">{listing?.total_over_due_bills_amount}</Typography.Text>
        <Typography.Text className="value">{listing?.total_over_due_bills} Overdue</Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "paid"
            ? `filter-badge newgreenish_shade cursor ${delayedString}`
            : "filter-badge newgreenish_shade cursor"
        }
        onClick={() => handleStatusFilter("paid")}
      >
        <Typography.Text className="key">{listing?.total_paid_bills_amount} </Typography.Text>
        <Typography.Text className="value">{listing?.total_paid_bills} Paid</Typography.Text>
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
