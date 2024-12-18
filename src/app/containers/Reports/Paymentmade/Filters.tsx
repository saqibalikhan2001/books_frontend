/** @format */

import { Form, Popover } from "antd";
import { endpoints } from "static";
import { date_range } from "./FilterOptions";
import { Buttonx, PaginateSelectX, Selectx, TooltipX } from "app/shared";

const { REPORT_CONTACT } = endpoints;
export const SalesPersonFilters = ({
  form,
  setparam,
  setApply,
  pagination,
  handleOpenChange,
  vendor = false,
}) => {
  const date = Form.useWatch("date_range", form);
  const vendorObj = Form.useWatch("vendor_id", form);
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      setparam({
        ...pagination,
        date_range: values?.date_range ?? "",
        contactId:
          typeof values?.vendor_id === "object"
            ? values?.vendor_id?.id ?? ""
            : values?.vendor_id ?? "",
      });
      handleOpenChange(false);
      setApply(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleVendorChange = (values) => {
    values
      ? sessionStorage.setItem(
          "contactName",
          JSON.stringify({ id: values.id, label: values.label })
        )
      : sessionStorage.removeItem("contactName");
    form.setFieldsValue({
      vendor_id: values.id,
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
          vendor_id: contactName || null,
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
        {vendor && (
          <div className="form_group">
            <span>Supplier</span>
            <PaginateSelectX
              report
              required
              size="large"
              name="vendor_id"
              allowClear={false}
              contactType="vendor"
              url={REPORT_CONTACT}
              placeholder="Select or Search Supplier"
              handleChange={(value) => handleVendorChange(value)}
            />
          </div>
        )}
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
            className="btn-primary w-96px h-36px"
            disabled={pagination.date_range === date && pagination?.contactId === vendorObj?.id}
          />
        </div>
      </Form>
    </div>
  );
};
export const FilterPopup = ({
  form,
  popOver,
  setApply,
  setparam,
  pagination,
  handleOpenChange,
  vendor = false,
}) => {
  return (
    <TooltipX title="Filter">
      <Popover
        title=""
        open={popOver}
        trigger="click"
        content={
          <SalesPersonFilters
            form={form}
            vendor={vendor}
            setApply={setApply}
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
