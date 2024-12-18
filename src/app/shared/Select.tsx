/** @format */

import { Fragment, useState } from "react";
import { Divider, Form, Select, Space } from "antd";
import { Buttonx, Icons } from "app/shared";
import { OptionPropss, SelectxProps } from "./types";

const { VscAdd } = Icons;
const { Option, OptGroup } = Select;

export const Selectx = ({
  name,
  label,
  mode,
  innerRef,
  disabled,
  className,
  rules = [],
  options = [],
  handleAddNew,
  colon = false,
  size = "large",
  popupClassName,
  loading = false,
  placeholder = "",
  showArrow = true,
  handleSort = true,
  allowClear = true,
  showSearch = true,
  showButton = false,
  repeat_opt = false,
  create_opt = false,
  defaultValue = null,
  handleToggle = () => {},
  required = false,
  handleChange = () => {},
  valueLabel = false,
  initialValue,
  currency = false,
  onlyDisplayname = false,
}: // labelInValue
SelectxProps) => {
  const [open, setSelectopen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handletoggleSelect = () => setSelectopen(!open);

  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };

  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };
  const handleChangeInternal = (value) => {
    if (mode === "tags") {
      setSearchValue("");
    }
    handleChange(value);
  };
  return (
    <Form.Item
      colon={colon}
      label={
        label ? (
          <label className="form--label_style mb-5">
            {label}
            {required ? <span className="staric">&nbsp;*</span> : ""}
          </label>
        ) : null
      }
      name={name}
      className={className}
      rules={rules}
      initialValue={initialValue}
    >
      <Select
        open={open}
        size={size}
        mode={mode}
        ref={innerRef}
        virtual={true}
        loading={loading}
        disabled={disabled}
        value={defaultValue}
        showArrow={showArrow}
        allowClear={allowClear}
        onChange={handleChangeInternal}
        onSearch={handleSearch}
        showSearch={showSearch}
        defaultActiveFirstOption
        searchValue={searchValue}
        placeholder={placeholder}
        onClick={handletoggleSelect}
        onBlur={(e) => {
          if (
            e.target.id == "email" ||
            !e.relatedTarget ||
            !e.relatedTarget.closest("#closingSlector")
          ) {
            e.preventDefault();
            setSelectopen(false);
          }
        }}
        // optionFilterProp="children"
        getPopupContainer={(trigger) => trigger.parentNode}
        className="remove-select-icon"
        popupClassName={`dropdown--scroll ${popupClassName}`}
        suffixIcon={
          <img
            alt="dropdown icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        }
        dropdownRender={(menu) => {
          return (
            <>
              {showButton && (
                <Buttonx
                  htmlType="button"
                  icon={
                    <img
                      alt="plus icon"
                      className="brightness mr-10"
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
                    />
                  }
                  btnText="Add New"
                  clickHandler={handleAddNew}
                  className="btn-primary btn-form-size w-100  d-flex align-center justify-center"
                />
              )}
              {menu}
              {create_opt && <DropDownCreateOption handleToggle={handleToggle} />}
              {repeat_opt && (
                <Buttonx size="small" btnText="Custom" clickHandler={handleToggle} type="text" />
              )}
            </>
          );
        }}
        filterOption={(input: any, option: any) =>
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        filterSort={
          handleSort
            ? (optionA: any, optionB: any) =>
                optionA?.children?.toLowerCase().localeCompare(optionB.children.toLowerCase())
            : undefined
        }
      >
        {options.map((val: OptionPropss, index: number) => {
          return !onlyDisplayname ? (
            <Fragment key={index}>
              {currency && "symbol" in val ? (
                <Option value={val.id} key={`${val.id}-${index}`}>
                  {`${val.symbol}`}
                </Option>
              ) : typeof val === "string" ? (
                <Option value={val} key={`${val}-${index}`}>
                  {val}
                </Option>
              ) : val && "label" in val && !valueLabel ? (
                <Option value={val.id} key={`${val.id}-${index}`}>
                  {val.label}
                </Option>
              ) : val && "label" in val && valueLabel ? (
                <Option value={val.value} key={`${val.value}-${index}`}>
                  {val.label}
                </Option>
              ) : val && "title" in val ? (
                <Option
                  value={val.id}
                  key={`${val.id}-${index}`}
                  style={{ bacgroundColor: "#f5f5f5" }}
                >
                  {val.title}
                </Option>
              ) : "accounts" in val ? (
                <OptGroup key={`${val.name}-${index}`} label={val.name}>
                  {val.accounts.map(({ id, title }) => (
                    <Option key={id} value={id}>
                      {`${title}`}
                    </Option>
                  ))}
                </OptGroup>
              ) : (
                "display_name" in val && (
                  <Option value={val.id} key={`${val.id}-${index}`}>
                    {val.display_name}
                  </Option>
                )
              )}
              )
            </Fragment>
          ) : (
            <Fragment key={index}>
              <Option
                value={
                  //@ts-ignore
                  val.id
                }
                key={`${index}`}
              >
                {
                  //@ts-ignore
                  val.label
                }
              </Option>
            </Fragment>
          );
        })}
      </Select>
    </Form.Item>
  );
};

const DropDownCreateOption = ({ handleToggle }: any) => (
  <>
    <Divider style={{ margin: "8px 0" }} />
    <Space
      style={{
        display: "block",
      }}
    >
      <Buttonx
        size="small"
        type="dashed"
        icon={<VscAdd />}
        btnText="Configure Terms"
        clickHandler={handleToggle}
        style={{ marginBottom: "5px" }}
      />
    </Space>
  </>
);
