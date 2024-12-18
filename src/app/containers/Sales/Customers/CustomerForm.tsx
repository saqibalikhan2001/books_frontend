/** @format */

import { Typography } from "antd";
import { rules } from "utils";
import { useListing } from "app/Hooks";
import { Content, Labels } from "static";
import { CustomerFormProps } from "./Types";
import { DetailsForm } from "./DetailsForm";
import { InputField, Selectx } from "app/shared";
import { useEffect } from "react";

const options = [
  {
    id: "Mr.",
    label: "Mr.",
  },
  {
    id: "Mrs.",
    label: "Mrs.",
  },
  {
    id: "Miss.",
    label: "Miss.",
  },
  {
    id: "Ms.",
    label: "Ms.",
  },
  {
    id: "Dr.",
    label: "Dr.",
  },
];

export const CustomerForm = ({
  form,
  firstNameRef,
  display_names,
  displayNameRef,
  //@ts-ignore
  isModal = false,
  supplier = false,
}: CustomerFormProps) => {
  const { currncy_list } = useListing();
  const salutation = form?.getFieldValue("salutation");
  const first_name = form?.getFieldValue("first_name");
  const last_name = form?.getFieldValue("last_name");

  useEffect(() => {
    if (salutation || first_name || last_name) {
      setTimeout(() => {
        form?.validateFields(["display_name"]);
      }, 300);
    }
  }, [salutation, first_name, last_name]);
  return (
    <>
      <Typography.Title level={4} className="h4 form_heading ">
        Name and Contact
      </Typography.Title>
      <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-32">
            <Selectx
              size="large"
              name="salutation"
              options={options}
              className="input_field title-italic"
              label={"Title"}
              placeholder="Enter title"
              popupClassName={isModal ? "overlap" : ""}
            />
          </div>
          <div className="form_group flex-32">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="first_name"
              label="First name"
              required
              className="input_field _plc--holder--gap"
              innerRef={firstNameRef}
              placeholder="Enter first name"
              customChange
              rules={rules({ message: Content.first_name_required })}
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                form?.setFieldValue("first_name", next);
              }}
            />
          </div>
          <div className="form_group flex-32">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="last_name"
              className="input_field _plc--holder--gap"
              label={"Last name"}
              placeholder="Enter last name"
              customChange
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                form?.setFieldValue("last_name", next);
              }}
            />
          </div>
        </div>
      </div>

      <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="company_name"
              className="input_field _plc--holder--gap"
              placeholder="Enter company name"
              label={Labels.COMPANY_NAME}
              customChange
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                form?.setFieldValue("company_name", next);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <Selectx
              size="large"
              allowClear={false}
              name="display_name"
              className="input_field"
              options={display_names}
              label={`${supplier ? "Supplier" : "Customer"} display name`}
              required
              innerRef={displayNameRef}
              placeholder={`Enter ${supplier ? "supplier" : "customer"} display name`}
              rules={rules({
                message: `${supplier ? "Supplier" : "Customer"} display name is required`,
              })}
              popupClassName={isModal ? "overlap" : ""}
              onlyDisplayname
              handleSort={false}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="department"
              label={"Department"}
              placeholder="Enter department"
              className="input_field _plc--holder--gap"
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="designation"
              label={"Designation"}
              placeholder="Enter designation"
              className="input_field _plc--holder--gap"
            />
          </div>
          {supplier && (
            <div className="form_group flex-47">
              <InputField
                form={form}
                size="middle"
                colon={false}
                rules={[{ message: "No more than 60 Characters.", max: 60, type: "string" }]}
                name="social_security_no"
                className="input_field _plc--holder--gap"
                placeholder="Enter Business ID No. / Social Security No."
                label={<label>Business ID No. / Social Security No.</label>}
              />
            </div>
          )}
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="license_no"
              label={"License number"}
              placeholder="Enter license number"
              className="input_field _plc--holder--gap"
              rules={[{ message: "No more than 60 Characters.", max: 60, type: "string" }]}
            />
          </div>
          <div className="form_group flex-47">
            <Selectx
              disabled
              size="large"
              loading={false}
              name="currency_id"
              allowClear={false}
              options={currncy_list}
              label={Labels.BASE_CURRENCY}
              placeholder="Select currency"
              className="input_field _plc--holder--gap"
              popupClassName={isModal ? "overlap" : ""}
              required
              // rules={rules({ message: Content.enter_base_currency })}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              name="email"
              size="middle"
              colon={false}
              placeholder="Enter email"
              className=" input_field"
              rules={rules({
                name: "email",
                message: "please enter a valid email",
                validEmail: true,
              })}
              label={Labels.EMAIL}
            />
          </div>
          <div className="form_group flex-47">
            <Selectx
              disabled
              name="language"
              label={"Language"}
              className="input_field"
              placeholder="Enter language"
              popupClassName={isModal ? "overlap" : ""}
              options={[{ id: "english", label: "English" }]}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              customChange
              name="work_phone"
              label={"Phone (primary)"}
              placeholder="Enter phone (primary)"
              className="input_field _plc--holder--gap"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                const value = next.length <= 20 ? next : next.slice(0, 20);
                form?.setFieldValue("work_phone", value);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              customChange
              name="work_phone_secondary"
              label={"Phone (secondary)"}
              placeholder="Enter phone (secondary)"
              className="input_field _plc--holder--gap"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                const value = next.length <= 20 ? next : next.slice(0, 20);
                form?.setFieldValue("work_phone_secondary", value);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="mobile"
              customChange
              label={"Mobile (primary)"}
              placeholder="Enter mobile (primary)"
              className="input_field _plc--holder--gap"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                const value = next.length <= 20 ? next : next.slice(0, 20);
                form?.setFieldValue("mobile", value);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              customChange
              name="mobile_secondary"
              label={"Mobile (secondary)"}
              placeholder="Enter mobile (secondary)"
              className="input_field _plc--holder--gap"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                const value = next.length <= 20 ? next : next.slice(0, 20);
                form?.setFieldValue("mobile_secondary", value);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              customChange
              size="middle"
              colon={false}
              name="other_contacts"
              label={"Other contact"}
              placeholder="Enter other contact"
              className="input_field _plc--holder--gap"
              onChange={(e) => {
                const next = e.target.value.replace(/[^\x00-\x7F]/g, "");
                const value = next.length <= 20 ? next : next.slice(0, 20);
                form?.setFieldValue("other_contacts", value);
              }}
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="website"
              label={"Website"}
              placeholder="Enter website"
              className="input_field _plc--holder--gap"
            />
          </div>
        </div>
      </div>

      <DetailsForm form={form} />
    </>
  );
};
