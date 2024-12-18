/**@format */

import { Col } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { ContactInfoProps } from "../Types";
import { InputField, Selectx } from "app/shared";

const { ADDRESS, CITY, STATE, ZIP_CODE, COUNTRY } = Labels;

export const ContactStepTwo = ({ ctry_list, isLoading, form }: ContactInfoProps) => {
  return (
    <>
      <>
        <Col span={24}>
          <InputField
            form={form}
            name="company_street"
            className="input_field"
            label={ADDRESS}
            placeholder="Enter Street address"
          />
        </Col>
        <Col span={24}>
          <InputField
            form={form}
            placeholder="Enter City"
            className="input_field"
            label={CITY}
            name="company_city"
          />
        </Col>
        <Col span={24}>
          <InputField
            form={form}
            placeholder="Enter State"
            className="input_field"
            label={STATE}
            name="company_province"
          />
        </Col>
        <Col span={24}>
          <InputField
            form={form}
            className="input_field"
            label={ZIP_CODE}
            name="company_postal_code"
            placeholder="Enter ZIP code"
          />
        </Col>
        <Col span={24}>
          <Selectx
            required
            allowClear={false}
            className="input_field dropdown--scroll"
            placeholder="Select Country"
            label={COUNTRY}
            name="country_id"
            options={ctry_list}
            loading={isLoading}
            rules={rules({ message: Content.enter_country_name })}
          />
        </Col>
      </>
    </>
  );
};
