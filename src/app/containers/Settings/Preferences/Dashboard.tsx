/**@format */

import { useCallback, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Typography } from "antd";
import { endpoints, Labels } from "static";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, Selectx, Spinner, Toast, Breadcrumbx } from "app/shared";

const { DASHBOARD_PREFERNCE } = endpoints;

const salesOrderSummary = [
  {
    id: "today",
    label: "Today",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "week",
    label: "This Week",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "month",
    label: "This Month",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "thirty_days",
    label: "Last 30 Days",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "six_months",
    label: "Last 6 Months",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "year",
    label: "This Year",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "last_year",
    label: "Last Year",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "total",
    label: "Total",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
  {
    id: "custom",
    label: "Custom",
    // onClick: (id) => this.handleSalesOrderSummary(id),
  },
];

const dateRangeList = [
  {
    id: "today",
    label: "Today",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "week",
    label: "This Week",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "month",
    label: "This Month",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "thirty_days",
    label: "Last 30 Days",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "six_months",
    label: "Last 6 Months",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "year",
    label: "This Year",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "last_year",
    label: "Last Year",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "total",
    label: "Total",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "custom",
    label: "Custom",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
];

const salepurchasedateRangeList = [
  {
    id: "today",
    label: "Today",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "week",
    label: "This Week",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "month",
    label: "This Month",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "thirty_days",
    label: "Last 30 Days",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "six_months",
    label: "Last 6 Months",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "year",
    label: "This Year",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "last_year",
    label: "Last Year",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
  {
    id: "custom",
    label: "Custom",
    // onClick: (id) => this.handleDateRangeFilter(id),
  },
];
export const Dashboard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_DashboardPreferenceEdit_permission } = checkPermission("DashboardPreferenceEdit");

  const fetchPreferences = useCallback(() => {
    callAxios({
      url: DASHBOARD_PREFERNCE,
    })
      .then((res) => {
        setHasContentLoading(false); // Stop the loading spinner
        form.setFieldsValue({
          ...res.preferences,
        });
      })
      .catch(() => {
        setHasContentLoading(false); // Stop loading in case of error as well
      });
  }, [form]);

  useLayoutEffect(() => {
    // Set a timeout for 20 seconds before showing the component
    const timer = setTimeout(() => {
      fetchPreferences(); // Fetch data after component is shown
    }, 2000); // 20000 milliseconds = 20 seconds

    return () => clearTimeout(timer); // Clear timeout if the component is unmounted before 20 seconds
    //eslint-disable-next-line
  }, [fetchPreferences]);

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: DASHBOARD_PREFERNCE,
      data: {
        status: {
          currPrefrences: {
            ...values,
            package_and_shipment: "total",
          },
        },
      },
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res.message });
        }
      })
      .catch(() => toggle());
  };

  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper preference_form preference_dashboard_form">
          <Breadcrumbx name="Dashboard" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {/* <div className="form_group">
                <Image
                  preview={false}
                  style={{ width: 30 }}
                  src={"https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}
                  fallback="https://cdn-icons-png.flaticon.com/512/456/456283.png"
                />
                <Typography.Text>Organization Name</Typography.Text>
              </div> */}
              <Typography.Title level={4} className="form_heading">
                Sales & Purchase
              </Typography.Title>
              <div className="form_box">
                <div className="flexbox form-row-container justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      options={dateRangeList}
                      name="sales_information"
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.ESTIMATES_INFORMATION}</label>}
                    />
                  </div>
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      options={dateRangeList}
                      name="purchase_information"
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.PURCHASE_INFORMATION}</label>}
                    />
                    {/* <Selectx
                      size="large"
                      allowClear={false}
                      options={dateRangeList}
                      name="package_and_shipment"
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.PACKAGE_AND_SHIPMENT}</label>}
                    /> */}
                  </div>
                </div>
              </div>
              <Typography.Title level={4} className="form_heading">
                Receivables & Payables
              </Typography.Title>
              <div className="form_box">
                <div className="flexbox form-row-container justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      name="payable"
                      allowClear={false}
                      options={dateRangeList}
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.PAYABLES}</label>}
                    />
                  </div>
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      name="receivables"
                      allowClear={false}
                      options={dateRangeList}
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.RECEIVABLES}</label>}
                    />
                  </div>
                </div>
              </div>
              <Typography.Title level={4} className="form_heading">
                Top Products & Customers
              </Typography.Title>
              <div className="form_box">
                <div className="flexbox form-row-container justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      name="top_customers"
                      options={dateRangeList}
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.TOP_CUSTOMER}</label>}
                    />
                  </div>

                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      name="top_selling_items"
                      options={dateRangeList}
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.TOP_SELLING_ITEM}</label>}
                    />
                  </div>
                </div>
              </div>
              <Typography.Title level={4} className="form_heading">
                Sales
              </Typography.Title>
              <div className="form_box">
                <div className="flexbox form-row-container justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      options={salepurchasedateRangeList}
                      name="sales_vs_purchase"
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.SALES_VS_PURCHASE}</label>}
                    />
                  </div>

                  {/* <div className="flexbox form-row-container justify-content-between mb-10"> */}
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      name="sales_order_summary"
                      options={salesOrderSummary}
                      className="input_field dropdown--scroll"
                      placeholder={Labels.SELECT_TIME_PERIOD}
                      label={<label>{Labels.SALES_ORDER_SUMMARY}</label>}
                    />
                  </div>
                </div>
                {/* </div> */}
                {has_DashboardPreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      btnText="Cancel"
                      htmlType="button"
                      className="btn-default btn-form-size mr-20 dropdown--scroll"
                      clickHandler={() => navigate(-1)}
                    />
                    <Buttonx btnText="Save" className="btn-primary btn-form-size" loading={bool} />
                  </div>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

// export const dateRangeList2 = [
//   {
//     id: "today",
//     label: "Today",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "week",
//     label: "This Week",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "thirty_days",
//     label: "Last 4 Weeks",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "month",
//     label: "This Month",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "six_months",
//     label: "Last 6 Months",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "year",
//     label: "This Year",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   {
//     id: "last_year",
//     label: "Last Year",
//     // onClick: (id) => this.handleDateRangeFilter(id),
//   },
//   // {
//   //   id: 'custom',
//   //   label: 'Custom',
//   // onClick: (id) => this.handleDateRangeFilter(id),
//   // },
// ];

// export const filters = [
//   {
//     id: "quantity",
//     label: "Quantity",
//     // onClick: (id) => this.handleFilter(id),
//   },
//   {
//     id: "amount",
//     label: "Amount",
//     // onClick: (id) => this.handleFilter(id),
//   },
// ];
