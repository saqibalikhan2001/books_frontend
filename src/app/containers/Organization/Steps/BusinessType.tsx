/**@format */

import { Col, Form, Radio, RadioChangeEvent, Row, Space, Typography } from "antd";
import { Icons, Selectx, ShowWithAnimation } from "app/shared";
import { TooltipX } from "app/shared/ToolTip";
// import { useState } from "react";
import { Content } from "static";
import { rules } from "utils";
import { BusinessTypeDetails, BusinessTypeProps } from "../Types";

const { } = Icons;

export const BusinessType = ({
  form,
  //@ts-ignore
  option,
  org_list,
  isLoading,
  setOption,
  business_type,
}: BusinessTypeProps) => {
  // const [position, setPosition] = useState<string>("rightTop");
  const handleChange = (ev: RadioChangeEvent) => {
    setOption(ev.target.value);
  };

  const businesstype = Form.useWatch("business_type", form);

  const handleRadioFocus = (id) => (_) => {
    var tooltip = document.getElementById(`${id}`);
    //@ts-ignore
    var tooltipRect = tooltip.getBoundingClientRect();
    var viewportHeight = window.innerHeight;
    if (tooltipRect.bottom > viewportHeight) {
      // If the tooltip is below the viewport, move it up by the height of the tooltip
      // setPosition("top");
      //@ts-ignore
      tooltip.style.top = parseInt(tooltip.style.top) - tooltipRect.height + "px";
    }
    // else {
    //   setPosition("rightTop");
    // }
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Typography.Title className="signup-form-heading" level={3}>
            What kind of business is this?
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Selectx
            required
            placeholder="Select Industry"
            allowClear={false}
            options={org_list}
            loading={isLoading}
            className="input_field dropdown--scroll"
            label="Select Industry"
            name="organization_type_id"
            rules={rules({ message: Content.enter_organization_type })}
          />
        </Col>
        <Col span={24} className="mb-15">
          <Form.Item
            required
            name="is_llc"
            label={
              <div className="mb-10" style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <span>Is it LLC?</span>
                  <span className="asterisk">*</span>
                </div>
                <div className="d-flex">
                  <TooltipX
                    overlayStyle={{ minWidth: 320 }}
                    placement="rightTop"
                    title="LLCs allow for personal liability protection and allow pass-through taxation. Choose this business type if you’re unsure whether to file taxes as a sole proprietor, partnership, or S-corp"
                  >
                    <img
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
                      alt="tooltip Icon"
                      className="hover-effect pl-9"
                    />
                    {/* <RiQuestionFill className="ml-10" color="#707070" size={14} /> */}
                  </TooltipX>
                </div>
              </div>
            }
            style={{ marginBottom: 0 }}
            rules={rules({ message: Content.select_llc })}
          >
            <Radio.Group value={null} onChange={handleChange}>
              <Space direction="vertical">
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
                <Radio value="not_sure">I'm not sure</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24} style={{ paddingRight: "0" }} className="steps-register-toggle">
          <ShowWithAnimation isMounted={option === "yes"}>
            <Form.Item
              name="business_type"
              rules={rules({ message: Content.select_business_type })}
              label={
                <label style={{ fontWeight: "700" }}>How is the business setup for taxes?</label>
              }
            >
              <Radio.Group className="ant-space-item" style={{ width: "100%" }}>
                <div className="business_list">
                  {business_type.map((val: BusinessTypeDetails) => (
                    <div className="bussiness_setup_sec" key={val.id} style={{ width: "100%" }}>
                      <div
                        id={`${val.id}`}
                        onMouseMoveCapture={handleRadioFocus(val.id)}
                        className={`bussiness_setup_widget ${val.id === businesstype ? "bussiness_setup_widget_active" : ""
                          }`}
                      >
                        <Radio value={val.id} className="business_type">
                          <Typography.Title className="business_title" level={5}>
                            {" "}
                            {val.name}
                          </Typography.Title>

                          <Typography.Text className="_type">{`Form ${val.form}`}</Typography.Text>
                        </Radio>
                      </div>

                      <TooltipX
                        overlayStyle={{ minWidth: 320 }}
                        title={val.description}
                        placement="rightTop"
                      >
                        <img
                          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/tooltip.svg`}
                          alt="tooltip Icon"
                          className="hover-effect pl-9 tax_tooltip"
                        />
                        {/* <RiQuestionFill className="tax_tooltip" size={14} color="#707070" /> */}
                      </TooltipX>
                    </div>
                  ))}
                </div>
              </Radio.Group>
            </Form.Item>
          </ShowWithAnimation>
        </Col>
      </Row>
    </>
  );
};
