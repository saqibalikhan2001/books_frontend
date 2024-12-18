/** @format */

import { useEffect, useMemo, useState } from "react";
import { Table, Image, Button, Select, Statistic, Popconfirm, Input, Avatar } from "antd";
import { Labels } from "static";
import { ImagePath } from "utils";
import { TableProps } from "../Types";
import { Icons, Spinner } from "app/shared";
import { useDynamicSelectPagination, useStore } from "app/Hooks";

const { Option } = Select;
const { AiOutlineDown } = Icons;
const { NAME, CODE, YES, NO, DELETE } = Labels;

export const AdjustmentTable = ({
  url,
  item,
  className,
  adjustment,
  itemDetail,
  warehouseId,
  handleItemList,
  stockPreference,
}: TableProps) => {
  const { created_by_platform } = useStore();
  const [rowCount, setRowCount] = useState(1);
  const [dataSource, setDataSource] = useState<any[]>([
    {
      id: null,
      key: "0",
      sku: "",
      images: [],
      quantity: 0,
      item_name: "",
      adjusted_quantity: 0,
      accounting_quantity: 0,
    },
  ]);

  const selectedIds = dataSource.filter((item) => item?.id).map((item) => item?.id);
  const {
    fetching,
    options,
    handleScroll,
    debounceFetcher,
    hasContentLoading,
    handleOptionDeselect,
  } = useDynamicSelectPagination(url, adjustment, false, selectedIds);

  useEffect(() => {
    if (itemDetail) {
      const currentItem = {
        ...itemDetail,
        key: "0",
        quantity: 1,
        id: itemDetail.id,
        sku: itemDetail.sku,
        images: itemDetail.images,
        item_name: itemDetail.name,
        adjusted_quantity: stockPreference?.preferences?.physical
          ? itemDetail?.stocks[0]?.physical_quantity + 1
          : itemDetail?.stocks[0]?.accounting_quantity + 1,
        accounting_quantity: stockPreference?.preferences?.physical
          ? itemDetail?.stocks[0]?.physical_quantity
          : itemDetail?.stocks[0]?.accounting_quantity,
      };
      setDataSource([currentItem]);
      handleItemList([currentItem]);
    }
  }, [itemDetail]);

  const clearAllLines = () => {
    setDataSource([
      {
        id: null,
        key: "0",
        images: [],
        quantity: 0,
        item_name: "",
        adjusted_quantity: 0,
        accounting_quantity: 0,
      },
    ]);
    handleItemList([]);
  };

  const handleSelectedItems = (option: any, index: number) => {
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      key: `${index}`,
      quantity: 1,
      id: option.id,
      item_name: option.name,
      sku: option.sku,
      images: option.images,
      adjusted_quantity: stockPreference?.preferences?.physical
        ? option?.physical_quantity + 1
        : option?.accounting_quantity + 1,
      accounting_quantity: stockPreference?.preferences?.physical
        ? option?.physical_quantity
        : option?.accounting_quantity,
    };
    setDataSource(newData);
    handleItemList(newData);
  };

  const handleConfirm = (key: number) => {
    const newData = dataSource
      .filter((item) => item.key !== String(key))
      ?.map((mappedItem, index: number) => ({
        ...mappedItem,
        key: `${index}`,
      }));
    if (!newData.length) {
      const emptyObj = {
        id: null,
        key: "0",
        sku: "",
        images: [],
        quantity: 0,
        item_name: "",
        adjusted_quantity: 0,
        accounting_quantity: 0,
      };
      setDataSource([emptyObj]);
      handleItemList([]);
    } else {
      setDataSource(newData);
      handleItemList(newData);
    }
  };
  const handleChange =
    (row: any, index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = event.target.value;
      inputValue = inputValue.replace(/[^0-9-]/g, "");
      if (inputValue.indexOf("-") > 0) {
        inputValue = inputValue.replace(/-/g, "");
      } else if (inputValue.indexOf("-") === 0) {
        inputValue = "-" + inputValue.slice(1).replace(/-/g, "");
      }

      if (inputValue.startsWith("-")) {
        inputValue = "-" + inputValue.slice(1).replace(/^0+/, "") || "0";
      } else {
        inputValue = inputValue.replace(/^0+/, "") || "0";
      }
      const numericValue =
        inputValue === "" ? 0 : inputValue === "-" ? 0 : parseInt(inputValue, 10);

      const newData = [...dataSource];
      newData[index] = {
        ...newData[index],
        quantity: inputValue,
        adjusted_quantity: row.accounting_quantity + numericValue,
      };
      setDataSource(newData);
      handleItemList(newData);
    };

  const handleAdd = () => {
    const newData = {
      id: null,
      sku: "",
      images: [],
      quantity: 0,
      item_name: "",
      adjusted_quantity: 0,
      accounting_quantity: 0,
      key: `${rowCount}`,
    };
    setDataSource([...dataSource, newData]);
    setRowCount(rowCount + 1);
  };

  const memoColumns: any = useMemo(
    () => [
      {
        title: "Product",
        dataIndex: "id",
        key: NAME,
        ellipsis: true,
        editable: true,
        render: (item_id: any, row: any, index: number) => {
          return (
            <div>
              {item_id ? (
                <div className="product-row">
                  <Image
                    preview={false}
                    src={
                      row?.images.length
                        ? ImagePath(row?.images[0], created_by_platform)
                        : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                            import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                          }`
                    }
                  />
                  <div className="product-row-details">
                    <div className="product-title product_heading">{row.item_name}</div>
                    <div className="product-badge">{row.sku}</div>
                  </div>
                </div>
              ) : (
                <Select
                  placeholder={
                    !Boolean(warehouseId)
                      ? "Please Select Location"
                      : "Click to Select product/service"
                  }
                  getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                  showSearch
                  size="large"
                  value={item_id}
                  filterOption={false}
                  style={{ width: 300 }}
                  placement="bottomRight"
                  onSearch={debounceFetcher}
                  onPopupScroll={handleScroll}
                  suffixIcon={<AiOutlineDown />}
                  disabled={!Boolean(warehouseId)}
                  loading={fetching || hasContentLoading}
                  popupClassName="overlap clear-white-space dropdown--scroll"
                  onDropdownVisibleChange={(open) => open && handleOptionDeselect()}
                  onChange={async (_, option: any) => {
                    await handleSelectedItems(option?.dataObject, index);
                    const element = document.getElementById(`select_item${index + 1}`);
                    setTimeout(() => {
                      element?.focus();
                    }, 0);
                  }}
                  dropdownRender={(menu) =>
                    fetching ? (
                      <div style={{ width: "100%", textAlign: "center", height: "30px" }}>
                        <Spinner size={"50px"} />
                      </div>
                    ) : (
                      <>{menu}</>
                    )
                  }
                >
                  {options?.map((item) => (
                    <Option
                      value={item.id}
                      label={item.name}
                      dataObject={item}
                      key={`${Math.random()}`}
                    >
                      <div className="product_image" style={{ display: "flex", marginBottom: 10 }}>
                        <Avatar
                          size="large"
                          src={
                            <Image
                              preview={false}
                              src={
                                item?.images.length
                                  ? ImagePath(item?.images[0], created_by_platform)
                                  : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                      import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                                    }`
                              }
                            />
                          }
                        />
                        <div style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}>
                          <div className="product-title product_heading">{item.label}</div>
                          <div className="product-badge">{item.sku}</div>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              )}
            </div>
          );
        },
      },

      {
        title: "Quantity on hand",
        align: "right",
        dataIndex: "accounting_quantity",
        key: CODE,
        ellipsis: true,
        editable: true,
        hidden: "",
        render: (accounting_quantity: number) => (
          <Statistic
            className="text-right"
            value={accounting_quantity}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Adjustment",
        align: "right",
        dataIndex: "adjusted_quantity",
        key: CODE,
        ellipsis: true,
        editable: true,
        render: (adjusted_quantity: number, _: any) => (
          <Statistic
            className="text-right"
            value={adjusted_quantity}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Quantity Adjusted",
        className: "quantity_adjustment",
        dataIndex: "quantity",
        key: CODE,
        ellipsis: true,
        editable: true,
        // width: 60,
        render: (quantity: string, row: any, index: number) => (
          <Input
            min={0}
            name=""
            maxLength={10}
            value={quantity}
            disabled={!row.id}
            className="quantity_input"
            onChange={handleChange(row, index)}
            onBlur={() => {
              if (quantity !== "-") {
                const newData = [...dataSource];
                newData[index] = {
                  ...newData[index],
                  quantity: quantity,
                };
                setDataSource(newData);
              } else {
                const newData = [...dataSource];
                newData[index] = {
                  ...newData[index],
                  quantity: 0,
                };
                setDataSource(newData);
              }
            }}
          />
        ),
      },
      {
        title: "",
        dataIndex: "",
        key: "x",
        align: "center" as const,
        render: (__: any, _: any, key: number) => (
          <>
            {!itemDetail && (
              <Popconfirm
                key="confirm"
                zIndex={1101}
                okText={YES}
                cancelText={NO}
                placement="left"
                title={`${DELETE}  Item ?`}
                onConfirm={() => handleConfirm(key)}
                disabled={dataSource.length === 1 && !dataSource[0].id}
                getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
              >
                <Button
                  size="small"
                  shape="circle"
                  key="deletebtn"
                  aria-disabled="true"
                  className="delete_btn_popup adjust-according-space"
                  disabled={dataSource.length === 1 && !dataSource[0].id}
                  style={{ border: "none", background: "transparent" }}
                >
                  <img
                    alt=""
                    className="popup-over another-filter"
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/delete_light.svg`}
                  />
                </Button>
              </Popconfirm>
            )}
          </>
        ),
      },
    ],
    //eslint-disable-next-line
    [options, fetching, handleConfirm, handleChange]
  );
  return (
    <>
      <Table
        rowKey="key"
        pagination={false}
        className={className}
        columns={memoColumns}
        dataSource={dataSource}
      />
      {!itemDetail && (
        <>
          <Button className="btn-form-size btn-custom btn-default mr-10 h-30" onClick={handleAdd}>
            Add lines
          </Button>
          <Popconfirm
            showCancel
            okText="Yes"
            key="confirm"
            zIndex={1101}
            cancelText="No"
            placement="left"
            disabled={!item?.length}
            onCancel={(e) => e?.stopPropagation()}
            title={`Are you sure you want to clear all lines ?`}
            className={!item.length ? "ant-select-disabled" : "popup-confirm"}
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
            onConfirm={(e) => {
              e?.stopPropagation();
              clearAllLines();
            }}
          >
            <Button className="btn-form-size  btn-custom btn-default bulk-item-btn h-30 mb-40 bulk-item-btn">
              Clear all lines
            </Button>
          </Popconfirm>
        </>
      )}
    </>
  );
};
