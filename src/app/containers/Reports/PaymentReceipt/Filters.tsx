/** @format */

import { Form, Popover } from "antd";
import { endpoints } from "static";
import { date_range } from "./filterOptions";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";

const { REPORT_CONTACT } = endpoints;

export const Filters = ({
  form,
  setparam,
  setApply,
  pagination,
  handleOpenChange,
  customer = false,
}) => {
  const date = Form.useWatch("date_range", form);
  const customerId = Form.useWatch("customer_id", form);
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      setparam({
        ...pagination,
        date_range: values?.date_range ?? "",
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
        initialValues={{
          date_range: pagination?.date_range || "this_week",
          customer_id: contactName || null,
          // custom_ranges:
          //   pagination.date_range === "custom"
          //     ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)]
          //     : [todayDate, todayDate],
        }}
        style={{ maxWidth: 600 }}
      >
        <div className="form_group">
          <Selectx
            valueLabel
            label="Date"
            size="large"
            name="date_range"
            handleSort={false}
            allowClear={false}
            placeholder="Select date"
            popupClassName="overlap dropdown--scroll"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        {/* {date === "custom" && (
          <div className="form_group  mb-20">
            <label>Date range</label>
            <Form.Item name="custom_ranges" rules={rules({ message: Content.select_date_range })}>
              <RangePicker
                allowClear={false}
                format={org_date_format}
                popupClassName="overlap"
                separator={<label>-</label>}
                placeholder={[org_date_format, org_date_format]}
              />
            </Form.Item>
          </div>
        )} */}
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
        <div className="d-flex _generic_popupover_actions">
          <Buttonx
            type="text"
            disabled={date === null}
            className="btn-default mr-15 w-96px h-36px"
            clickHandler={() => {
              customer
                ? form.setFieldsValue({
                    date_range: null,
                    customer_id: null,
                  })
                : form.setFieldsValue({
                    date_range: null,
                  });
              customer && sessionStorage.removeItem("contactName");
            }}
            btnText="Reset"
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
            disabled={
              customer
                ? pagination.date_range === date && pagination.contactId === customerId?.id
                : pagination.date_range === date
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
  setApply,
  pagination,
  handleOpenChange,
  customer = false,
}) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <Filters
            form={form}
            setApply={setApply}
            customer={customer}
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
