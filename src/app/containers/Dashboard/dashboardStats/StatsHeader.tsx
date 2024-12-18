import { Form, DatePicker } from "antd";
// import type { MenuProps } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import dayjs from "dayjs";
import { useStore } from "app/Hooks";
import { Selectx } from "app/shared";

const { RangePicker } = DatePicker;
const todayDate = dayjs(new Date());

export const StatsHeader = ({
  form,
  tittle,
  filter = false,
  remove_custom = false,
  remove_total = false,
}: {
  form?: any;
  tittle: any;
  filter?: boolean;
  remove_custom?: boolean;
  remove_total?: boolean;
}) => {
  const { org_date_format } = useStore();

  const date = Form.useWatch("date_range", form);

  const items = [
    {
      key: "0",
      id: "today",
      label: "Today",
    },
    {
      key: "1",
      id: "week",
      label: "This Week",
    },
    {
      key: "2",
      id: "month",
      label: "This Month",
    },
    {
      key: "3",
      id: "thirty_days",
      label: "Last 30 Days",
    },
    {
      key: "4",
      id: "six_months",
      label: "Last 6 Months",
    },
    {
      key: "5",
      id: "year",
      label: "This Year",
    },
    {
      key: "6",
      id: "last_year",
      label: "Last Year",
    },
    {
      key: "7",
      id: "total",
      label: "Total",
    },
    {
      key: "8",
      id: "custom",
      label: "Custom",
    },
  ];
  const itemFilter = [
    {
      key: "1",
      id: "quantity",
      label: "Quantity",
    },
    {
      key: "2",
      id: "amount",
      label: "Amount",
    },
  ];
  const filteredItems = items
    .filter((item) => (remove_custom ? item.id !== "custom" : true))
    .filter((item) => (remove_total ? item.id !== "total" : true))
    //@ts-ignore
    .sort((a, b) => a.key - b.key);

  return (
    <PageHeader
      className="stateHeader"
      title={tittle}
      extra={[
        // <div>
        //   <img
        //     alt="calender Icon"
        //     src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/calendar.svg"
        //   />
        // </div>,

        <>
          <Form
            className="d-flex gap-10"
            form={form}
            initialValues={{
              // date_range: preference ? preference : "total",
              custom_ranges: [todayDate, todayDate],
            }}
          >
            {filter && (
              <Selectx
                size="middle"
                // defaultValue={itemFilter?.[0]}
                className="dashboard-select-box"
                name="item_filter"
                showSearch={false}
                allowClear={false}
                popupClassName="tax_dropdown dropdown--scroll"
                placeholder="Select Preference"
                options={itemFilter}
                handleSort={false}
              />
            )}
            {/* fix BMS-3688 change the position of calender and filter drop-down to fix change filter position when user select custom and calender is visible*/}
            {date === "custom" && (
              <div className="form_group custom_range">
                <Form.Item name="custom_ranges">
                  <RangePicker
                    allowClear={false}
                    format={org_date_format}
                    popupClassName="tax_dropdown"
                    separator={<label>-</label>}
                    placeholder={[org_date_format, org_date_format]}
                  />
                </Form.Item>
              </div>
            )}
            <Selectx
              size="middle"
              name="date_range"
              showSearch={false}
              className="dashboard-select-box"
              allowClear={false}
              popupClassName="tax_dropdown dropdown--scroll"
              placeholder="Select date"
              // options={items}
              options={filteredItems}
              handleSort={false}
            />
            {/* <Form.Item name="date_range">
            <Dropdown
              trigger={["click"]}
              menu={{ items }}
              getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
            >
              <div
                className="btn-primary btn-trascation generic-dropdown-icon"
                // style={{ cursor: data?.is_active === 0 ? "not-allowed" : "" }}
              >
                {/* New transaction }
                <img
                  alt="dropdown"
                  className=" ml-10"
                  src="https://s3-us-west-2.amazonaws.com/ims-development/static/media/dropdown.svg"
                />
              </div>
            </Dropdown>
          </Form.Item> */}
          </Form>
        </>,
      ]}
    />
  );
};
