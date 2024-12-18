/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Typography, Switch } from "antd";
import { TooltipX } from "app/shared/ToolTip";
import { Content, endpoints, Labels } from "static";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { useGetInvoiceTermsListQuery } from "store/query/invoice";
import { Buttonx, Spinner, Toast, Breadcrumbx } from "app/shared";

const { Title, Text } = Typography;
const { BILL_PREFERENCE } = endpoints;

const initialValues = {
  terms: "",
  is_billable: false,
  payment_terms_id: null,
  bill_no_notification: false,
};

export const Bill = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { data: terms = [] } = useGetInvoiceTermsListQuery("");
  const { has_BillPreferenceEdit_permission } = checkPermission("BillPreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: BILL_PREFERENCE,
    }).then((res) => {
      setHasContentLoading(false);
      form.setFieldsValue({
        ...res.preferences,
        payment_terms_id: terms?.find((term) => res?.preferences?.payment_terms_id === term?.id)
          ? res?.preferences?.payment_terms_id
          : null,
        terms: res?.terms || "",
      });
    });
    //eslint-disable-next-line
  }, [callAxios, terms]);

  const handleSubmit = (values) => {
    const payload = {
      status: {
        is_billable: values.is_billable,
        payment_terms_id: values.payment_terms_id,
        bill_no_notification: values.bill_no_notification,
        payment_terms_name: terms.find((term) => term.id === values.payment_terms_id)?.name,
      },
      terms: values.terms,
    };
    toggle();
    callAxios({
      method: "put",
      url: BILL_PREFERENCE,
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
  const handleTerms = (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");

    form.setFieldValue("terms", formattedValue);
  };
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper preference_expense_form">
          <Breadcrumbx name="Bill" className="navigate" setting={true} show />
          <div className="_container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={initialValues}
            >
              <Title level={4} className="form_heading">
                {Labels.TERMS_AND_CONDITIONS}
              </Title>
              <div className="form_box">
                <div className="flexbox form-row-container  justify-content-between">
                  {/* <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      options={terms}
                      loading={isLoading}
                      className="input_field dropdown--scroll"
                      name="payment_terms_id"
                      placeholder={Labels.PAYMENT_TERM_ID_PLACEHOLDER}
                      label={<label>{Labels.DEFAULT_BILL_PAYMENT_TERMS}</label>}
                      popupClassName="scroll_visible"
                      // disabled={!status}
                      // rules={rules({ message: Content.enter_country_name })}
                    />
                  </div> */}
                </div>
                <div className="switch_group bill-tab">
                  <Text className="switch-label">{Content.prefernece_bill_number_warning}</Text>
                  <Form.Item
                    valuePropName="checked"
                    className="switch-handle"
                    name="bill_no_notification"
                  >
                    <Switch className="switch-btn" />
                  </Form.Item>
                </div>
                <div className="switch_group bill-tab">
                  <div className="align_label">
                    <Text className="switch-label">{Content.make_expense_and_item_billable}</Text>
                    <TooltipX title={Content.expense_and_item_billable_tooltip}>
                      <img
                        className="ml-10 hover-effect"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/tooltip.svg`}
                        alt="tooltip icon"
                      ></img>
                    </TooltipX>
                  </div>
                  <Form.Item name="is_billable" valuePropName="checked" className="switch-handle">
                    <Switch className="switch-btn" />
                  </Form.Item>
                </div>
                <div className="flexbox form-row-container  justify-content-between">
                  <div className="form_group flex-47 mb-20">
                    <Text className="switch-label d-block mb-10">
                      {Content.term_and_condition_to_be_displayed}
                    </Text>
                    <Form.Item name="terms">
                      <Input.TextArea onChange={handleTerms} showCount rows={4} maxLength={1000} />
                    </Form.Item>
                  </div>
                </div>
                {has_BillPreferenceEdit_permission ? (
                  <>
                    <div className="button_flexbox">
                      <Buttonx
                        type="default"
                        btnText="Cancel"
                        htmlType="button"
                        clickHandler={() => navigate(-1)}
                        className="btn-form-size btn-default mr-20"
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
