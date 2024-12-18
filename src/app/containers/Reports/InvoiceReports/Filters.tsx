/** @format */

import { Form, Popover } from "antd";
import { endpoints } from "static";
import { date_range, status_options } from "./FilterOptions";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";

const { REPORT_CONTACT } = endpoints;

export const InvoiceReportFilters = ({
  form,
  setparam,
  pagination,
  customer = false,
  handleOpenChange,
  setApply,
}) => {
  const date = Form.useWatch("date_range", form);
  const status = Form.useWatch("status", form);
  const customerObj = Form.useWatch("customer_id", form);
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      setparam({
        ...pagination,
        date_range: values?.date_range ?? "",
        status: values?.status ?? "",
        contactId:
          typeof values?.customer_id === "object"
            ? values?.customer_id?.id ?? ""
            : values?.customer_id ?? "",
      });
      handleOpenChange(false);
      setApply(false);
    } catch (error) {
      console.log("error", error);
    }
  };

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

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={{
          date_range: pagination?.date_range || "this_week",
          status: pagination?.status || "all",
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
            placeholder="Select date"
            popupClassName="overlap dropdown--scroll"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        {customer && (
          <div className="form_group">
            <span>Customer</span>
            <PaginateSelectX
              report
              required
              size="large"
              allowClear={false}
              name="customer_id"
              url={REPORT_CONTACT}
              contactType="customer"
              placeholder="Select or Search Customer"
              handleChange={(value) => handleCustomerChange(value)}
            />
          </div>
        )}
        <div className="form_group">
          <Selectx
            valueLabel
            size="large"
            name="status"
            label="Status"
            allowClear={false}
            handleSort={false}
            placeholder="Select status"
            popupClassName="overlap dropdown--scroll"
            options={status_options.sort((a, b) => a.key - b.key)}
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
                status: null,
                customer_id: null,
              });
              sessionStorage.removeItem("contactName");
            }}
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
            disabled={
              customer
                ? pagination.date_range === date &&
                  pagination.status === status &&
                  pagination?.contactId === customerObj?.id
                : pagination.date_range === date && pagination.status === status
            }
          />
        </div>
      </Form>
    </div>
  );
};
export const FilterPopup = ({
  form,
  popOver,
  setparam,
  pagination,
  setApply,
  customer = false,
  handleOpenChange,
}) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        placement="bottomLeft"
        onOpenChange={handleOpenChange}
        content={
          <InvoiceReportFilters
            form={form}
            setparam={setparam}
            customer={customer}
            setApply={setApply}
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
