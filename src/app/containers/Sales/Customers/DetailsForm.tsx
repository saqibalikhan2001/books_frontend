/** @format */

import { InputField } from "app/shared";

export const DetailsForm = ({ form }) => {
  return (
    <>
      <div className="form_box">
        <div className="flexbox form-row-container justify-content-between">
          <div className="form_group flex-47 mb-">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="facebook"
              label={"Facebook"}
              className="input_field"
              placeholder="Enter facebook"
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="twitter"
              label={"Twitter"}
              className="input_field"
              placeholder="Enter twitter"
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              name="skype"
              colon={false}
              label={"Skype"}
              className="input_field"
              placeholder="Enter skype"
            />
          </div>
          <div className="form_group flex-47">
            <InputField
              form={form}
              size="middle"
              colon={false}
              name="instagram"
              label={"Instagram"}
              className="input_field"
              placeholder="Enter instagram"
            />
          </div>
        </div>
      </div>
    </>
  );
};
