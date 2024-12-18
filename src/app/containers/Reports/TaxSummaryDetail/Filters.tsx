/** @format */

import { Form, Popover } from "antd";
import { endpoints } from "static";
import { date_range } from "./filterOptions";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";

const { TAXSUMMARYITEMS } = endpoints;
export const TaxSummaryDetailsReportFilters = ({
  form,
  setparam,
  pagination,
  handleOpenChange,
}) => {
  const date = Form.useWatch("date_range", form);
  const itemId = Form.useWatch("item_id", form);

  const handleItemChange = (values) => {
    values
      ? sessionStorage.setItem("itemName", JSON.stringify({ id: values.id, label: values.label }))
      : sessionStorage.removeItem("itemName");
    form.setFieldsValue({
      item_id: values.id,
    });
  };

  const handleApply = () => {
    let itemName = JSON.parse(sessionStorage.getItem("itemName") as any) || null;
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      date_range: values?.date_range ?? "",
      itemId: itemName?.id ?? "",
    });
    handleOpenChange(false);
  };
  let itemName = JSON.parse(sessionStorage.getItem("itemName") as any) || null;

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={{
          item_id: itemName,
          date_range: pagination?.date_range || "this_week",
        }}
      >
        <div className="form_group">
          <Selectx
            valueLabel
            label="Date"
            size="large"
            name="date_range"
            allowClear={false}
            handleSort={false}
            placeholder="Select date"
            popupClassName="overlap dropdown--scroll"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
          <span>Product</span>
          <PaginateSelectX
            size="large"
            name="item_id"
            required={false}
            allowClear={false}
            url={TAXSUMMARYITEMS}
            placeholder="Select or Search Product"
            handleChange={(value) => handleItemChange(value)}
          />
        </div>

        <div className="d-flex _generic_popupover_actions">
          <Buttonx
            type="text"
            btnText="Reset"
            disabled={date === null}
            className="btn-default mr-15 w-96px h-36px"
            clickHandler={() => {
              form.setFieldsValue({
                date_range: null,
                item_id: null,
              });
              sessionStorage.removeItem("itemName");
            }}
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
            disabled={pagination.date_range === date && pagination.itemId === itemId?.id}
          />
        </div>
      </Form>
    </div>
  );
};

export const FilterPopup = ({ form, popOver, setparam, pagination, handleOpenChange }) => {
  // const handleClearFilter = () => {
  //   setparam({
  //     ...pagination,
  //     date_range: "",
  //     start_range: "",
  //     end_range: "",
  //     itemId: "",
  //   });
  //   form.setFieldValue("item_id", null);
  //   sessionStorage.removeItem("itemName");
  // };
  return (
    <>
      <TooltipX title="Filter">
        <Popover
          title=""
          open={popOver}
          trigger="click"
          content={
            <TaxSummaryDetailsReportFilters
              form={form}
              setparam={setparam}
              pagination={pagination}
              handleOpenChange={handleOpenChange}
            />
          }
          placement="bottomLeft"
          onOpenChange={handleOpenChange}
          overlayClassName={`adjust-filter-main custom-dropdown width_px space-control report_dropdown ${
            false ? "fix--placement" : ""
          } `}
        >
          <div className="filter-toggle">
            <img
              alt=""
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
              className={`popup-over hover-effect ${false ? "mr-20" : "m--unset"} ${
                popOver ? "toggle" : ""
              } `}
            />
            {!false && (
              <span className={`${popOver ? "color-dark" : "color-gray"}`}>Customize Report</span>
            )}
          </div>
        </Popover>
      </TooltipX>
      {/* {(pagination?.date_range || pagination?.itemId) && (
        <Button
          type="link"
          onClick={handleClearFilter}
          className="d-flex align-items-end clear_filter_btn"
        >
          Clear filters
        </Button>
      )} */}
    </>
  );
};
