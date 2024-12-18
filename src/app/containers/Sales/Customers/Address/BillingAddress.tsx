/** @format */

import { Form, Radio, Typography } from "antd";
import { Content, Labels } from "static";
import { rules } from "utils";
import { useListing } from "app/Hooks";
import { InputField, Selectx } from "app/shared";
import { BillingAddressProps, CtxInputProps } from "../Types";

const CtxInputField = ({ name, label, placeholder, rules, form }: CtxInputProps) => (
  <InputField
    form={form}
    name={name}
    size="middle"
    colon={false}
    label={label}
    rules={rules}
    className="input_field"
    placeholder={placeholder}
  />
);

const BillingAddress = ({
  form,
  isModal = false,
  customerForm = false,
  contactForm = false,
}: BillingAddressProps) => {
  const { country_list } = useListing();
  return (
    <>
      <div className={`form_box generic_modal ${isModal ? "billing--address__modal px-30" : ""}`}>
        {contactForm && (
          <Form.Item name="address_type">
            <Radio.Group className=" flex-column account_category_list" defaultValue="additional">
              <Radio key="billing" value="billing" disabled>
                Billing
              </Radio>
              <Radio key="shipping" value="shipping" disabled>
                Shipping
              </Radio>
              <Radio key="additional" value="additional" disabled>
                Additional
              </Radio>
            </Radio.Group>
          </Form.Item>
        )}
        {!isModal || (isModal && customerForm) ? (
          <Typography.Text className="fz-13 mb-15" strong>
            Billing address
          </Typography.Text>
        ) : null}
        <div className={`flexbox  justify-content-between ${isModal ? "" : "form-row-container"}`}>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              name="bill_attention"
              placeholder="Enter attention"
              label={
                !isModal || (isModal && customerForm) ? (
                  <> {Labels.ATTENTION}</>
                ) : (
                  <>
                    {Labels.ATTENTION}
                    <span className="staric">*</span>
                  </>
                )
              }
              rules={
                isModal && !customerForm
                  ? rules({ message: Content.enter_attention })
                  : rules({ required: false })
              }
            />
          </div>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              label={"Phone"}
              name="bill_phone"
              placeholder="Enter phone"
              rules={[{ message: "No more than 20 Characters.", max: 20, type: "string" }]}
            />
          </div>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              name="bill_street"
              label={
                !isModal || (isModal && customerForm) ? (
                  <>Street 1</>
                ) : (
                  <>
                    Street 1<span className="staric">*</span>
                  </>
                )
              }
              placeholder="Enter street 1"
              rules={
                isModal && !customerForm
                  ? rules({ message: Content.enter_street_1 })
                  : rules({ required: false })
              }
            />
          </div>
          <div className="form_group flex-47 ">
            <CtxInputField
              form={form}
              name="bill_street_2"
              label={
                !isModal || (isModal && customerForm) ? (
                  <>Street 2</>
                ) : (
                  <>
                    Street 2<span className="staric">*</span>
                  </>
                )
              }
              placeholder="Enter street 2"
              rules={
                isModal && !customerForm
                  ? rules({ message: Content.enter_street_2 })
                  : rules({ required: false })
              }
            />
          </div>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              name="bill_city"
              label={Labels.CITY}
              placeholder="Enter city"
            />
          </div>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              name="bill_state"
              label={"State"}
              placeholder="Enter state"
            />
          </div>
          <div className="form_group flex-47">
            <CtxInputField
              form={form}
              name="bill_zip_code"
              label={"Zip code"}
              placeholder="Enter zip code"
              rules={[{ message: Content.character_length, max: 15, type: "string" }]}
            />
          </div>
          <div className="form_group flex-47">
            <Selectx
              size="large"
              allowClear={false}
              name="bill_country_id"
              label={Labels.COUNTRY}
              options={country_list}
              placeholder="Enter country"
              popupClassName={isModal ? "overlap" : ""}
              className="input_field country-field dropdown--scroll"
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="bill_fax"
              className="input_field"
              placeholder="Enter fax"
              label={<label className="mb-5">Fax</label>}
              rules={[{ message: "No more than 20 Characters.", max: 20, type: "string" }]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingAddress;
