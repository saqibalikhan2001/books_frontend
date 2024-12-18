/**@format */

import { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { SortContent } from "./constant";
import { Breadcrumbx } from "app/shared";
import { InvoiceFilters } from "./Filters";
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
  showDetail,
  navigateTo,
  handlePage,
  pagination,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleFullScreen,
  handleOpenChange,
  handleSortPopOver,
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
          <TooltipX title={"Add new Invoice"}  >
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
                  onOpenChange={handleSortPopOver}
                  content={
                    <SortContent
                      setparam={setparam}
                      pagination={pagination}
                      handleSortPopOver={handleSortPopOver}
                    />
                  }
                  placement="bottomRight"
                  overlayClassName={`adjust-filter-main dropdown--scroll ${showDetail ? 'w-300x' : ''}`}
                >
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    className={`sort-icon hover-effect mx-20 ${sortPopOver ? 'toggle' : ''}`}
                  />
                </Popover>
              </TooltipX >
              <FilterPopup
                form={form}
                refetch={refetch}
                popOver={popOver}
                setparam={setparam}
                pagination={pagination}
                showDetail={showDetail}
                handleOpenChange={handleOpenChange}
                filterPreference={listing?.filter_preference?.preferences}
              />
            </Fragment>
          )}
        </div>
      </div >
      {!selectedProducts.length && (
        <CustomPaginate
          Prev={Prev}
          Next={Next}
          paginate={pagination}
          handlePage={handlePage}
          className="pagination_row"
          handleRowSize={handleRowSize}
          totalPages={listing.invoices.last_page}
        />
      )}
    </div >
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: SelectedRowsProps) => {
  return (
    <div className={showDetail ? "h-60 gray-color ml-10  product_list" : "product_list gray-color h-60"}>
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length}  Invoice selected`
          : `${selectedProducts.length}  Invoices selected`}
      </Typography.Title>
      <Dropdown menu={{ items }} trigger={["click"]} overlayClassName="generic_dropdown  overlay_style">
        <span style={{ cursor: "pointer" }}>
          Batch actions{" "}
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
  showDetail,
  filterPreference,
  handleOpenChange,
}: FilterPopupProps) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <InvoiceFilters
            form={form}
            refetch={refetch}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
            filterPreference={filterPreference}
          />
        }
        placement="bottomRight"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main custom-dropdown ${showDetail ? 'width_px' : ''}`}
      >
        <div className="filter-toggle">
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            alt=""
            className={`popup-over hover-effect ${showDetail ? "" : "m--unset"}  ${popOver ? 'toggle' : ''}`}
          />
          {!showDetail && <span className={`${popOver ? 'color-dark' : 'color-gray'}  `}>Filters</span>}
        </div>
      </Popover>
    </TooltipX >
  );
};

export const InvoiceTiles = ({ pagination, listing, setparam }: any) => {
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
      }, 400)
    }
    else {
      setDelayedString("");
      setTimeout(() => {
        setparam({ ...pagination, status: status, is_applied: true });
      }, 400)

    }
    // const handleStatusFilter = (status) => {
    //   if (pagination?.status === status) setparam({ ...pagination, status: "" });
    //   else setparam({ ...pagination, status: status, is_applied: true });
  };
  return (
    <div className="filter-top align-center">
      <div
        className={
          pagination?.status === "sent"
            ? `filter-badge newBluish_Shade widePerfection cursor ${delayedString}`
            : "filter-badge newBluish_Shade widePerfection cursor"
        }
        onClick={() => handleStatusFilter("sent")}
      >
        <Typography.Text className="key">{listing?.total_sent_invoices_amount}</Typography.Text>
        <Typography.Text className="value">{listing?.total_sent_invoices} Sent</Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "overdue"
            ? `filter-badge newRedish_Shade cursor widePerfection  ${delayedString}`
            : "filter-badge newRedish_Shade cursor widePerfection"
        }
        onClick={() => handleStatusFilter("overdue")}
      >
        <Typography.Text className="key">{listing?.total_over_due_invoices_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_over_due_invoices} Overdue
        </Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "paid"
            ? `filter-badge newgreenish_shade cursor widePerfection  ${delayedString}`
            : "filter-badge newgreenish_shade cursor widePerfection"
        }
        onClick={() => handleStatusFilter("paid")}
      >
        <Typography.Text className="key">{listing?.total_paid_invoices_amount}</Typography.Text>
        <Typography.Text className="value">{listing?.total_paid_invoices} Paid</Typography.Text>
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
