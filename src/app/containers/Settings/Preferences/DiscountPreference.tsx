/**@format */

import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Typography, Radio, Button } from "antd";
import { useAxios, useBool, usePermissions } from "app/Hooks";
import { Spinner, Buttonx, Breadcrumbx, Toast } from "app/shared";

const initialState = {
  Dp: "",
};

export const DiscountPreference = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { callAxios } = useAxios();
  const { bool, toggle } = useBool();
  const { checkPermission } = usePermissions();
  const [hasContentLoading, setHasContentLoading] = useState(true);
  const { has_DiscountPreferenceEdit_permission } = checkPermission("DiscountPreferenceEdit");

  useLayoutEffect(() => {
    setTimeout(() => {
      setHasContentLoading(false);
    }, 1000);
    callAxios({
      url: "preferences/discount",
    }).then((res: any) => {
      setHasContentLoading(false);
      const { preferences = {} } = res || {};
      let Dp_pref = "";
      if (preferences.no_discount) Dp_pref = "no_discount";
      else if (preferences.at_individual_item_level) Dp_pref = "at_individual_item_level";
      else if (preferences.at_transaction_level) Dp_pref = "at_transaction_level";

      form.setFieldsValue({ Dp: Dp_pref });
    });
    //eslint-disable-next-line
  }, [callAxios]);

  const onSubmit = (values) => {
    toggle();
    const { Dp } = values;
    const status = {
      no_discount: false,
      at_individual_item_level: false,
      at_transaction_level: false,
    };
    if (Dp === "no_discount") {
      status.no_discount = true;
    } else if (Dp === "at_individual_item_level") status.at_individual_item_level = true;
    else if (Dp === "at_transaction_level") status.at_transaction_level = true;
    callAxios({
      method: "put",
      url: "preferences/discount",
      data: { status: { ...status } },
    }).then((res) => {
      toggle();
      if (res) {
        Toast({ message: res?.message || "" });
      }
    });
    // .catch(() => toggle());
  };

  //   useEffect(() => {
  //     setTimeout(() => {
  //       setHasContentLoading(false);
  //     }, 1000);
  //   });

  return (
    <>
      {hasContentLoading ? (
        <Spinner directionSize={"90vh"} />
      ) : (
        <div className="main_wrapper">
          <Breadcrumbx name="Discount preference" className="navigate" setting={true} show />
          <div className="_container">
            <Typography.Title level={4} className="form_heading">
              Discount Preference
            </Typography.Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              requiredMark={false}
              name="create-role-form"
              initialValues={initialState}
            >
              <div className="form_box">
                <div className="flexbox form-row-container justify-content-between flex-column">
                  <Form.Item
                    colon={false}
                    name="Dp"
                    labelAlign="left"
                    label={
                      <Typography.Title level={4} className="form_heading">
                        Do you give discounts?
                      </Typography.Title>
                    }
                  >
                    <Radio.Group className="mb-30">
                      <div className="radio_group">
                        <Radio value="no_discount">I don't give discounts</Radio>
                      </div>
                      <div className="radio_group">
                        <Radio value="at_individual_item_level">At individual product level</Radio>
                      </div>
                      <div className="radio_group">
                        <Radio value="at_transaction_level">At transaction level</Radio>
                      </div>
                    </Radio.Group>
                  </Form.Item>
                </div>
                {has_DiscountPreferenceEdit_permission ? (
                  <div className="button_flexbox">
                    <Form.Item>
                      <Buttonx
                        type="default"
                        btnText="Cancel"
                        htmlType="button"
                        clickHandler={() => navigate(-1)}
                        className="btn-form-size btn-default mr-20"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        loading={bool}
                        htmlType="submit"
                        className="btn-form-size btn-primary"
                      >
                        Submit
                      </Button>
                    </Form.Item>
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
