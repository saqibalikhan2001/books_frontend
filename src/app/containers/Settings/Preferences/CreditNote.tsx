/**@format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Switch, Typography } from "antd";
import { endpoints, Labels } from "static";
// import { rules } from "utils";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Buttonx, InputNumberX, Selectx, Spinner, Toast, Breadcrumbx } from "app/shared";

const initialState = {
  status: false,
  adjustment: 0,
  adjustement_criteria: null,
};

export const CreditNote = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [deductionTypes, setDeductionTypes] = useState<any>();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_CreditNotePreferenceEdit_permission } = checkPermission("CreditNotePreferenceEdit");

  const status = Form.useWatch("status", form);
  const adjustment = Form.useWatch("adjustment", form);
  const adjustement_criteria = Form.useWatch("adjustement_criteria", form);

  useEffect(() => {
    Promise.all([
      callAxios({
        url: endpoints.CREDIT_NOTE_PRFERENCE,
      }),
      callAxios({
        url: endpoints.SALE_RETURN_PREFERNCE,
      }),
    ]).then((res) => {
      setHasContentLoading(false);
      form.setFieldsValue({ ...res[0].preferences });
      setDeductionTypes(
        res[1].map((type) => ({
          id: type.value,
          label: type.label,
        }))
      );
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (adjustement_criteria === "percent" && form.getFieldValue("adjustment") > 100) {
      form.setFieldValue("adjustment", 100.0);
    }
  }, [adjustement_criteria]);

  const onSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: endpoints.CREDIT_NOTE_PRFERENCE,
      data: { status: values },
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
          <Breadcrumbx name="Credit note" className="navigate" setting={true} show />
          <div className="_container credit_note_policy_form">
            <Typography.Title level={4} className="form_heading">
              Credit note Policy
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
                  <Typography.Text className="switch-label">
                    {Labels.CREDIT_NOTE_DEDUCTION}
                  </Typography.Text>
                  <Form.Item name="status" className="switch-handle">
                    <Switch checked={status} className="switch-btn" />
                  </Form.Item>
                </div>
                <Typography.Text strong className="mb-10 d-block">
                  {Labels.CREDIT_NOTE_DEDUCTION_POLICY}
                </Typography.Text>
                <div className="flexbox form-row-container  justify-content-between">
                  <div className="form_group flex-47">
                    <Selectx
                      size="large"
                      allowClear={false}
                      // dropdownClassName="select-field"
                      className="input_field"
                      loading={false}
                      options={deductionTypes}
                      name="adjustement_criteria"
                      placeholder="Select deduction type"
                      label={<label>{Labels.DEDUCTION_TYPE}</label>}
                      disabled={!status}
                      // rules={rules({ message: Content.adjustement_criteria_required })}
                    />
                  </div>
                  <div className="form_group flex-47">
                    <Form.Item
                      name="adjustment"
                      className="input_field pb-10"
                      label={
                        <label className="form--label_style mb-5">{Labels.DEDUCTION_VALUE}</label>
                      }
                    >
                      <InputNumberX
                        allowDecimal
                        step="0.01"
                        size="middle"
                        disabled={!status}
                        name="adjustment"
                        stringMode={false}
                        // onBlur={() => {
                        //   if (!form.getFieldValue("adjustment")) {
                        //     form.setFieldValue("adjustment", 0);
                        //   }
                        // }}
                        onChange={(e) => {
                          if (adjustement_criteria === "percent" && e > 100) {
                            form.setFieldValue("adjustment", 100.0);
                          }
                        }}
                        onBlur={() => {
                          if (!form.getFieldValue("adjustment")) {
                            form.setFieldValue("adjustment", 0.0);
                          } else {
                            form.setFieldValue("adjustment", parseFloat(adjustment).toFixed(2));
                          }
                        }}
                        //rules={rules({ message: Content.adjustement_deduction_value})}
                      />
                    </Form.Item>
                  </div>
                </div>
                {has_CreditNotePreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      htmlType="button"
                      btnText={Labels.CANCEL}
                      clickHandler={() => navigate(-1)}
                      className="btn-form-size btn-default mr-20"
                    />
                    <Buttonx
                      btnText="Save"
                      loading={bool}
                      className="btn-form-size btn-primary btn_save"
                    />
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
