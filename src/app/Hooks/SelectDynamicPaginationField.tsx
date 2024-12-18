import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Empty, Image } from "antd";
import { AsyncPaginate } from "react-select-async-paginate";
import { components } from "react-select";
import { Buttonx, Spinner } from "app/shared";
import { ImagePath } from "utils";
import { useStore } from "./useStore";
import { useAxios } from "./useAxios";
import { ClipLoader } from "react-spinners";

// const { BsPlus } = Icons;

const addNew = {
  value: "createNew",
  label: (
    <Buttonx
      icon={
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/plus_2x.svg`}
          className="brightness mr-10"
          alt="plus icon"
        />
      }
      btnText="Add New"
      // clickHandler={handleAddNew}
      className="btn-primary btn-form-size w-100  d-flex align-center justify-center"
    />
  ),
  className: "add-new-option",
};

const prepareOptionWithImage = (options, created_by_platform) => {
  let modiFiedOptions = options.map((option) => {
    // const image = typeof option.images !== 'undefined' ? option.images[0] : '';
    return {
      ...option,
      label: (
        <div className="option--with-image">
          <Avatar
            size="large"
            src={
              <Image
                preview={false}
                src={
                  option?.images?.length
                    ? ImagePath(option?.images[0], created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                        import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
                      }`
                }
              />
            }
          />
          <div className="desc">
            {option?.label}
            <span className="small-td-info">{option?.sku}</span>
          </div>
        </div>
      ),
    };
  });
  return modiFiedOptions;
};

//@ts-ignore
const IndicatorComponent = ({ children, ...props }) => {
  return null;
};

