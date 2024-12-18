/** @format */

import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { Content, endpoints } from "static";
import { getFullDate, rules } from "utils";
import { useAxios, useStore } from "app/Hooks";
import { Buttonx, PaginateSelectX, Selectx, Toast } from "app/shared";

const { RangePicker } = DatePicker;
const todayDate = dayjs(new Date());
const { INVOICE_CONTACTS, FILTER_PREFERENCE } = endpoints;

export const CreditNoteFilters = ({
  form,
  pagination,
  handleOpenChange,
  setparam,
  refetch,
  filterPreference,
}) => {
  const { callAxios } = useAxios();
  const { org_date_format } = useStore();
  const status = Form.useWatch("status", form);
  const date = Form.useWatch("date_range", form);
  const customer_id = Form.useWatch("customer_id", form);
  const custom_range = Form.useWatch("custom_ranges", form);
  const start_date = pagination.start_range.split(" ")[0] ?? "";
  const end_date = pagination.end_range.split(" ")[0] ?? "";

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
  let date_range = [...filterPreference?.date_range?.options];
  let status_options = [...filterPreference?.status?.options];
  let contactName = JSON.parse(sessionStorage.getItem("contactName") as any) || null;

  const handleSave = () => {
    const values = form.getFieldsValue();
    const payload = {
      slug: "credit_notes",
      preferences: [
        {
          slug: "date_range",
          id: values.date_range ?? "",
          start: values?.custom_ranges ? `${getFullDate(values?.custom_ranges[0])} 00:00:00` : "",
          end: values.custom_ranges ? `${getFullDate(values?.custom_ranges[1])} 23:59:59` : "",
        },
        {
          slug: "customer_id",
          id: values?.customer_id ?? "",
        },
        {
          slug: "status",
          id: values?.status,
        },
      ],
    };
    callAxios({
      method: "post",
      url: FILTER_PREFERENCE,
      data: payload,
    }).then((res) => {
      if (res) {
        Toast({ message: res?.message || "" });
        refetch();
      }
    });
  };
  const handleApply = () => {
    const values = form.getFieldsValue();
    setparam({
      ...pagination,
      status: values?.status,
      date_range: values?.date_range ?? "",
      start_range: values?.custom_ranges ? `${getFullDate(values?.custom_ranges[0])} 00:00:00` : "",
      end_range: values.custom_ranges ? `${getFullDate(values?.custom_ranges[1])} 23:59:59` : "",
      contactId: contactName?.id ?? "",
      is_applied: "true",
    });
    handleOpenChange(false);
  };
  return (
    <div className="_generic_popupover_main date_seprator_gap--fix">
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        initialValues={{
          date_range: pagination.date_range || null,
          status: pagination?.status || "all",
          custom_ranges:
            pagination.date_range === "custom"
              ? [dayjs(pagination?.start_range), dayjs(pagination?.end_range)]
              : [todayDate, todayDate],
          customer_id: contactName,
        }}
        // onFinish={(values) => {
        //   setparam({
        //     ...pagination,
        //     status: values?.status,
        //     date_range: values?.date_range ?? "",
        //     start_range: values.custom_ranges
        //       ? `${getFullDate(values.custom_ranges[0])} 00:00:00`
        //       : "",
        //     end_range: values.custom_ranges
        //       ? `${getFullDate(values.custom_ranges[1])} 23:59:59`
        //       : "",
        //     contactId: values?.customer_id?.id ?? "",
        //   });
        //   handleOpenChange(false);
        //   //   refetch();
        //   // });
        // }}
      >
        <div className="form_group  mb-20">
          <Selectx
            valueLabel
            allowClear={false}
            size="large"
            name="date_range"
            handleSort={false}
            label={filterPreference?.date_range?.label}
            // dropdownStyle={{ maxHeight: '260px'}}
            popupClassName="overlap dropdown--scroll"
            className="adjustment-field"
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
        <div className="form_group  mb-20">
          <label>{filterPreference?.customer_id?.label}</label>
          <PaginateSelectX
            allowClear={false}
            size="large"
            required={false}
            name="customer_id"
            url={INVOICE_CONTACTS}
            placeholder="Select or Search Customer"
            handleChange={(value) => handleCustomerChange(value)}
          />
        </div>
        <div className="form_group  mb-20">
          <Selectx
            valueLabel
            allowClear={false}
            size="large"
            name="status"
            handleSort={false}
            popupClassName="overlap"
            className="adjustment-field"
            placeholder="Select status"
            label={filterPreference?.status?.label}
            options={status_options.sort((a, b) => a.key - b.key)}
          />
        </div>
        <div className="d-flex _generic_popupover_actions">
          {import.meta.env.VITE_SHOW_SAVE === "true" && (
            <Buttonx
              btnText="Save"
              clickHandler={handleSave}
              className="btn-default space-right w-86px h-36px mr-10"
            />
          )}
          <Buttonx
            type="text"
            btnText="Reset"
            className="btn-default mr-10 w-96px h-36px"
            disabled={
              status === "all" &&
              date === null &&
              !(typeof contactName === "object" && contactName !== null)
            }
            clickHandler={() => {
              form.setFieldsValue({
                date_range: null,
                status: "all",
                customer_id: null,
                custom_ranges: [todayDate, todayDate],
              });
              sessionStorage.removeItem("contactName");
            }}
          />
          <Buttonx
            btnText="Apply"
            clickHandler={handleApply}
            className="btn-primary w-96px h-36px"
            disabled={
              pagination.status === status &&
              pagination.date_range === date &&
              pagination.date_range === "custom" &&
              start_date === getFullDate(custom_range?.[0]) &&
              pagination.date_range === "custom" &&
              end_date === getFullDate(custom_range?.[1]) &&
              Boolean(pagination.contactId) === Boolean(customer_id)
            }
          />
        </div>
      </Form>
    </div>
  );
};
