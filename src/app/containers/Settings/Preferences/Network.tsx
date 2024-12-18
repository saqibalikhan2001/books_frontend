/**@format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Switch, Typography } from "antd";
import { endpoints, Labels } from "static";
// import { rules } from "utils";
import { useAxios, useBool } from "app/Hooks";
import { Buttonx, InputNumberX, Spinner, Toast, Breadcrumbx } from "app/shared";

const initialState = {
  show_status: false,
  no_of_intervals: 0,
  waiting_time: 0,
};

export const NetworkPreference = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  // const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  // const { has_PreferenceEdit_permission } = checkPermission("PreferenceEdit");

  const show_status = Form.useWatch("show_status", form);

  useEffect(() => {
    callAxios({
      url: endpoints.NETWORK_PREFERENCE,
    }).then((res) => {
      setHasContentLoading(false);
      form.setFieldsValue({ ...res.preferences });
    });
    //eslint-disable-next-line
  }, []);

  const onSubmit = (values) => {
    let payload = {
      preference: {
        ...values,
        waiting_time: +values?.waiting_time,
        no_of_intervals: +values?.no_of_intervals,
      },
    };
    toggle();
    callAxios({
      method: "put",
      url: endpoints.NETWORK_PREFERENCE,
      data: payload,
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
        <div className="main_wrapper">
          <Breadcrumbx name="Network preference" className="navigate" setting={true} show />
          <div className="_container credit_note_policy_form">
            <Typography.Title level={4} className="form_heading">
              Network Preference
            </Typography.Title>
            <Form
              form={form}
              layout="vertical"
              name="create-role-form"
              initialValues={initialState}
              onFinish={onSubmit}
            >
              <div className="form_box">
                <div className="switch_group">
                  <Typography.Text className="switch-label">Show Status</Typography.Text>
                  <Form.Item name="show_status" className="switch-handle">
                    <Switch checked={show_status} className="switch-btn" />
                  </Form.Item>
                </div>

                <div className="flexbox form-row-container  justify-content-between">
                  <div className="form_group flex-47">
                    <Form.Item
                      name="no_of_intervals"
                      className="input_field pb-10"
                      label={<label className="form--label_style mb-5">Intervel time</label>}
                    >
                      <InputNumberX
                        allowDecimal
                        size="middle"
                        name="no_of_intervals"
                        stringMode={false}
                        onChange={(e) => {
                          form.setFieldValue("no_of_intervals", e.target.value);
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="form_group flex-47">
                    <Form.Item
                      name="waiting_time"
                      className="input_field pb-10"
                      label={<label className="form--label_style mb-5">Waiting time</label>}
                    >
                      <InputNumberX
                        allowDecimal
                        size="middle"
                        name="waiting_time"
                        stringMode={false}
                        onChange={(e) => {
                          form.setFieldValue("waiting_time", e.target.value);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* {has_PreferenceEdit_permission ? ( */}
                <div className="button_flexbox">
                  <Buttonx
                    htmlType="button"
                    btnText={Labels.CANCEL}
                    clickHandler={() => navigate(-1)}
                    className="btn-form-size btn-default mr-20"
                  />
                  <Buttonx
                    className="btn-form-size btn-primary btn_save"
                    btnText="Save"
                    loading={bool}
                  />
                </div>
                {/* ) : null} */}
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
