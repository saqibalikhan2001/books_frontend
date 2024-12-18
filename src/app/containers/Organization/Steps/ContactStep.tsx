/**@format */

import { Col, Row, Typography } from "antd";
import { rules } from "utils";
import { InputField } from "app/shared";
import { Labels, Content } from "static";
import { ContactStepProps } from "../Types";
import { ContactStepTwo } from "./ContactStepTwo";
const { NAME, EMAIL, PHONE, WEBSITE } = Labels;

export const ContactStep = ({ step, isLoading, ctry_list, form }: ContactStepProps) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title className="signup-form-heading" level={3}>
            Contact Information
          </Typography.Title>
        </Col>
        {step === 2 ? (
          <>
            <Col span={24}>
              <InputField
                form={form}
                className="input_field"
                label={NAME}
                name="primary_contact_name"
                placeholder="Enter Name"
              />
            </Col>
            <Col span={24}>
              <InputField
                form={form}
                className="input_field"
                label={EMAIL}
                name="primary_contact_email"
                placeholder="Enter Email"
                rules={rules({
                  name: "email",
                  message: "please enter a valid email",
                  validEmail: true,
                })}
              />
            </Col>
            <Col span={24}>
              <InputField
                required
                form={form}
                label={PHONE}
                name="phone"
                maxLength={20}
                placeholder="Enter Phone No."
                rules={rules({ message: Content.enter_phone })}
              />
            </Col>
            <Col span={24}>
              <InputField
                form={form}
                className="input_field"
                label={WEBSITE}
                placeholder="Enter Website"
                name="company_website"
              />
            </Col>{" "}
          </>
        ) : (
          <ContactStepTwo isLoading={isLoading} ctry_list={ctry_list} form={form} />
        )}
      </Row>
    </>
  );
};
