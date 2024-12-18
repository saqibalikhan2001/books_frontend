/**@format */

import { Button, Dropdown, Modal, Popover, Row, Space, Typography } from "antd";
import { Breadcrumbx } from "app/shared";
import { CustomPaginate } from "app/shared/CustomPaginate";
import { TooltipX } from "app/shared/ToolTip";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Labels } from "static";
import { CreditNoteFilters } from "./Filters";
import { SortContent } from "./constant";

const { Title } = Typography;

export const DetailpageHeader = ({
  form,
  Prev,
  Next,
  refetch,
  popOver,
  listing,
  setparam,
  showDetail,
  moduleName,
  navigateTo,
  handlePage,
  pagination,
  sortPopOver,
  handleRowSize,
  selectedProducts,
  handleFullScreen,
  handleOpenChange,
  handleSortPopOver,
}: any) => {
  const navigate = useNavigate();

  return (
    <div className="product_detail_pagination ">
      <div className="breadcrumb_row">
        <Breadcrumbx
          name=""
          detailPage
          refetch={refetch}
          moduleName={moduleName}
          handleFullScreen={handleFullScreen}
        />
        <div className="add_btn_outer credit--sideIcon">
          <TooltipX title={"Add new credit note"}>
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
              <TooltipX title="Sort" className="sort_modal">
                <Popover
                  title={
                    <Title className="text-align sort_modal_title" level={5}>
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
                  overlayClassName={`adjust-filter-main dropdown--scroll ${showDetail ? 'width_px' : ''}`}
                >
                  <div className="filter-toggle">
                    <img
                      alt="sorting Icon"
                      className={`sort-icon mx-20 hover-effect ${sortPopOver && "toggle"}`}
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/sorting.svg`}
                    />
                    {!showDetail && <span className={"color-gray"}>Filters</span>}
                  </div>
                </Popover>
              </TooltipX >
              <FilterPopup
                form={form}
                popOver={popOver}
                refetch={refetch}
                setparam={setparam}
                showDetail={showDetail}
                pagination={pagination}
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
          totalPages={listing.credit_notes.last_page}
        />
      )}
    </div>
  );
};

export const SelectedRows = ({ showDetail, selectedProducts, items }: any) => {
  return (
    <div className={showDetail ? "product-detail-list product_list h-60" : "product_list gray-color h-60"}>
      <Typography.Title className="selected_product" level={3}>
        {selectedProducts.length === 1
          ? `${selectedProducts.length}  Credit note selected`
          : `${selectedProducts.length}  Credit notes selected`}
      </Typography.Title>
      <Dropdown menu={{ items }} trigger={["click"]} overlayClassName="generic_dropdown  overlay_style">
        <span style={{ cursor: "pointer" }}>
          Batch actions
          <img
            className="ml-15"
            alt="dropdown arrow"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
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
  handleOpenChange,
  filterPreference,
}: any) => {
  return (
    <TooltipX title="Filter"  >
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <CreditNoteFilters
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
        overlayClassName={`adjust-filter-main custom-dropdown  ${showDetail ? 'width_px' : ''}`}
      >
        <div className="filter-toggle">
          <img
            alt=""
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            className={`popup-over hover-effect ${popOver && "toggle"} ${showDetail ? "" : "m--unset"
              }`}
          />
          {!showDetail && <span className={`${popOver ? 'color-dark' : 'color-gray'}  `}>Filters</span>}
        </div>
      </Popover>
    </TooltipX >
  );
};

//@ts-ignore
export const CreditNoteTiles = ({ pagination, listing, setparam }: any) => {
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
    // const handleStatusFilter = (status) => {
    //   if (pagination?.status === status) setparam({ ...pagination, status: "" });
    //   else setparam({ ...pagination, status: status, is_applied: true });
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
        <Typography.Text className="key">{listing?.total_open_amount}</Typography.Text>
        <Typography.Text className="value">{listing?.total_open_credit_notes} Open</Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "consumed"
            ? `filter-badge newgreenish_shade cursor ${delayedString}`
            : "filter-badge newgreenish_shade cursor"
        }
        onClick={() => handleStatusFilter("consumed")}
      >
        <Typography.Text className="key">{listing?.total_consumed_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_consumed_credit_notes} Consumed
        </Typography.Text>
      </div>
      <div
        className={
          pagination?.status === "partially applied"
            ? `filter-badge newRedish_Shade resistance_width stock-blocks cursor ${delayedString}`
            : "filter-badge newRedish_Shade resistance_width stock-blocks cursor"
        }
        onClick={() => handleStatusFilter("partially applied")}
      >
        <Typography.Text className="key">{listing?.total_partially_applied_amount}</Typography.Text>
        <Typography.Text className="value">
          {listing?.total_partially_applied_credit_notes} PRTL Applied
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
