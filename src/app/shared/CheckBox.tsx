import { Form, Checkbox } from "antd";
import { CheckBoxTypes } from "./types";

const CheckBox = ({
  name = "",
  label = "",
  handleClick,
  noStyle = true,
  disabled = false,
}: CheckBoxTypes) => {
  return (
    <Form.Item name={name} valuePropName="checked" noStyle={noStyle}>
      <Checkbox disabled={disabled} onChange={handleClick}>
        {label}
      </Checkbox>
    </Form.Item>
  );
};
export default CheckBox;
