/**@format */
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Form, Input, Typography } from "antd";
import { endpoints } from "static";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, Spinner, Toast, Breadcrumbx } from "app/shared";
const { Text } = Typography;
const { INVOICE_PREFERENCE } = endpoints;
const initialValues = {
  terms: "",
  show_admin_records: false,
};
export const Invoice = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_InvoicePreferenceEdit_permission } = checkPermission("InvoicePreferenceEdit");
  const show_admin_records = Form.useWatch("show_admin_records", form);
  useLayoutEffect(() => {
    callAxios({
      url: INVOICE_PREFERENCE,
    }).then((res: any) => {
      setHasContentLoading(false);
      form.setFieldsValue({
        terms: res?.terms || "",
        show_admin_records: res?.preferences?.show_admin_records,
      });
    });
    //eslint-disable-next-line
  }, [callAxios]);
  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: INVOICE_PREFERENCE,
      data: {
        status: { email_notification: "once", show_admin_records: values?.show_admin_records },
        terms: values?.terms,
      },
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
        <div className="main_wrapper">
          <Breadcrumbx name="Invoice & Sale receipt" className="navigate" setting={true} show />
          <div className="_container">
            <Form form={form} initialValues={initialValues} onFinish={handleSubmit}>
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
              <div className="flexbox form-row-container  justify-content-between invoice-form-container">
                <div className="form_group flex-47">
                  <Text className="switch-label mb-10 d-block">
                    Terms and conditions to be displayed on invoice
                  </Text>
                  <Form.Item name="terms" className="mb-15">
                    <Input.TextArea onChange={handleTerms} showCount rows={4} maxLength={1000} />
                  </Form.Item>
                </div>
              </div>
              {has_InvoicePreferenceEdit_permission ? (
                <>
                  <div className="button_flexbox">
                    <Buttonx
                      btnText="Cancel"
                      type="default"
                      htmlType="button"
                      className="btn-form-size btn-default mr-20"
                      clickHandler={() => navigate(-1)}
                    />
                    <Buttonx btnText="Save" className="btn-form-size btn-primary" loading={bool} />
                  </div>
                </>
              ) : null}
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
