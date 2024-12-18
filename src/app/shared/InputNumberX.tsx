import { Input } from "antd";
import { useRef } from "react";

export const InputNumberX = ({
  id,
  name,
  step,
  value,
  payment,
  onBlur,
  onChange,
  placeholder,
  prefix = null,
  size = "large",
  disabled = false,
  addonBefore = null,
  addonAfter = false,
  allowDecimal = false,
  hasNegativeValue = false,
}: any) => {
  const inputRef = useRef(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    // const filteredInputValue = inputValue.replace(/[^\x00-\x7F]/g, "");
    const filteredInputValue = inputValue.replace(/[^\d.-]/g, ""); // Only allow digits, decimal point, and negative sign
    const regNumberDecimalAndNegative = /^-?\d*\.?\d*$/;
    const regNumberAndDecimal = /^\d*\.?\d*$/;
    const regInteger = /^\d*$/;
    if (
      (regNumberDecimalAndNegative.test(filteredInputValue) ||
        filteredInputValue === "" ||
        filteredInputValue === "-") &&
      allowDecimal &&
      hasNegativeValue
    ) {
      onChange(filteredInputValue);
    } else if (
      (regNumberAndDecimal.test(filteredInputValue) || filteredInputValue === "") &&
      allowDecimal &&
      !hasNegativeValue
    ) {
      onChange(filteredInputValue === "." ? "0.00" : filteredInputValue);
    } else if (
      (regInteger.test(filteredInputValue) || filteredInputValue === "") &&
      !allowDecimal
    ) {
      onChange(filteredInputValue);
    }
  };

  return (
    <Input
      id={id}
      name={name}
      size={size}
      step={step}
      value={value}
      ref={inputRef}
      onBlur={onBlur}
      prefix={prefix}
      disabled={disabled}
      onChange={handleChange}
      addonAfter={addonAfter}
      className="no-transition"
      placeholder={placeholder}
      addonBefore={addonBefore}
      maxLength={payment ? 3 : 10}
      onFocus={() => {
        //@ts-ignore
        inputRef?.current?.select();
      }}
    />
  );
};
