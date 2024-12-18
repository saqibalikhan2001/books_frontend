import { useState } from "react";
import { Typography, Switch, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { TooltipX } from "app/shared/ToolTip";
import { Buttonx, Icons, InputField, Selectx } from "app/shared";

const { Title, Paragraph } = Typography;
const { BsFillQuestionCircleFill, BsFillCheckCircleFill } = Icons;

const LastFees = () => {
  const [value, setValue] = useState(3);
  const [data, setData] = useState("amount");
  const [isbool, setIsBool] = useState(false);

  const onChange = (checked: boolean) => {
    setIsBool(checked);
  };
  const onChangeData = (e: RadioChangeEvent) => {
    setData(e.target.value);
  };
  const onChangeRadio = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  return (
    <>
      <div className="with_Required_Width">
        <div className="d-flex justify_between mb-20 required_for_design">
          <div className="sharing_space_care d-flex ">
            <Title level={5}>Last Fees </Title>
            <TooltipX title={"TOOLTIP TEXT"} className="same_alignment">
              <BsFillQuestionCircleFill />
            </TooltipX>
          </div>
          <Switch onChange={onChange} />
        </div>
        {isbool ? (
          <>
            <Radio.Group onChange={onChangeRadio} value={value}>
              <Radio className="mb-10" value={3}>
                User default
              </Radio>
              <Paragraph className="mb-10">
                A flat fee of 100 USD once per invoice with no grace period
              </Paragraph>

              <Radio className="mb-10" value={4}>
                Customize
              </Radio>
            </Radio.Group>
            <>
              {value === 4 ? (
                <>
                  <Paragraph className="fast_forward">
                    There may be limits on the amounts and types of fees you may charge to <br />{" "}
                    your customers. You should confirm the requirements in your jurisdiction
                    <br /> and how they relate to you
                  </Paragraph>
                  <div>Type</div>

                  <Radio.Group onChange={onChangeData} value={data}>
                    <div>
                      <Radio value={"amount"}>Flat fee</Radio>
                    </div>
                    <div>
                      <Radio value={"percentage"}>Percentage of remining balance</Radio>
                    </div>
                  </Radio.Group>

                  <div
                    className="internal d-flex
                "
                  >
                    {data === "percentage" ? (
                      <>
                        <label>Percentage(%)</label>
                        <InputField size="large" colon={false} name={""} />
                      </>
                    ) : (
                      <>
                        <div className="space_taker">
                          <label>Amount(USD)</label>
                          <InputField size="large" colon={false} name={""} />
                        </div>
                      </>
                    )}

                    <div className="space_taker">
                      <label>Frequency</label>

                      <Selectx
                        showSearch
                        size="large"
                        name="frequency"
                        handleChange={() => {}}
                        placeholder="Select Frequency"
                        options={frequency.map((data) => {
                          return { id: data?.id, label: data?.name };
                        })}
                      />
                    </div>
                    <div className="space_taker">
                      <label>
                        Grace period
                        <TooltipX title={"text"}>
                          <BsFillQuestionCircleFill />
                        </TooltipX>
                      </label>

                      <Selectx
                        showSearch
                        size="large"
                        name="timePeriod"
                        handleChange={() => {}}
                        placeholder="Select time period"
                        options={timePeriod.map((data) => {
                          return { id: data?.id, label: data?.name };
                        })}
                      />
                    </div>
                  </div>
                </>
              ) : null}
            </>
          </>
        ) : (
          <>
            <div className="d-flex mb-30">
              <BsFillCheckCircleFill style={{ color: "green" }} className="alignment" />
              <Paragraph>Saved.(changes for this will apply following day.) </Paragraph>
            </div>
          </>
        )}
        <div className="d-flex">
          <Buttonx
            type="default"
            btnText="Cancel"
            htmlType="button"
            clickHandler={() => {}}
            className="btn-default btn-form-size mr-20 pxP-width"
          />
          <Buttonx btnText="Save" className="btn-primary btn-form-size pxP-width" />
        </div>
      </div>
    </>
  );
};

export default LastFees;

const frequency = [
  {
    id: 1,
    name: "Once per invoice",
  },
  {
    id: 2,
    name: "Per month",
  },
  {
    id: 1,
    name: "Per day",
  },
];

const timePeriod = [
  {
    id: 1,
    name: "None",
  },
  {
    id: 2,
    name: "1 day",
  },
  {
    id: 3,
    name: "5 days",
  },
  {
    id: 4,
    name: "7 days",
  },
  {
    id: 5,
    name: "14 days",
  },
  {
    id: 6,
    name: "30 days",
  },
];
