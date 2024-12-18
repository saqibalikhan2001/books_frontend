import { Form, Input, InputNumber } from "antd";
import { InputFieldProps } from "./types";

export const InputField = ({
  max,
  name,
  form,
  label,
  parser,
  onFocus,
  onPaste,
  innerRef,
  LeftIcon,
  bordered,
  rules = [],
  style = {},
  tooltip = "",
  colon = true,
  defaultValue,
  labelCol = {},
  suffix = null,
  type = "text",
  prefix = null,
  size = "large",
  maxLength = 255,
  disabled = false,
  password = false,
  placeholder = "",
  stringMode = true,
  required = false,
  addonAfter = null,
  dependencies = [],
  addonBefore = null,
  labelAlign = "right",
  customChange = false,
  className = "flex_root",
  onChange = () => null,
}: InputFieldProps) => {
  return (
    <Form.Item
      name={name}
      colon={colon}
      rules={rules}
      tooltip={tooltip}
      labelCol={labelCol}
      className={className}
      labelAlign={labelAlign}
      dependencies={dependencies}
      label={
        label && (
          <span className="form--label_style mb-5">
            {label}
            {required && <span className="staric">&nbsp;*</span>}
          </span>
        )
      }
      // {...(type !== "number" && { hasFeedback: hasFeedback })}
    >
      {type === "number" ? (
        <InputNumber
          min={0}
          max={max}
          size={size}
          ref={innerRef}
          prefix={prefix}
          parser={parser}
          controls={false}
          disabled={disabled}
          stringMode={stringMode}
          addonAfter={addonAfter}
          onChange={(value: any) => {
            const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
            form?.setFieldValue?.(name, formattedValue);
          }}
          style={{ width: "100%" }}
          placeholder={placeholder}
          addonBefore={addonBefore}
          // parser={(value) => value.replace(value, Math.ceil(value))}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{9})+(?!\d))/g, ",")}
        />
      ) : !password ? (
        <Input
          type={type}
          size={size}
          style={style}
          ref={innerRef}
          suffix={suffix}
          prefix={LeftIcon}
          onFocus={onFocus}
          onPaste={onPaste}
          onChange={
            customChange
              ? onChange
              : (e: any) => {
                  const { value } = e.target;
                  const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
                  form?.setFieldValue?.(name, formattedValue);
                }
          }
          disabled={disabled}
          bordered={bordered}
          maxLength={maxLength}
          addonAfter={addonAfter}
          placeholder={placeholder}
          defaultValue={defaultValue}
          addonBefore={addonBefore}
          autoComplete="current-password"
        />
      ) : (
        <Input.Password size={size} prefix={LeftIcon} autoComplete="current-password" />
      )}
    </Form.Item>
  );
};
