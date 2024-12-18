/** @format */

import { Form, Popover } from "antd";
import { endpoints } from "static";
import { date_range } from "./FilterOptions";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";

const { REPORT_CONTACT } = endpoints;

export const SalesPersonFilters = ({ form, setparam, pagination, handleOpenChange }) => {
  const date = Form.useWatch("date_range", form);
  const customerId = Form.useWatch("customer_id", form);

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
      date_range: value?.date_range ?? "",
      contactId:
        typeof value?.customer_id === "object" ? value?.customer_id?.id : value?.customer_id ?? "",
    });
    handleOpenChange(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={(value) => handleApply(value)}
        initialValues={{
          date_range: pagination?.date_range || "this_week",
          customer_id: contactName || null,
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
            popupClassName="overlap"
            placeholder="Select date"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="form_group">
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
                customer_id: null,
              });
              sessionStorage.removeItem("contactName");
            }}
          />
          <Buttonx
            btnText="Apply"
            className="btn-primary w-96px h-36px"
            disabled={pagination.date_range === date && pagination?.contactId === customerId?.id}
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
