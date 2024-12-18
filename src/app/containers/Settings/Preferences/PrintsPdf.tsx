/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Typography, Switch } from "antd";
import { endpoints } from "static";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Spinner, Toast, Breadcrumbx, Buttonx } from "app/shared";

const { Text } = Typography;
const { PREFERENCES, PDF_SETTINGS } = endpoints;

export const PrintsPdf = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_PrintPreferenceEdit_permission } = checkPermission("PrintPreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: `${PREFERENCES}${PDF_SETTINGS}`,
    }).then((res) => {
      setHasContentLoading(false);
      const { preferences = {} } = res || {};
      form.setFieldsValue({
        ...preferences,
      });
    });
    //eslint-disable-next-line
  }, []);

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: `${PREFERENCES}${PDF_SETTINGS}`,
      data: { status: { ...values } },
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
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Prints and PDF" className="navigate" setting={true} show />
          <div className="_container">
            <Typography.Title level={4} className="form_heading">
              Prints and PDF
            </Typography.Title>
            {/* <Text strong>Prints and PDF</Text> */}
            <div className="form_box">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div className="switch_group mb-20">
                  <Text className="switch-label">Display license number in prints and PDF?</Text>
                  <Form.Item name="license_no" valuePropName="checked" className="switch-handle">
                    <Switch className="switch-btn" />
                  </Form.Item>
                </div>
                <div className="switch_group mb-40">
                  <Text className="switch-label">Display country in print and PDF?</Text>
                  <Form.Item name="country" valuePropName="checked" className="switch-handle">
                    <Switch className="switch-btn" />
                  </Form.Item>
                </div>
                {has_PrintPreferenceEdit_permission ? (
                  <div className="button_flexbox mt-33">
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
                      className="btn-form-size btn-primary btn_save"
                    />
                  </div>
                ) : null}
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
