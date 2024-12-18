/**@format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Typography, Radio } from "antd";
import { endpoints } from "static";
import { TooltipX } from "app/shared/ToolTip";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Icons, InputField, Spinner, Toast, Breadcrumbx, Buttonx } from "app/shared";

const { AiFillQuestionCircle } = Icons;
const { NUMBER_PREFERENCES, ALL } = endpoints;

export const Prefixes = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [prefixes, setPrefixes] = useState<any>([]);
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_PrefixPreferenceEdit_permission } = checkPermission("PrefixPreferenceEdit");

  useEffect(() => {
    callAxios({
      url: `${NUMBER_PREFERENCES}${ALL}`,
    }).then((res) => {
      setHasContentLoading(false);
      setPrefixes(res);
    });
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      soFormat: prefixes?.sales_order_preference?.preferences?.soFormat,
      poFormat: prefixes?.purchase_order_preference?.preferences?.poFormat,
      invFormat: prefixes?.invoice_preference?.preferences?.invFormat,
      blFormat: prefixes?.bill_preference?.preferences?.blFormat,
      crFormat: prefixes?.credit_note_preference?.preferences?.crFormat,
      estFormat: prefixes?.estimates_preference?.preferences?.estFormat,
      skuTerms: prefixes?.sku_preference?.terms,
      skuFormat: prefixes?.sku_preference?.preferences?.skuFormat,
      startFrom: prefixes?.sku_preference?.preferences?.startFrom,
    });
  }, [prefixes]);

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: `${NUMBER_PREFERENCES}${ALL}`,
      data: { ...values, soFormat: "SO", poFormat: "PO" },
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
        <div className="main_wrapper  preference_prefixes_form">
          <Breadcrumbx name="Prefixes" className="navigate" setting={true} show />
          <div className="_container">
            <Typography.Title level={4} className="form_heading">
              Prefixes
            </Typography.Title>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="form_box">
                <div className="flexbox form-row-sm-container justify-content-between">
                  {/* <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="soFormat"
                      className="input_field"
                      label={<label>Sales order prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div>
                  <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="poFormat"
                      className="input_field"
                      label={<label>Purchase order prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div> */}
                  <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="invFormat"
                      className="input_field"
                      label={<label>Invoice prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div>
                  <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="blFormat"
                      className="input_field"
                      label={<label>Bill prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div>
                  <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="crFormat"
                      className="input_field"
                      label={<label>Credit note prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div>
                  <div className="form_group flex-46">
                    <InputField
                      form={form}
                      type="text"
                      size="middle"
                      name="estFormat"
                      className="input_field"
                      label={<label>Estimates prefix</label>}
                      rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                    />
                  </div>
                </div>
              </div>

              <Typography.Title level={4} className="form_heading">
                SKU
              </Typography.Title>
              <div className="form_box prefixes_sku">
                <div className="flexbox form-row-sm-container justify-content-between flex-column">
                  <Form.Item
                    colon={false}
                    name="skuTerms"
                    labelAlign="left"
                    label={<label className="mb-8">SKU</label>}
                  >
                    <Radio.Group defaultValue="auto" className="mb-5">
                      <div className="radio_group">
                        <Radio value="auto">Auto generate SKU Number</Radio>
                        <TooltipX title=" This option will auto generate the SKU.You can also provide the a prefix but that is option.">
                          <AiFillQuestionCircle size={16} />
                        </TooltipX>
                      </div>
                      <div className="radio_group">
                        <Radio value="manual">Continue from Last SKU Number</Radio>
                        <TooltipX title="The SKU on your new products will be generated by incrementing the latest SKU in your products list. This option is best suitable when importing products list to Seebiz Books">
                          <AiFillQuestionCircle size={16} />
                        </TooltipX>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                  <div className="lexbox form-row-sm-container justify-content-between d-flex">
                    <div className="form_group flex-46 mb-10">
                      <InputField
                        form={form}
                        type="text"
                        size="middle"
                        name="skuFormat"
                        className="input_field"
                        label={<label>SKU Prefix</label>}
                        rules={[{ message: "No more than 3 Characters.", max: 3, type: "string" }]}
                      />
                    </div>
                    <div className="form_group flex-46">
                      <InputField
                        form={form}
                        type="text"
                        size="middle"
                        name="startFrom"
                        className="input_field"
                        label={<label>SKU Start From</label>}
                        disabled={prefixes?.sku_preference?.preferences?.startFromLocked}
                      />
                    </div>
                  </div>
                  {has_PrefixPreferenceEdit_permission ? (
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
                  ) : null}
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
