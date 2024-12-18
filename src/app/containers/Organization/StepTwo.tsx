/**@format */

import { Col, Row } from "antd";
import { rules } from "utils";
import { Labels, Content } from "static";
import { ContactInfoProps } from "./Types";
import { InputField, Selectx } from "app/shared";

export const StepTwo = ({ ctry_list, isLoading }: ContactInfoProps) => {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <InputField
            label={`${Labels.CONTACT} ${Labels.NAME}`}
            name="primary_contact_name"
            rules={[]}
            // LeftIcon={<AiOutlineMail />}
            className="mb flex_root"
            placeholder={`${Labels.CONTACT} ${Labels.NAME}`}
          />
        </Col>

        <Col span={24}>
          <InputField
            label={`${Labels.CONTACT} ${Labels.EMAIL}`}
            name="primary_contact_email"
            // LeftIcon={<AiOutlineMail />}
            className="mb flex_root"
            placeholder={`${Labels.CONTACT} ${Labels.EMAIL}`}
          />
        </Col>

        <Col span={12}>
          <Selectx
            label={Labels.COUNTRY}
            name="country_id"
            rules={rules({ message: Content.enter_country_name })}
            className="mb flex_root"
            options={ctry_list}
            placeholder={Labels.COUNTRY}
            loading={isLoading}
          />
        </Col>

        <Col span={12}>
          <InputField
            label={Labels.STATE}
            name="company_province"
            rules={[]}
            // LeftIcon={<FaCity />}
            className="mb flex_root"
            placeholder={Labels.STATE}
          />
        </Col>

        <Col span={12}>
          <InputField
            label={Labels.CITY}
            name="company_city"
            rules={[]}
            // LeftIcon={<FaCity />}
            className="mb flex_root"
            placeholder="City Name"
          />
        </Col>

        <Col span={12}>
          <InputField
            label={Labels.ZIP_CODE}
            name="company_postal_code"
            rules={[]}
            className="mb flex_root"
            placeholder="Zip Code"
          />
        </Col>

        <Col span={24}>
          <InputField
            label={Labels.ADDRESS}
            name="company_street"
            rules={[]}
            // LeftIcon={<AiOutlinePhone />}
            className="mb flex_root"
            placeholder="Enter Address"
          />
        </Col>

        <Col span={24}>
          <InputField
            label={Labels.PHONE}
            name="phone"
            rules={rules({ message: Content.enter_phone })}
            // LeftIcon={<AiOutlinePhone />}
            className="mb flex_root"
            placeholder="Enter Phone"
          />
        </Col>

        <Col span={24}>
          <InputField
            label={Labels.WEBSITE}
            name="company_website"
            rules={[]}
            // LeftIcon={null}
            className="mb flex_root"
            // addonBefore="https://"
            // addonAfter=".com"
            placeholder="seebiz"
          />
        </Col>
      </Row>
    </>
  );
};
