/** @format */

import { Fragment } from "react";
import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Labels } from "static";
import { SortContent } from "./constant";
import { Breadcrumbx } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
import { BillPaymentsFilter } from "./Filters";
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
  handlePage,
  pagination,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleSortPopOver,
  handleFullScreen,
  handleOpenChange,
  showDetail,
}: any) => {
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
                  overlayClassName={`adjust-filter-main ${showDetail ? "w-300x" : ""}`}
                >
                  <img
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    className={`sort-icon mx-20 hover-effect ${
                      sortPopOver && "toggle"
                    }`}
                  />
                </Popover>
              </TooltipX>
              <FilterPopup
                form={form}
                popOver={popOver}
                refetch={refetch}
                setparam={setparam}
                pagination={pagination}
                showDetail={showDetail}
                handleOpenChange={handleOpenChange}
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
          totalPages={listing?.billPayments?.last_page}
        />
      )}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: any) => {
  return (
    <div
      className={
        showDetail
          ? "h-60 gray-color ml-10  product_list"
          : "product_list bill_payment_list gray-color"
      }
    >
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length} Bill Payment selected`
          : `${selectedProducts.length} Bill Payments selected`}
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
  popOver,
  refetch,
  setparam,
  pagination,
  showDetail,
  handleOpenChange,
  filterPreference,
}: any) => (
  <TooltipX title="Filter">
    <Popover
      title=""
      open={popOver}
      trigger="click"
      content={
        <BillPaymentsFilter
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
      overlayClassName="adjust-filter-main space--fixer width_px"
    >
      <div className="filter-toggle">
        <img
          alt=""
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
          className={`popup-over hover-effect  ${popOver && "toggle"}`}
        />
        {!showDetail && <span className={`${popOver ? "color-dark" : "color-gray"}`}>Filters</span>}
      </div>
    </Popover>
  </TooltipX>
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
