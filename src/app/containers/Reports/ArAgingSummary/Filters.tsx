/** @format */

import { Checkbox, Form, Input, Popover, Select } from "antd";
import { Buttonx, Selectx, TooltipX } from "app/shared";
import { aging_by, aging_intervals, date_range, show_by } from "./filterOptions";

const { Option } = Select;

export const AgingReportsFilters = ({ form, setparam, pagination, handleOpenChange }) => {
  const date = Form.useWatch("date_range", form);
  const interval_type = Form.useWatch("interval_type", form);

  const handleApply = (value) => {
    setparam({
      ...pagination,
      date_range: value?.date_range ?? "",
      aging_by: value?.aging_by ?? "",
      interval_range: value?.interval_range ?? "",
      interval_type: value?.interval_type ?? "",
      number_of_columns: value?.number_of_columns ?? "",
      show_by: value?.show_by ?? "",
      is_include_credit_notes: value?.is_include_credit_notes ?? "",
    });
    handleOpenChange(false);
  };

  const validateInterval = (e) => {
    if (interval_type === "days" && e.target.value > 60) {
      form.setFieldValue("interval_range", 60);
    } else if (interval_type === "weeks" && e.target.value > 8) {
      form.setFieldValue("interval_range", 8);
    }
    return Promise.resolve();
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={(value) => handleApply(value)}
        initialValues={{
          show_by: pagination?.show_by || "amount",
          aging_by: pagination?.aging_by || "invoiceduedate",
          date_range: pagination?.date_range || "this_week",
          interval_range: pagination?.interval_range || "1",
          interval_type: pagination?.interval_type || "weeks",
          number_of_columns: pagination?.number_of_columns || "1",
        }}
      >
        <Form.Item name="is_include_credit_notes">
          <Checkbox
            className="mt-3"
            defaultChecked={pagination?.is_include_credit_notes}
            onChange={(e) => form.setFieldValue("is_include_credit_notes", e.target.checked)}
          >
            Is include credit notes
          </Checkbox>
        </Form.Item>
        <div className="form_group">
          <Selectx
            valueLabel
            size="large"
            label="As of"
            name="date_range"
            allowClear={false}
            handleSort={false}
            placeholder="Select date"
            popupClassName="overlap dropdown--scroll"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
          <Selectx
            valueLabel
            size="large"
            name="aging_by"
            label="Aging By"
            allowClear={false}
            handleSort={false}
            placeholder="Select aging by"
            popupClassName="overlap dropdown--scroll"
            options={aging_by.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
          <Selectx
            valueLabel
            size="large"
            name="show_by"
            label="Show By"
            allowClear={false}
            handleSort={false}
            placeholder="Select show by"
            popupClassName="overlap dropdown--scroll"
            options={show_by.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
          <Selectx
            valueLabel
            size="large"
            allowClear={false}
            handleSort={false}
            label="Aging Intervals"
            name="number_of_columns"
            placeholder="Select aging intervals"
            popupClassName="overlap dropdown--scroll"
            options={aging_intervals.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
          <div
            style={{
              display: "flex",
            }}
            className="estimate_discount_field"
          >
            <Form.Item name="interval_range" label="Intervals of">
              <Input
                min={0}
                step="0.01"
                type="number"
                size="middle"
                name="interval_range"
                onChange={validateInterval}
                className={`discount_field`}
                placeholder="Enter intervals of"
              />
            </Form.Item>
            <Form.Item name="interval_type" className="dropdown-option">
              <Select
                popupClassName="overlap"
                className={`discount_dropdown`}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                suffixIcon={
                  <img
                    alt="arrow icon"
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
                  />
                }
              >
                <Option value="days">Days</Option>
                <Option value="weeks">Weeks</Option>
              </Select>
            </Form.Item>
          </div>
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
                show_by: null,
                aging_by: null,
                date_range: null,
                interval_type: null,
                interval_range: null,
                number_of_columns: null,
                is_include_credit_notes: null,
              });
            }}
          />
          <Buttonx
            btnText="Apply"
            htmlType="submit"
            className="btn-primary w-96px h-36px"
            // disabled={pagination.date_range === date}
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
        placement="bottomLeft"
        onOpenChange={handleOpenChange}
        content={
          <AgingReportsFilters
            form={form}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
          />
        }
        overlayClassName={`adjust-filter-main custom-dropdown width_px space-control ${
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
  );
};
