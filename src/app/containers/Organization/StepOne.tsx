/**@format */

import { Col, Row } from "antd";
import { rules } from "utils";
import timezone from "moment-timezone";
import { Labels, Content } from "static";
import { BusinessInfoProps } from "./Types";
import { InputField, Selectx } from "app/shared";

// const { AiOutlineUser, GiPalisade } = Icons;

export const StepOne = ({
  show,
  org_list,
  isLoading,
  fiscle_list,
  currncy_list,
}: BusinessInfoProps) => {
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <InputField
            label={Labels.BUSINESS_NAME}
            name="name"
            rules={rules({ message: Content.enter_business_name })}
            // LeftIcon={<AiOutlineUser />}
            className="mb flex_root"
            placeholder={Labels.BUSINESS_NAME}
          />
        </Col>

        <Col span={24}>
          <Selectx
            label={Labels.TYPE}
            name="organization_type_id"
            className="mb flex_root"
            options={org_list}
            loading={isLoading}
            placeholder={Labels.TYPE}
            rules={rules({ message: Content.enter_organization_type })}
          />
        </Col>

        <Col span={24}>
          <Selectx
            label={Labels.TIMEZONE}
            name="time_zone"
            className="mb flex_root"
            rules={rules({ message: Content.enter_time_zone })}
            options={timezone.tz.names()}
            defaultValue="America/Los_Angeles"
          />
        </Col>

        <Col span={24}>
          <Selectx
            label={Labels.FISCAL_YEAR}
            name="fiscal_year_id"
            className="mb flex_root dropdown--scroll"
            options={fiscle_list}
            loading={isLoading}
            placeholder={"Select the Fiscal year"}
            rules={rules({ message: Content.enter_fiscal_year })}
          />
        </Col>

        <Col span={24}>
          <Selectx
            label={Labels.BASE_CURRENCY}
            name="base_currency_id"
            className="mb flex_root dropdown--scroll"
            disabled={show}
            options={currncy_list}
            loading={isLoading}
            rules={rules({ message: Content.enter_base_currency })}
          />
        </Col>

        <Col span={24}>
          <InputField
            label={Labels.LICENSE_NO}
            name="license_no"
            size="middle"
            // LeftIcon={<GiPalisade />}
            className="mb flex_root"
            placeholder={Labels.LICENSE_NO}
          />
        </Col>
      </Row>
    </>
  );
};
