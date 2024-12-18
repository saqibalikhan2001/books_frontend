/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Radio, Input, Typography } from "antd";
import { endpoints } from "static";
import { SOSubmitProps } from "./Types";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, Spinner, Toast, Breadcrumbx } from "app/shared";

const { Title } = Typography;
const { SALES_ORDER_PREFERENCE } = endpoints;

const initialValues = {
  terms: "",
  so: "",
};

export const SalesOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_PreferenceEdit_permission } = checkPermission("PreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: SALES_ORDER_PREFERENCE,
    }).then((res: any) => {
      setHasContentLoading(false);
      const { preferences = {} } = res || {};
      let so_pref = "";
      if (preferences.invoice && preferences.shipment) so_pref = "both";
      else if (preferences.invoice) so_pref = "invoice";
      else if (preferences.shipment) so_pref = "shipment";

      form.setFieldsValue({ so: so_pref, terms: res?.terms || "" });
    });
    //eslint-disable-next-line
  }, [callAxios]);

  const handleSubmit = (values: SOSubmitProps) => {
    const { terms, so } = values;
    const status = { invoice: false, shipment: false };
    if (so === "both") {
      status.invoice = true;
      status.shipment = true;
    } else if (so === "invoice") status.invoice = true;
    else if (so === "shipment") status.shipment = true;
    toggle();
    callAxios({
      method: "put",
      url: SALES_ORDER_PREFERENCE,
      data: { status: { ...status }, terms },
    })
      .then((res) => {
        toggle();
        if (res) {
          Toast({ message: res?.message || "" });
        }
      })
      .catch(() => toggle());
  };

  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"80vh"}/>
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Sales order" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} initialValues={initialValues} onFinish={handleSubmit}>
              <Typography.Title level={4} className="form_heading">
                When do you want your Sales Orders to be closed?
              </Typography.Title>
              <div className="form_box">
                <Form.Item
                  name="so"
                  rules={[
                    {
                      required: true,
                      message: "Please pick an option",
                    },
                  ]}
                >
                  <Radio.Group className="mb-30">
                    <div className="radio_group">
                      <Radio value="invoice">When invoice is created</Radio>
                    </div>
                    <div className="radio_group">
                      <Radio value="shipment">When shipment is fulfilled</Radio>
                    </div>
                    <div className="radio_group mb-30">
                      <Radio value="both">When shipment is fulfilled and invoice is created</Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
              <Title level={4} className="form_heading">
                Terms & Conditions
              </Title>
              <div className="form_box">
                <div className="flexbox  form-row-container justify-content-between">
                  <div className="form_group flex-47 mb-18">
                    <Form.Item name="terms">
                      <Input.TextArea rows={4} showCount maxLength={1000} />
                    </Form.Item>
                  </div>
                </div>
                {has_PreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      btnText="Cancel"
                      htmlType="button"
                      className="btn-form-size btn-default mr-20"
                      clickHandler={() => navigate(-1)}
                    />
                    <Buttonx btnText="Save" className="btn-form-size btn-primary" loading={bool} />
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
