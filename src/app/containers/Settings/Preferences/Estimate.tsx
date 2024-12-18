/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Radio, Input, Typography, Checkbox } from "antd";
import { endpoints } from "static";
import { SOSubmitProps } from "./Types";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, Spinner, Toast, Breadcrumbx, Selectx, InputNumberX, TooltipX } from "app/shared";

const { Title } = Typography;
const { ESTIMATE_PREFERENCE } = endpoints;

const initialValues = {
  terms: "",
  estimate_to_invoice_status: "",
  estimate_to_saleorders_status: "",
  E_time: 1,
  E_duration: "day",
  time: 1,
  duration: "day",
};

const durationOptions = [
  { label: "Day (s)", value: "day" },
  { label: "Week (s)", value: "week" },
  { label: "Month (s)", value: "month" },
  { label: "Year (s)", value: "year" },
];

export const Estimate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_EstimatePreferenceEdit_permission } = checkPermission("EstimatePreferenceEdit");
  const show_admin_records = Form.useWatch("show_admin_records", form);
  const E_duration = Form.useWatch("E_duration", form);
  const duration = Form.useWatch("duration", form);

  const time = Form.useWatch("time", form);
  const E_time = Form.useWatch("E_time", form);

  useLayoutEffect(() => {
    callAxios({
      url: ESTIMATE_PREFERENCE,
    }).then((res: any) => {
      setHasContentLoading(false);
      const { preferences = {}, terms = "" } = res || {};
      form.setFieldsValue({
        ...preferences,
        terms,
        E_time: Number(preferences.maximum_estimate_age?.split(" ")?.[0] || 1),
        E_duration: preferences.maximum_estimate_age?.split(" ")?.[1] || "day",
        time: Number(preferences.estimate_expiry_age?.split(" ")?.[0] || 1),
        duration: preferences.estimate_expiry_age?.split(" ")?.[1] || "day",
      });
    });
    //eslint-disable-next-line
  }, []);

  const handleSubmit = (values: SOSubmitProps) => {
    let payload = {
      status: {
        estimate_to_invoice_status: values?.estimate_to_invoice_status,
        estimate_to_saleorders_status: values?.estimate_to_saleorders_status,
        maximum_estimate_age_value: values?.E_time,
        maximum_estimate_age_type: values.E_duration,
        estimate_expiry_age_value: values?.time,
        estimate_expiry_age_type: values.duration,
        show_admin_records: values?.show_admin_records,
      },
      terms: values.terms,
    };
    toggle();
    callAxios({
      method: "put",
      url: ESTIMATE_PREFERENCE,
      data: payload,
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res?.message || "" });
        }
      })
      .catch(() => toggle());
  };
  const handleTerms = (e, name) => {
    e.preventDefault();

    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    form.setFieldValue(name, formattedValue);
  };

  const validateEtime = () => {
    if (E_time && E_time <= 0) {
      return Promise.reject(`value must be greater than 0 `);
    }
    if (E_duration === "year" && E_time && E_time > 9) {
      return Promise.reject(`maximun value is 9 `);
    }
    if (E_duration !== "year" && E_time && E_time > 99) {
      return Promise.reject(`maximum value is 99 `);
    }
    return Promise.resolve();
  };
  const validatetime = () => {
    if (time && time <= 0) {
      return Promise.reject(`value must be greater than 0 `);
    }
    if (duration === "year" && time && time > 9) {
      return Promise.reject(`maximun value is 9 `);
    }
    if (duration !== "year" && time && time > 99) {
      return Promise.reject(`maximum value is 99 `);
    }
    return Promise.resolve();
  };
  return (
    <>
      {/* <PageHeader
        style={{ boxShadow: "0px 2px lightgray" }}
        title="Estimate"
        extra={
          <Button key="1" type="link" icon={<VscClose size={25} />} onClick={() => navigate(-1)} />
        }
      /> */}
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Estimate" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} initialValues={initialValues} onFinish={handleSubmit}>
              <Title className="form_heading" level={4}>
                Invoice status through Estimate
              </Title>
              <div className="form_box mb-30">
                <Form.Item
                  name="estimate_to_invoice_status"
                  rules={[
                    {
                      required: true,
                      message: "Please pick an option",
                    },
                  ]}
                >
                  <Radio.Group className="mb-25">
                    {/* <div className="radio_group">
                      <Radio value="no">No</Radio>
                    </div> */}
                    <div className="radio_group">
                      <Radio value="draft">
                        Draft
                        <TooltipX
                          overlayClassName={"overlap"}
                          title=" Invoice will be saved as a Draft"
                        >
                          <img
                            alt="info icon"
                            className="ml-10  _info_icon--hover"
                            // onClick={toggleItemDetailInfoModal}
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/info.svg`}
                          />
                        </TooltipX>
                      </Radio>
                    </div>
                    <div className="radio_group">
                      <Radio value="send">
                        Sent
                        <TooltipX
                          overlayClassName={"overlap"}
                          title=" Invoice will be sent to your customer and status will be sent if customer had an email"
                        >
                          <img
                            alt="info icon"
                            className="ml-10  _info_icon--hover"
                            // onClick={toggleItemDetailInfoModal}
                            src={`${
                              import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                            }/static/media/info.svg`}
                          />
                        </TooltipX>
                      </Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
              {/* <Title className="form_heading" level={4}>
                Automatically convert an estimate to Sale Order ?
              </Title> */}
              <div className="form_box mb-30">
                {/* <Form.Item
                  name="estimate_to_saleorders_status"
                  rules={[
                    {
                      required: true,
                      message: "Please pick an option",
                    },
                  ]}
                >
                  <Radio.Group className="mb-25">
                    <div className="radio_group">
                      <Radio value="no">No</Radio>
                    </div>
                    <div className="radio_group">
                      <Radio value="draft">
                        Yes, create SaleOrder as Draft
                        <Text type="secondary">(SaleOrder will be saved as a Draft)</Text>
                      </Radio>
                    </div>
                    <div className="radio_group">
                      <Radio value="send">
                        Yes, create and send
                        <Text type="secondary">(SaleOrder will be sent to your customer)</Text>
                      </Radio>
                    </div>
                  </Radio.Group>
                </Form.Item> */}
                <div className="d-flex max_estimate_expire">
                  <label style={{ marginTop: 8 }}>
                    <b>Duration after Accepted estimate will be expired: </b> &nbsp;
                  </label>
                  <Form.Item
                    name="E_time"
                    className="estimates-field mr-20"
                    rules={[
                      { required: true, message: "value is required" },
                      { validator: validateEtime },
                    ]}
                  >
                    <InputNumberX
                      id="E_time"
                      value={E_time}
                      onChange={(value) => form.setFieldValue("E_time", value)}
                    />
                  </Form.Item>
                  {/* <div style={{ width: "20%" }}> */}
                  {/* <Form.Item name="E_duration" className="estimates-duration"> */}
                  <Selectx
                    // popupClassName="dropdown-width"
                    valueLabel
                    size="large"
                    name="E_duration"
                    allowClear={false}
                    showSearch={false}
                    defaultValue="day"
                    className="mb-18 dropdown-width"
                    options={durationOptions}
                    handleChange={form.validateFields(["E_time"])}
                  />
                </div>
                <div className="d-flex min_estimate_expire">
                  <label style={{ marginTop: 8 }}>
                    <b> Default expiration Time: </b> &nbsp;
                  </label>
                  <Form.Item
                    name="time"
                    className="estimates-field mr-20"
                    rules={[
                      { required: true, message: "value is required" },
                      { validator: validatetime },
                    ]}
                  >
                    <InputNumberX
                      id="time"
                      value={time}
                      // onBlur={() => {
                      //   if (!depreciation_amount) form.setFieldValue("depreciation_amount", 0);
                      // }}
                      onChange={(value) => form.setFieldValue("time", value)}
                    />
                  </Form.Item>
                  <Selectx
                    valueLabel
                    size="large"
                    name="duration"
                    showSearch={false}
                    allowClear={false}
                    defaultValue="day"
                    className="mb-18 dropdown-width "
                    options={durationOptions}
                    handleChange={form.validateFields(["time"])}
                  />
                </div>
              </div>
              <Typography.Title level={4} className="form_heading mb-10">
                Sales Person
              </Typography.Title>
              <Form.Item className="sale_person" name="show_admin_records" valuePropName="checked">
                <div className="sale_checkbox">
                  <Checkbox checked={show_admin_records} name="show_admin_records" />
                  <span style={{ marginLeft: "15px" }} className="admin-block">
                    Show Admin Related Entries To Sales Manager
                  </span>
                  <span className="ml-5" style={{ color: "red" }}>
                    (This Is Directly Linked To The User Permissions & Roles. Be careful when
                    selecting it)
                  </span>
                </div>
              </Form.Item>
              <Title level={4} className="form_heading">
                Terms & Conditions
              </Title>
              <div className="form_box">
                <div className="flexbox  form-row-container  justify-content-between">
                  <div className="form_group flex-47 mb-18">
                    <Form.Item name="terms">
                      <Input.TextArea
                        onChange={(e) => handleTerms(e, "terms")}
                        showCount
                        rows={4}
                        maxLength={1000}
                      />
                    </Form.Item>
                  </div>
                </div>
                {has_EstimatePreferenceEdit_permission ? (
                  <>
                    <div className="button_flexbox">
                      <Buttonx
                        btnText="Cancel"
                        type="default"
                        htmlType="button"
                        className="btn-form-size btn-default mr-20"
                        clickHandler={() => navigate(-1)}
                      />
                      <Buttonx
                        btnText="Save"
                        loading={bool}
                        className="btn-form-size btn-primary"
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
