/** @format */

import { Checkbox, Form, Typography } from "antd";
import { Labels, Content } from "static";
import { useListing } from "app/Hooks";
import { CtxInputProps } from "../Types";
import { InputField, Selectx, ShowWithAnimation } from "app/shared";
import { FormInstance } from "antd/lib/form/Form";

const CtxInputField = ({ name, label, placeholder, rules, form }: CtxInputProps) => (
  <InputField
    form={form}
    name={name}
    rules={rules}
    size="middle"
    className="input_field"
    colon={false}
    label={label}
    placeholder={placeholder}
  />
);

//@ts-ignore
const ShippingAddress = ({ form, isModal }: { form: FormInstance; isModal?: boolean }) => {
  const { country_list } = useListing();
  const billing_address = Form.useWatch("same_as_billing", form);
  return (
    <>
      <div className="form_box mb-15">
        <Typography.Text strong className="block mb-20 sub-heading">
          Shipping Address
        </Typography.Text>

        <Form.Item name="same_as_billing" valuePropName="checked" noStyle>
          <Checkbox className="billing-checkbox">Same as billing address</Checkbox>
        </Form.Item>
      </div>
      <ShowWithAnimation isMounted={!billing_address}>
        <div className="form_box ">
          <div className="flexbox form-row-container justify-content-between">
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_attention"
                placeholder="Enter attention"
                label={Labels.ATTENTION}
                // rules={rules({ message: "Attention Required" })}
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                label={"Phone"}
                name="ship_phone"
                placeholder="Enter phone"
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_street"
                label={"Street 1"}
                placeholder="Enter street 1"
                // rules={rules({ message: "Street Required" })}
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_street_2"
                label={"Street 2"}
                placeholder="Enter street 2"
                // rules={rules({ message: "Street Required" })}
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_city"
                label={Labels.CITY}
                placeholder="Enter city"
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_state"
                label={"State"}
                placeholder="Enter state"
              />
            </div>
            <div className="form_group flex-47">
              <CtxInputField
                form={form}
                name="ship_zip_code"
                label={"Zip code"}
                placeholder="Enter zip code"
                rules={[{ message: Content.character_length, max: 15, type: "string" }]}
              />
            </div>
            <div className="form_group flex-47">
              <Selectx
                size="large"
                allowClear={false}
                name="ship_country_id"
                label={Labels.COUNTRY}
                options={country_list}
                placeholder="Enter country"
                className="input_field dropdown--scroll"
                popupClassName={isModal ? "overlap" : ""}
                // rules={rules({ message: "Country Required" })}
              />
            </div>
            <div className="form_group flex-47">
              <InputField
                form={form}
                size="middle"
                colon={false}
                name="ship_fax"
                className="input_field"
                placeholder="Enter fax"
                label={"Fax"}
              />
            </div>
          </div>
        </div>
      </ShowWithAnimation>
    </>
  );
};

export default ShippingAddress;
