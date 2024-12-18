/** @format */

import { DatePicker, Form, Popover } from "antd";
import dayjs from "dayjs";
import { Content } from "static";
import { useStore } from "app/Hooks";
import { getFullDate, rules } from "utils";
import { date_range } from "./filterOptions";
import { Buttonx, Selectx, TooltipX } from "app/shared";

const { RangePicker } = DatePicker;

const todayDate = dayjs(new Date());

export const Filters = ({ form, setparam, pagination, handleOpenChange }) => {
  const { org_date_format } = useStore();
  const date = Form.useWatch("date_range", form);

  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      date_range: values?.date_range ?? "",
      start_range: values?.custom_ranges ? `${getFullDate(values?.custom_ranges[0])} 00:00:00` : "",
      end_range: values.custom_ranges ? `${getFullDate(values?.custom_ranges[1])} 23:59:59` : "",
    });
    handleOpenChange(false);
  };

  return (
    <div className="_generic_popupover_main">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date_range: pagination?.date_range || "this_week",
          custom_ranges:
            pagination.date_range === "custom"
              ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)]
              : [todayDate, todayDate],
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
            popupClassName="overlap dropdown--scroll"
            placeholder="Select date"
            options={date_range.sort((a, b) => a.key - b.key)}
          />
        </div>
        {date === "custom" && (
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
        )}
        <div className="d-flex _generic_popupover_actions">
          <Buttonx
            className="btn-default mr-15 w-96px h-36px"
            type="text"
            disabled={date === null}
            clickHandler={() => {
              form.setFieldsValue({
                date_range: null,
              });
            }}
            btnText="Reset"
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
          <Filters
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
