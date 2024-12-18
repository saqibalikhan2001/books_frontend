/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Typography, Switch, Radio } from "antd";
import dayjs from "dayjs";
import { endpoints } from "static";
import { getFullDateAndTime } from "utils";
import { TooltipX } from "app/shared/ToolTip";
import { useAxios, useBool, usePermissions, useStore } from "app/Hooks";
import { Buttonx, Icons, Spinner, Toast, Breadcrumbx, DatePickerx } from "app/shared";

const {} = Icons;
const { Text, Title } = Typography;
const { STOCK_PREFERENCE } = endpoints;

const todayDate = dayjs(new Date());

const initialState = {
  type: "physical",
  is_inventory_enable: false,
  inventory_start_date: todayDate,
};

export const Inventory = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { org_date_format } = useStore();
  const [value, setValue] = useState();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const is_inventory_enable = Form.useWatch("is_inventory_enable", form);
  const { has_InventoryPreferenceEdit_permission } = checkPermission("InventoryPreferenceEdit");

  useLayoutEffect(() => {
    callAxios({
      url: STOCK_PREFERENCE,
    }).then((res) => {
      setHasContentLoading(false);
      setValue(res);
      const { preferences = {} } = res || {};
      form.setFieldsValue({
        ...preferences,
        inventory_start_date: dayjs(preferences.inventory_start_date, "YYYY-MM-DD"),
        type: preferences?.physical ? "physical" : "accounting",
      });
    });
    //eslint-disable-next-line
  }, []);

  const handleSubmit = (values) => {
    toggle();
    callAxios({
      method: "put",
      url: STOCK_PREFERENCE,
      data: {
        inventory_start_date: getFullDateAndTime(values.inventory_start_date),
        status: {
          is_inventory_enable: values.is_inventory_enable,
          accounting: values.type === "accounting",
          physical: values.type === "physical",
        },
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
  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper preference_inventory_form">
          <Breadcrumbx name="Inventory" className="navigate" setting={true} show />
          <div className="_container">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={initialState}
            >
              <Title level={4} className="form_heading">
                Stock
              </Title>
              <div className="form_box">
                <div className="switch_group">
                  <Text strong className="switch-label">
                    Enable stock tracking
                  </Text>
                  <Form.Item
                    valuePropName="checked"
                    name="is_inventory_enable"
                    className="switch-handle"
                  >
                    <Switch className="switch-btn" />
                  </Form.Item>
                </div>
                <div className="pl-20 handmade_asset">
                  <Form.Item
                    label={<label className="mb-8">Mode of stock tracking</label>}
                    name="type"
                  >
                    <Radio.Group disabled={!is_inventory_enable}>
                      <div className="radio_group">
                        <Radio value="physical" className="align_label">
                          <Text>Physical stock</Text>
                          <TooltipX
                            overlayStyle={{ minWidth: 290 }}
                            title="The stock on hand will be calculated based on Receives & Shipments"
                          >
                            <img
                              className="ml-10 hover-effect"
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/tooltip.svg`}
                              alt="tooltip icon"
                            ></img>
                          </TooltipX>
                        </Radio>
                      </div>
                      <div className="radio_group">
                        <Radio value="accounting" className="align_label">
                          <Text>Accounting stock</Text>
                          <TooltipX
                            overlayStyle={{ minWidth: 290 }}
                            title="The stock on hand will be calculated based on Bills & Invoices"
                          >
                            <img
                              className="ml-10 hover-effect"
                              src={`${
                                import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                              }/static/media/tooltip.svg`}
                              alt="tooltip icon"
                            ></img>
                          </TooltipX>
                        </Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>

                {/* ending */}
                <div className="flexbox  form-row-container justify-content-between mb-15">
                  <div className="form_group flex-47 mb-30 inventory-date">
                    <DatePickerx
                      size="large"
                      inputReadOnly
                      format={org_date_format}
                      name="inventory_start_date"
                      label={<label>Inventory start date</label>}
                      //@ts-ignore
                      disabled={!is_inventory_enable || value?.preferences?.disabled_inventory_date}
                    />
                  </div>
                </div>
                {has_InventoryPreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Buttonx
                      type="default"
                      btnText="Cancel"
                      htmlType="button"
                      clickHandler={() => navigate(-1)}
                      className="btn-default btn-form-size mr-20"
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
