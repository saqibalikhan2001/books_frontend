/** @format */

import { useState } from "react";
import { DatePicker, Form } from "antd";
import { DatePickerProps } from "./types";
import { Content } from "static";

const { RangePicker } = DatePicker;

export const DatePickerx = ({
  name,
  label,
  // hidelabel = false,
  style,
  format,
  onChange = () => null,
  showTime,
  disableDate,
  defaultValue,
  popupClassName,
  is_date = true,
  size = "middle",
  disabled = false,
  allowClear = true,
  isRequired = false,
  inputReadOnly = false,
}: // disableDate = false,
Partial<DatePickerProps>) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <Form.Item
      name={name}
      colon={false}
      style={style}
      className="flex_root"
      rules={[{ type: "object", required: isRequired, message: Content.select_date }]}
      label={
        <span className="form--label_style mb-5">
          {label}
          {isRequired ? <span className="staric">&nbsp;*</span> : ""}
        </span>
      }
    >
      {/* DEVLOPER NOTE:clearIcon={true} by ME as discussed with Ahmad Hassan bcz causing issues with cancel svg 
      rendering  */}
      {is_date ? (
        <DatePicker
          showToday
          size={size}
          format={format}
          allowClear={allowClear}
          // clearIcon={true}
          disabled={disabled}
          onChange={(date) => {
            //@ts-ignore
            onChange(date);
            setOpenDatePicker(false);
          }}
          open={openDatePicker}
          placement="bottomRight"
          style={{ width: "100%" }}
          disabledDate={disableDate}
          inputReadOnly={inputReadOnly}
          popupClassName={popupClassName}
          className="symbol_adj"
          onBlur={() => setOpenDatePicker(false)}
          onClick={() => setOpenDatePicker(!openDatePicker)}
          getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
          suffixIcon={
            <img
              alt="calender Icon"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/calendar.svg`}
            />
          }
        />
      ) : (
        <RangePicker
          showTime={showTime}
          onChange={onChange}
          defaultValue={defaultValue}
          renderExtraFooter={() => "extra footer"}
          style={{ width: "67%", marginTop: "10px" }}
        />
      )}
    </Form.Item>
  );
};
