/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Radio, Input, Typography } from "antd";
import { endpoints } from "static";
import { POSubmitProps } from "./Types";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, Spinner, Toast, Breadcrumbx } from "app/shared";
// import { PageHeader } from "@ant-design/pro-layout";

// const { VscClose } = Icons;
const { Title } = Typography;
const { PURCHASE_ORDER_PREFERENCE } = endpoints;

const initialValues = {
  po: "",
  terms: "",
};

export const PurchaseOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_PreferenceEdit_permission } = checkPermission("PreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: PURCHASE_ORDER_PREFERENCE,
    }).then((res: any) => {
      setHasContentLoading(false);
      const { preferences = {} } = res || {};
      let po_pref = "";
      if (preferences.bill && preferences.receive) po_pref = "both";
      else if (preferences.bill) po_pref = "bill";
      else if (preferences.receive) po_pref = "receive";

      form.setFieldsValue({ po: po_pref, terms: res?.terms || "" });
    });
    //eslint-disable-next-line
  }, [callAxios]);

  const handleSubmit = (values: POSubmitProps) => {
    toggle();
    const { terms, po } = values;
    const status = { bill: false, receive: false };
    if (po === "both") {
      status.bill = true;
      status.receive = true;
    } else if (po === "bill") status.bill = true;
    else if (po === "receive") status.receive = true;
    callAxios({
      method: "put",
      url: PURCHASE_ORDER_PREFERENCE,
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
      {/* <PageHeader
        style={{ boxShadow: "0px 2px lightgray" }}
        title="Purchase Order"
        extra={
          <Button key="1" type="link" icon={<VscClose size={25} />} onClick={() => navigate(-1)} />
        }
      /> */}
      {hasContentLoading ? (
        <Spinner directionSize={"80vh"}/>
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Purchase order" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} initialValues={initialValues} onFinish={handleSubmit}>
              <Title level={4} className="form_heading">
                When do you want your Purchase Orders to be closed?
              </Title>
              <div className="form_box">
                <Form.Item
                  name="po"
                  rules={[
                    {
                      required: true,
                      message: "Please pick an option",
                    },
                  ]}
                >
                  <Radio.Group className="mb-25">
                    <div className="radio_group">
                      <Radio value="bill">When Purchase Order is fully Billed</Radio>
                    </div>
                    <div className="radio_group">
                      <Radio value="receive">When shipment is fulfilled</Radio>
                    </div>
                    <div className="radio_group mb-30">
                      <Radio value="both">
                        When Purchase Order is both fully Received and Billed
                      </Radio>
                    </div>
                  </Radio.Group>
                </Form.Item>
              </div>
              <Title level={4} className="form_heading">
                Terms & Conditions
              </Title>
              <div className="form_box">
                <div className="flexbox  form-row-container  justify-content-between">
                  <div className="form_group flex-47 mb-18">
                    <Form.Item name="terms">
                      <Input.TextArea showCount rows={4} maxLength={1000} />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="form_box">
                {has_PreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      className="btn-form-size btn-default mr-20"
                      btnText="Cancel"
                      htmlType="button"
                      clickHandler={() => navigate(-1)}
                    />
                    <Buttonx btnText="Save" loading={bool} className="btn-form-size btn-primary" />
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
