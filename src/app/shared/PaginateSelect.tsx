/** @format */

import React, { useState } from "react";
import { Form, Select } from "antd";
import { Buttonx } from "./Button";
import { paginateprops } from "./types";
import { Spinner } from "./PageLoader";
import { useDynamicSelectPagination } from "app/Hooks";

const { Option } = Select;

export const PaginateSelectX = ({
  url,
  name,
  size,
  label,
  value,
  handleAddNew,
  handleChange,
  report = false,
  showAll = false,
  required = true,
  disabled = false,
  contactType = "",
  allowClear = true,
  showButton = false,
  placeholder = "Search or Select",
}: paginateprops) => {
  // @ts-ignore
  // const [open, setOpen] = useState(false);
  const [Open, setSelectopen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const handletoggleSelect = () => setSelectopen(!Open);
  const {
    fetching,
    options,
    handleScroll,
    debounceFetcher,
    hasContentLoading,
    handleOptionDeselect,
  } = useDynamicSelectPagination(url, true, showAll, [], report ? contactType : "");

  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };

  return (
    <Form.Item
      label={label}
      name={name}
      className="flex_root"
      rules={[
        {
          required: required,
          message: "please select one",
        },
      ]}
    >
      <Select
        showSearch
        open={Open}
        size={size}
        value={value}
        disabled={disabled}
        filterOption={false}
        allowClear={allowClear}
        searchValue={searchValue}
        placeholder={placeholder}
        onPopupScroll={handleScroll}
        onClick={handletoggleSelect}
        // onFocus={() => setOpen(true)}
        onBlur={() => setSelectopen(false)}
        onClear={handleOptionDeselect}
        onDeselect={handleOptionDeselect}
        loading={fetching || hasContentLoading}
        // dropdownStyle={{ maxHeight: '260px'}}
        onChange={(_, option: any) => handleChange(option?.dataObject)}
        onDropdownVisibleChange={(open) => open && handleOptionDeselect()}
        popupClassName=" generic_item_dropdown overlap dropdown--scroll dropdown--scroll-nogap"
        className="remove-select-icon"
        onSearch={(value) => {
          const emoji = /[^\x00-\x7F]/g;
          const filteredValue = removeEmojis(value);
          setSearchValue(filteredValue);
          //@ts-ignore
          !emoji.test(value) && debounceFetcher(filteredValue);
        }}
        suffixIcon={
          <img
            alt="dropdown icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        }
        dropdownRender={(menu) =>
          fetching ? (
            <div style={{ width: "100%", textAlign: "center" }}>
              <Spinner size={"50px"} />
            </div>
          ) : (
            <>
              {showButton && (
                <div>
                  <Buttonx
                    htmlType="button"
                    btnText="Add new"
                    clickHandler={handleAddNew}
                    className="btn-primary btn-form-size w-100  d-flex align-center justify-center"
                    icon={
                      <img
                        alt="plus icon"
                        className="mr-10 brightness"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/plus_2x.svg`}
                      />
                    }
                  />
                </div>
              )}
              {menu}
            </>
          )
        }
      >
        {options?.map((val: any) =>
          typeof val === "string" ? (
            <Option value={val} key={val}>
              {val}
            </Option>
          ) : (
            <Option value={val.id} key={val.id} dataObject={val}>
              {val.country_name ? val.country_name : val.label}
            </Option>
          )
        )}
      </Select>
    </Form.Item>
  );
};
