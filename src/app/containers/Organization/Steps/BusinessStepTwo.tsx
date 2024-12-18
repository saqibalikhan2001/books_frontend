/**@format */

import { Col, Row, Typography } from "antd";
import { rules } from "utils";
import timezone from "moment-timezone";
import { Selectx } from "app/shared";
import { Labels, Content } from "static";
import { BusinessStepTwoProps } from "../Types";

const { FISCAL_YEAR, BASE_CURRENCY, TIMEZONE } = Labels;

export const BusinessStepTwo = ({
  show,
  isLoading,
  fiscle_list,
  currncy_list,
}: BusinessStepTwoProps) => (
  <>
    <Row>
      <Col span={24}>
        <Typography.Title className="signup-form-heading" level={3}>
          You are just one step away!
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Selectx
          required
          className="input_field dropdown--scroll"
          label={FISCAL_YEAR}
          name="fiscal_year_id"
          options={fiscle_list}
          loading={isLoading}
          handleSort={false}
          placeholder="Select the fiscal year"
          rules={rules({ message: Content.enter_fiscal_year })}
          allowClear={false}
        />
      </Col>

      <Col span={24}>
        <Selectx
          required
          disabled={show}
          allowClear={false}
          loading={isLoading}
          options={currncy_list}
          className="input_field dropdown--scroll"
          name="base_currency_id"
          label={BASE_CURRENCY}
          placeholder="Select your home currency"
          rules={rules({ message: Content.enter_base_currency })}
        />
      </Col>
      <Col span={24}>
        <Selectx
          required
          className="input_field dropdown--scroll"
          label={TIMEZONE}
          name="time_zone"
          rules={rules({ message: Content.enter_time_zone })}
          options={timezone.tz.names()}
          defaultValue="America/Los_Angeles"
          placeholder="Select your timezone"
          allowClear={false}
        />
      </Col>
      <Col span={24}>
        <Selectx
          name="date_format"
          placeholder="Select date format"
          className="input_field"
          loading={false}
          disabled
          label={"Date Format"}
        />
      </Col>
    </Row>
  </>
);
