/** @format */

import { useState } from "react";
import { AutoComplete, Form } from "antd";

export const AutoCompletex = ({
  name,
  label,
  onSelect,
  innerRef,
  disabled,
  className,
  rules = [],
  options = [],
  filterOption,
  colon = false,
  size = "large",
  popupClassName,
  placeholder = "",
  showArrow = true,
  allowClear = true,
  showSearch = true,
  //@ts-ignore
  defaultValue = null,
  required = false,
  //@ts-ignore
  handleChange = () => {},
  form,
}: any) => {
  const [Open, setSelectopen] = useState(false);
  const handletoggleSelect = () => setSelectopen(!Open);

  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };
  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    form.setFieldValue(name, filteredValue);
    handleChange(value);
  };

  return (
    <Form.Item
      name={name}
      colon={colon}
      rules={rules}
      className={className}
      label={
        label ? (
          <label className="form--label_style mb-5">
            {label}
            {required ? <span className="staric">*</span> : ""}
          </label>
        ) : null
      }
    >
      <AutoComplete
        open={Open}
        size={size}
        ref={innerRef}
        virtual={true}
        suffixIcon={null}
        disabled={disabled}
        value={defaultValue}
        dataSource={options}
        showArrow={showArrow}
        showSearch={showSearch}
        allowClear={allowClear}
        onChange={handleSearch}
        placeholder={placeholder}
        filterOption={filterOption}
        optionFilterProp="children"
        onClick={handletoggleSelect}
        className="remove-select-icon"
        onBlur={() => setSelectopen(false)}
        popupClassName={` ${popupClassName}`}
        getPopupContainer={(trigger) => trigger.parentNode}
        onSelect={() => {
          onSelect;
          setSelectopen(false);
        }}
      />
    </Form.Item>
  );
};