//@ts-ignore
const DropdownComponent = ({ children, ...props }) => {
  if (props.isFocused && !props.selectProps.isLoading) {
    return (
      //@ts-ignore
      <components.ValueContainer {...props}>
        <img
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/search.svg`}
          alt="search icon"
        />
      </components.ValueContainer>
    );
  }
  if (props.isFocused && props.selectProps.isLoading) {
    return (
      //@ts-ignore
      <components.ValueContainer {...props}>
        <ClipLoader size={20} color="gray" />
      </components.ValueContainer>
    );
  }
  return (
    //@ts-ignore
    <components.ValueContainer {...props}>
      <img
        src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
        alt="dropdown"
      />
    </components.ValueContainer>
  );
};

const noOptionFound = {
  value: "0",
  label: <Empty className="p-0 m--unset" image={Empty.PRESENTED_IMAGE_SIMPLE} />,
  isdisabled: true,
  className: "noOptionFoundPagination",
};
export const SelectDynamicPaginationField = ({
  api = "",
  from = "",
  rowid = 0,
  error = "",
  value = null,
  newCust = {},
  editCust = {},
  clearable = true,
  disabled = false,
  withImage = false,
  addButton = false,
  onBlur = () => {},
  autoFocus = false,
  selecteditem = [],
  placeholder = "Select",
  handleChange = () => {},
  renderLoadOption = false,
}: any) => {
  const { callAxios } = useAxios();
  const [customError] = useState(false);
  const [count, setCount] = useState(0);
  const { created_by_platform } = useStore();
  const [blockEnter, setBlockenter] = useState(false);
  const [customerlist, setCustomerList] = useState<any>([]);
  const [customValue, setCustomValue] = useState<any>(null);
  const [inputsearchValue, setInputSearchValue] = useState<any>("");
  const components = { LoadingIndicator: IndicatorComponent, DropdownIndicator: DropdownComponent };

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      paddingTop: 0,
      marginTop: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      paddingTop: "0px",
    }),
    option: (provided) => ({
      ...provided,
      // Assuming option 1 has a value of "option1" or you can check the index
      // padding: state.data.value === "createNew" ? 0 : 10,
      // position: state.data.value === "createNew" ? "sticky" : "unset",
      // top: state.data.value === "createNew" ? "1px" : "unset",
      // height: state.data.value === "createNew" ? "62px" : "auto",
      // marginTop: state.data.value === "createNew" ? 2 : "auto",
      // paddingTop: state.data.value === "createNew" ? 0 : "auto",
      // zIndex: state.data.value === "createNew" ? 999 : "auto",
    }),
  };

  useEffect(() => {
    if (newCust.value) setCustomerList([...customerlist, newCust]);
  }, [newCust]);

  useEffect(() => {
    if (value === null) setCount(1);
  }, [value]);

  useEffect(() => {
    if (from === "adjustment") {
      if (renderLoadOption) setCount(1);
      else setCount(0);
    }
  }, [renderLoadOption]);

  useEffect(() => {
    if (editCust.value) setCustomerList([...customerlist, editCust]);
  }, [editCust]);

  const notselectedItem = (list) => {
    if (selecteditem.length) {
      for (let i = 0; i < selecteditem.length; i++) {
        list = list.filter((data) => {
          return data.id != selecteditem[i];
        });
      }
    }
    return list;
  };

  //@ts-ignore
  const loadOptions = async (scan: search, loadedOptions, { page }) => {
    const responsejson: any = [];
    let response: any = [];
    const search = scan.replace(/[^\x00-\x7F]/g, "");
    if (search.length >= 1) {
      response = await callAxios({
        url: `${api}?page=${page}&search=${search.replace("&", "%26")}`,
      });
      if (response?.data?.length > 0) {
        var item = getFilteredItem(search, notselectedItem(response.data));
        if (item && item.length === 1) {
          handleChange(item[0], rowid);
        }
      }
    }
    if (!search) {
      response = await callAxios({ url: `${api}?page=${page}` });
    }
    response.data = notselectedItem(response.data);
    let options = withImage ? prepareOptionWithImage(response.data, created_by_platform) : null;
    if (response.data.length === 0) {
      addButton ? responsejson.push(addNew, noOptionFound) : responsejson.push(noOptionFound);
    } else {
      if (page === 1) {
        withImage
          ? addButton
            ? responsejson.push(addNew, ...options)
            : responsejson.push(...options)
          : addButton
          ? responsejson.push(addNew, ...response.data)
          : responsejson.push(...response.data);
      } else {
        withImage ? responsejson.push(...options) : responsejson.push(...response.data);
      }
    }

    setCustomerList([...customerlist, ...responsejson]);
    let hasMore = response.current_page < response.last_page;
    return {
      options: responsejson,
      hasMore,
      additional: {
        page: page + 1,
      },
    };
  };

  //@ts-ignore
  const onInputChange = async (val, list = [], from = "") => {
    setInputSearchValue(val.replace(/[^\x00-\x7F]/g, ""));
    const inputVale = val.replace(/[^\x00-\x7F]/g, "");
    if (inputVale.length >= 3) setCount(1);
    else setCount(0);
    setBlockenter(inputVale.length >= 7 ? true : false);
    // var item =
    //   from === 'loadoption'
    //     ? getFilteredItem(val, list)
    //     : getFilteredItem(val, customerlist);
    // if (item && item.length === 1) {
    //   handleChange(item[0], rowid);
    // }
  };

  useMemo(() => {
    let findItem = customerlist.find((item) => item.value === value);
    findItem =
      findItem && "value" in findItem
        ? { ...findItem, label: findItem.label, value: findItem.value }
        : null;
    setCustomValue(findItem);
  }, [value, customerlist]);

  return (
    <>
      <div
        className={`${
          !disabled && customError && !error && !value === true
            ? "input-error-field asyn-paginate-custom"
            : "asyn-paginate-custom"
        } ${error ? "fieldError" : ""}`}
      >
        <AsyncPaginate
          // isLoading
          id="paginate-select"
          cacheUniqs={[count]}
          styles={customStyles}
          // editCust={editCust}
          // newCust={newCust}
          value={customValue}
          style={{ zIndex: 999 }}
          //@ts-ignore
          loadOptions={loadOptions}
          onChange={async (option) => {
            await handleChange(option);
            setTimeout(() => {
              //@ts-ignore
              document?.activeElement?.blur();
            }, 50);
          }}
          inputValue={inputsearchValue}
          withImage={withImage}
          isClearable={clearable}
          isOptionDisabled={(option) => option.isdisabled}
          className="asyncPaginateParent"
          isDisabled={disabled}
          
          //@ts-ignore
          onInputChange={onInputChange}
          placeholder={placeholder}
          onKeyDown={(e) =>
            e.key === "Enter" && blockEnter
              ? (e.preventDefault(),
                setTimeout(() => {
                  setBlockenter(false);
                }, 10))
              : null
          }
          autoFocus={autoFocus}
          onBlur={onBlur}
          suffix={
            <img
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
              alt="dropdown"
            />
          }
          addButton={addButton}
          loadingMessage={() => (
            <div style={{ width: "100%", textAlign: "center" }}>
              {/* <Spin size="small" style={{ padding: "0 12px" }} /> */}
              <Spinner size={"50px"} />
            </div>
          )}
          noOptionsMessage={() => null}
          additional={{
            page: 1,
          }}
          //@ts-ignore
          components={components}
        />
        {!disabled && customError && !error && !value && (
          <div className="field-error">Required</div>
        )}
      </div>
    </>
  );
};

export function getFilteredItem(val, items) {
  const value = val.trim();
  var invalidChars = "!,\\,|,;,@,#,$,%,^,&,*,(,),<,>,/,~,`";
  var found = "false";
  if (value !== undefined && value !== null) {
    var invCharsArr = invalidChars.split(",");
    var fieldsArr = value.split("");
    for (var i = 0; i < fieldsArr.length; i++) {
      if (invCharsArr.indexOf(fieldsArr[i]) > -1) {
        found = "true";
        break;
      }
    }
  }

  let searchedItems;
  if (found === "true") {
    return null;
  } else if (value !== "") {
    searchedItems = items.filter(
      (item) =>
        (item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.sku && item.sku.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.unit && item.unit.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.ean && item.ean.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.isbn && item.isbn.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.mpn && item.mpn.toLowerCase().indexOf(value.toLowerCase()) > -1) ||
        (item.upc && item.upc.toLowerCase().indexOf(value.toLowerCase()) > -1)
    );
  } else {
    return null;
  }
  if (searchedItems && searchedItems.length === 1) {
    var searchedItems1 = searchedItems.filter(
      (item) =>
        (item.name && item.name.toLowerCase() === value.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase() === value.toLowerCase()) ||
        (item.unit && item.unit.toLowerCase() === value.toLowerCase()) ||
        (item.ean && item.ean.toLowerCase() === value.toLowerCase()) ||
        (item.isbn && item.isbn.toLowerCase() === value.toLowerCase()) ||
        (item.mpn && item.mpn.toLowerCase() === value.toLowerCase()) ||
        (item.upc && item.upc.toLowerCase() === value.toLowerCase())
    );
    return searchedItems1 && searchedItems1.length === 1 ? searchedItems1 : null;
    //return searchedItems
  } else {
    return null;
  }
}
