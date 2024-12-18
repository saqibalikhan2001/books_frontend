/** @format */

import { Form, Popover } from "antd";
import { date_range } from "./FilterOptions";
import { Buttonx, Selectx, TooltipX } from "app/shared";

export const SalesPersonFilters = ({ form, setparam, pagination, handleOpenChange }) => {
  const date = Form.useWatch("date_range", form);

  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      date_range: values?.date_range ?? "",
    });
    handleOpenChange(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={{
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
            popupClassName="overlap dropdown--scroll"
            placeholder="Select date"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>

        <div className="d-flex _generic_popupover_actions">
          {/* {import.meta.env.VITE_SHOW_SAVE === "true" && (
            <Buttonx
              btnText="Save"
              clickHandler={handleSave}
              className="btn-default space-right w-86px h-36px"
            />
          )} */}
          <Buttonx
            type="text"
            btnText="Reset"
            disabled={date === null}
            className="btn-default mr-15 w-96px h-36px"
            clickHandler={() => {
              form.setFieldsValue({
                date_range: null,
              });
            }}
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            disabled={pagination.date_range === date}
            className="btn-primary w-96px h-36px"
          />
        </div>
      </Form>
    </div>
  );
};
export const FilterPopup = ({ form, popOver, setparam, pagination, handleOpenChange }) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <SalesPersonFilters
            form={form}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
          />
        }
        placement="bottomLeft"
        onOpenChange={handleOpenChange}
        overlayClassName={`adjust-filter-main custom-dropdown width_px space-control ${false ? "fix--placement" : ""
          } `}
      >
        <div className="filter-toggle">
          <img
            alt=""
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/filters.svg`}
            className={`popup-over hover-effect ${false ? "mr-20" : "m--unset"} ${popOver ? "toggle" : ""
              } `}
          />
          {!false && <span className={`${popOver ? "color-dark" : "color-gray"}`}>Customize Report</span>}
        </div>
      </Popover>
    </TooltipX>
  );
};
