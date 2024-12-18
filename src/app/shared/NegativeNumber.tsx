import { Input } from "antd";
import { useEffect, useState } from "react";

export const NegativeNumber = ({
  name,
  form,
  value,
  currency = "",
  size = "large",
  disabled = false,
}) => {
  const numberRegex = /^-?\d*(\.\d*)?$/;

  const [negative, setNegative] = useState(false);
  useEffect(() => {
    setNegative(value?.sign === "-" ? true : false);
  }, []);
  const handleBlur = () => {
    if (!value || isNaN(parseFloat(value?.value))) {
      form.setFieldValue(name, { sign: negative ? "-" : "+", value: 0.0 });
    } else {
      form.setFieldValue(name, {
        sign: negative ? "-" : "+",
        value: parseFloat(value?.value).toFixed(2),
      });
    }
  };
  const handleChange = (e) => {
    let check = e.target.value;
    if (check === "") {
      setNegative(false);
    }
    if (check.includes("-")) {
      setNegative((prevNegative) => !prevNegative);
      form.setFieldValue(name, {
        ...form.getFieldValue(name),
        sign: !negative ? "-" : "+",
      });
      return;
    }
    if (numberRegex.test(check)) {
      if (check !== "") {
        const value = check.length <= 10 ? check : check.slice(0, 10);
        form.setFieldValue(name, { sign: negative ? "-" : "+", value: value || 0 });
      } else {
        form.setFieldValue(name, { sign: "+", value: "" });
      }
    }
  };
  const handleFocus = (e) => {
    e.target.select();
  };
  return (
    <Input
      step="0.01"
      type="text"
      name={name}
      size={size as any}
      disabled={disabled}
      onBlur={handleBlur}
      value={value?.value}
      onFocus={handleFocus}
      onChange={handleChange}
      className="no-transition"
      prefix={<span>{negative ? `-${currency}` : currency}</span>}
    />
  );
};
