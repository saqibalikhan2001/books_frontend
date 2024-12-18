/** @format */

import { Checkbox, Form, Input, Popover, Select } from "antd";
import { endpoints } from "static";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";
import { aging_by, aging_intervals, date_range } from "./filterOptions";

const { Option } = Select;
const { REPORT_CONTACT } = endpoints;

export const AgingDetailsFilters = ({ form, setparam, pagination, handleOpenChange }) => {
  const date = Form.useWatch("date_range", form);
  const aging = Form.useWatch("aging_by", form);
  const customerId = Form.useWatch("customer_id", form);
  const interval_type = Form.useWatch("interval_type", form);
  const interval_range = Form.useWatch("interval_range", form);
  const number_of_columns = Form.useWatch("number_of_columns", form);

  const handleCustomerChange = (values) => {
    values
      ? sessionStorage.setItem(
          "contactName",
          JSON.stringify({ id: values.id, label: values.label })
        )
      : sessionStorage.removeItem("contactName");
    form.setFieldsValue({
      customer_id: values.id,
    });
  };
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleApply = (value) => {
    setparam({
      ...pagination,
      contactId:
        typeof value?.customer_id === "object" ? value?.customer_id?.id : value?.customer_id ?? "",
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
          customer_id: contactName || null,
          show_by: pagination?.show_by || null,
          aging_by: pagination?.aging_by || "invoicedate",
          date_range: pagination?.date_range || "this_week",
          interval_type: pagination?.interval_type || "weeks",
          interval_range: pagination?.interval_range || "1",
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
            label="As of"
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
          <span>Customer</span>
          <PaginateSelectX
            size="large"
            required={false}
            allowClear={false}
            name="customer_id"
            url={REPORT_CONTACT}
            placeholder="Select or Search Customer"
            handleChange={(value) => handleCustomerChange(value)}
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
        {/* <div className="form_group">
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
        </div> */}
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
          <Buttonx
            type="text"
            btnText="Reset"
            disabled={date === null}
            className="btn-default mr-15 w-96px h-36px"
            clickHandler={() => {
              form.setFieldsValue({
                show_by: null,
                aging_by: null,
                customer_id: null,
                date_range: null,
                interval_type: null,
                interval_range: null,
                number_of_columns: null,
                is_include_credit_notes: null,
              });
              sessionStorage.removeItem("contactName");
            }}
          />
          <Buttonx
            btnText="Apply"
            htmlType="submit"
            className="btn-primary w-96px h-36px"
            disabled={
              pagination.date_range === date &&
              pagination.contactId === customerId?.id &&
              pagination?.interval_type === interval_type &&
              pagination?.interval_range === interval_range &&
              pagination.number_of_columns === number_of_columns &&
              pagination.aging_by === aging
            }
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
          <AgingDetailsFilters
            form={form}
            setparam={setparam}
            pagination={pagination}
            handleOpenChange={handleOpenChange}
          />
        }
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
  );
};
