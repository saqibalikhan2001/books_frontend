/** @format */

import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Table,
  Image,
  Input,
  Button,
  Avatar,
  Select,
  Checkbox,
  Statistic,
  Popconfirm,
  Typography,
} from "antd";
import { Labels } from "static";
import { ImagePath } from "utils";
import { useStore } from "app/Hooks";
import { Spinner } from "app/shared";
import TextArea from "antd/es/input/TextArea";
import { ItemDetailModal } from "app/containers/Items/itemDetailModal";
import { issuedCreditsTotal, getAdjustmentTotal } from "utils/calculation";

const { Option } = Select;
const { Text } = Typography;
const { NAME, CODE, YES, NO, DELETE } = Labels;

export const CredititemTable = ({
  data,
  options,
  setData,
  details,
  customer_id,
  payment_due,
  currency = "",
  itemList = [],
  create = false,
  handleItemList,
  warehouses = [],
  issueableCredits,
  isModal = false,
  loadingInvoice = false,
}: any) => {
  const { created_by_platform } = useStore();
  const [rowCount, setRowCount] = useState(1);
  const [itemId, setItemId] = useState<number>();
  const [searchValue, setSearchValue] = useState("");
  const [itemOptions, setItemOptions] = useState<any>([]);
  const [itemSelectOpen, setItemSelectOpen] = useState(false);
  const [itemDetailModal, setItemDetailModal] = useState(false);
  const [itemLoading, setItemLoading] = useState(itemList?.length ? true : false);
  const [dataSource, setDataSource] = useState<any[]>([
    {
      rate: 0,
      id: null,
      sku: "",
      key: "0",
      total: 0,
      image: "",
      quantity: 1,
      item_id: null,
      adjustment: 0,
      item_unit: "",
      item_name: "",
      item_obj: null,
      warehouse_id: null,
      adjustment_amount: 0,
      return_type: false,
      quantity_processed: 0,
      extra_description: "",
      adjustement_criteria: "amount",
    },
  ]);

  const emptyRow = {
    rate: 0,
    sku: "",
    total: 0,
    id: null,
    label: "",
    quantity: 1,
    image: "",
    item_unit: "",
    item_name: "",
    item_obj: null,
    adjustment: 0,
    key: `${rowCount}`,
    warehouse_id: null,
    return_type: false,
    adjustment_amount: 0,
    extra_description: "",
    adjustement_criteria: "amount",
  };

  useEffect(() => {
    if (itemList?.length) {
      const newData = itemsResponse(itemList, created_by_platform, create, details);
      handleItemList(newData);
      setDataSource([...newData].map((item, i) => ({ ...item, key: `${i}` })));
      setRowCount((prev) => prev + 1);
      setItemLoading(false);
      setItemOptions([]);
    } else setDataSource([]);
    //eslint-disable-next-line
  }, [itemList.length, itemList[0]?.id]);

  useEffect(() => {
    // if(create)
    setData({
      issuedCredits: issuedCreditsTotal(dataSource, issueableCredits),
      deductions: getAdjustmentTotal(dataSource),
    });

    //eslint-disable-next-line
  }, [dataSource, issueableCredits]);
  const toggleItemSelect = () => setItemSelectOpen(!itemSelectOpen);
  const toggleItemDetailModal = () => setItemDetailModal(!itemDetailModal);

  const handleDescription = (index) => (e) => {
    let value = e.target.value;
    const formattedValue = value.replace(/[^\x00-\x7F]/g, "");
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      extra_description: formattedValue,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  const handleConfirm = (key: number, data: any) => {
    let newData;
    newData = dataSource.filter((item) => item.key !== String(key));
    // if (isModal) {
    const filteredItem = dataSource.find((item) => item?.unique_id === data?.unique_id);
    setItemOptions([...itemOptions, filteredItem]);
    if (!itemOptions.length) {
      setDataSource([...newData, emptyRow].map((item, i) => ({ ...item, key: `${i}` })));
    } else {
      setDataSource([...newData].map((item, i) => ({ ...item, key: `${i}` })));
    }
    // } else {
    //   newData.map((mappedItem, index: number) => ({
    //     ...mappedItem,
    //     key: `${index}`,
    //   }));
    //   setDataSource(newData);
    // }
    handleItemList(newData);
  };
  const handleSelectedOptionItems = (option: any, _row: any, index: number) => {
    const optionItems = option?.item || option?.items;
    const primary_warehouse = warehouses.find((item: any) => item.is_primary) || ({} as any);
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      ...option,
      key: `${index}`,
      id: optionItems?.id,
      label: optionItems?.name,
      item_obj: {
        key: `${Math.random()}`,
        value: optionItems?.id,
        label: [
          <Avatar
            size="large"
            src={
              <Image
                preview={false}
                src={
                  optionItems?.images?.length
                    ? ImagePath(optionItems?.images[0], created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                        import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                      }`
                }
              />
            }
          />,
          <span className="product_name">{optionItems?.name}</span>,
        ],
      },
      return_type: true,
      rate: option?.rate ?? 0,
      item_unit: option?.unit,
      quantity: option.quantity,
      unique_id: option?.unique_id,
      adjustment: option?.adjustment,
      item_name: optionItems?.name,
      adjustment_amount: option?.adjustment_amount ?? 0,
      adjustement_criteria: option?.adjustement_criteria,
      warehouse_id: option?.warehouse_id ?? primary_warehouse.id,
    };
    const filteredItems = itemOptions.filter((item) => item?.unique_id !== option?.unique_id);
    setItemOptions(filteredItems);
    if (itemOptions.length - 1) {
      setDataSource([...newData, emptyRow].map((item, i) => ({ ...item, key: `${i}` })));
    } else setDataSource(newData);
    handleItemList(newData);
    setRowCount((prev) => prev + 1);
  };
  const handleNumberChange = (row: any, index: number, name: string) => (event) => {
    let characterCheck = event.target.value;
    characterCheck = characterCheck.replace(/[eE]/g, "");
    let newNumber;
    if (!characterCheck) {
      if (name === "quantity_processed") newNumber = null;
      else newNumber = null;
    } else newNumber = characterCheck.length < 10 ? characterCheck : characterCheck.slice(0, 10);
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      [name]:
        name === "adjustment" &&
        newData[index]?.adjustement_criteria === "percent" &&
        parseFloat(newNumber) > 100
          ? 100
          : newNumber,
      adjustment_amount:
        name === "adjustment"
          ? row?.adjustement_criteria === "percent"
            ? parseFloat(newNumber) > 100
              ? 100
              : (row?.rate * newNumber * row?.quantity) / 100
            : newNumber
          : row?.adjustment_amount,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  const handleDiscountType = (_row, index) => (value) => {
    const newData = [...dataSource];
    // const item_level_discount = newData[index]?.adjustment ?? 0.0;
    newData[index] = {
      ...newData[index],
      adjustement_criteria: value,
      adjustment_amount: 0,
      adjustment: 0,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  const handleRetunItem = (_, index) => (e) => {
    const { checked } = e.target;
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      return_type: checked,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };
  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };
  const handleKeyDown = (e, index, idPrefix) => {
    e.stopPropagation();

    if (e.key === "ArrowDown" || (e.key === "ArrowUp" && index === 0) || e.keyCode === 69) {
      e.preventDefault();
    }
    let element;
    if (e.key === "ArrowDown" && index + 1 < dataSource.length - 1) {
      e.preventDefault();
      element = document.getElementById(`${idPrefix}${String(index + 1)}`);
    } else if (e.key === "ArrowUp" && index - 1 >= 0) {
      e.preventDefault();
      element = document.getElementById(`${idPrefix}${String(index - 1)}`);
    }
    setTimeout(() => {
      element?.select();
      element?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, 100);
  };
  const memoColumns = useMemo(
    () =>
      [
        {
          title: "",
          dataIndex: "",
          key: CODE,
          width: 10,
          render: () => (
            <img
              alt="drag and drop"
              className="ml-5 mt-10"
              src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/drag_drop.svg`}
            />
          ),
        },
        {
          title: "Product/Service",
          dataIndex: "item_obj",
          key: NAME,
          width: 170,
          ellipsis: true,
          editable: true,
          className: "product_table_empty_td",
          render: (item_id: any, row: any, index: number) => {
            return (
              <div>
                {row?.id ? (
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Avatar
                      size="large"
                      src={
                        <Image
                          preview={false}
                          src={
                            row.image
                              ? ImagePath(row.image, created_by_platform)
                              : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                  import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                                }`
                          }
                        />
                      }
                    />
                    <div
                      className="product_text_detail"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "10px",
                      }}
                    >
                      <span
                        className="product_name cursor text_underline"
                        style={{
                          color: `${!isModal ? "#0061DD" : "black"}`,
                        }}
                        onClick={() => {
                          !isModal && toggleItemDetailModal();
                          !isModal && setItemId(item_id?.value);
                        }}
                      >
                        {" "}
                        {row.label}{" "}
                      </span>
                      <span className="product_sku ">{row.sku}</span>
                    </div>
                  </div>
                ) : (
                  <Select
                    showSearch
                    labelInValue
                    value={item_id}
                    filterOption={false}
                    open={itemSelectOpen}
                    onSearch={handleSearch}
                    placement="bottomRight"
                    disabled={!customer_id}
                    searchValue={searchValue}
                    onClick={toggleItemSelect}
                    popupClassName="item_dropdown overlap"
                    placeholder={
                      !customer_id ? "Please Select Customer" : "Click to Select product/service"
                    }
                    onBlur={(e) => {
                      if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
                        e.preventDefault();
                        setItemSelectOpen(false);
                      }
                    }}
                    id={`select_item${index}`}
                    style={{
                      width: isModal ? 300 : "100%",
                      height: "100%",
                      pointerEvents: item_id ? "none" : "auto",
                    }}
                    onChange={async (_, option: any) => {
                      await handleSelectedOptionItems(option?.dataObject, row, index);
                      const element = document.getElementById(`select_item${index + 1}`);
                      setTimeout(() => {
                        element?.focus();
                      }, 0);
                    }}
                    suffixIcon={
                      <img
                        alt="arrow icon"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/dropdown.svg`}
                      />
                    }
                    className={`select_item ${row?.id ? "no-border" : "estimate_select_items"}`}
                    // getPopupContainer={(trigger) => trigger.parentElement}
                  >
                    {itemOptions?.map((itemoption: any) => {
                      const itemValue = itemoption?.item || itemoption?.items;
                      return (
                        <Option
                          value={itemValue?.id}
                          dataObject={itemoption}
                          label={itemValue?.name}
                          key={`${Math.random()}`}
                        >
                          <Avatar
                            size="large"
                            src={
                              <Image
                                preview={false}
                                src={
                                  itemValue.images.length
                                    ? ImagePath(itemValue?.images[0], created_by_platform)
                                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                                        import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                                      }`
                                }
                              />
                            }
                          />
                          <div className="product_text_detail">
                            <span className="product_name"> {itemValue?.name} </span>
                            <span className="product_sku ">{itemValue?.sku}</span>
                          </div>
                        </Option>
                      );
                    })}
                  </Select>
                )}
                {item_id ? (
                  <div className="desc_box mt-20">
                    <TextArea
                      rows={4}
                      cols={4}
                      showCount
                      maxLength={1000}
                      value={row?.extra_description}
                      onChange={handleDescription(index)}
                      className={`${row?.id === item_id?.value}` ? "my-text-area" : ""}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          },
        },
        {
          title: "Returnable Quantity",
          dataIndex: "",
          key: CODE,
          ellipsis: false,
          editable: true,
          width: 60,
          className: "text-right",
          render: (props: number | any) => (
            <div>
              <Statistic value={props?.quantity} valueStyle={{ fontSize: "14px" }} />
              <span className="qty_units">{props?.item_unit ? `${props?.item_unit}(s)` : ""}</span>
            </div>
          ),
        },
        // {
        //   title: "WAREHOUSE",
        //   dataIndex: "warehouse_id",
        //   key: CODE,
        //   ellipsis: true,
        //   editable: true,
        //   width: 80,
        //   render: () => {
        //     return (
        //       <Select
        //         disabled={true}
        //         size={"middle"}
        //         showArrow={false}
        //         placeholder="Warehouse"
        //         suffixIcon={<AiOutlineDown />}
        //         value={warehouses?.map((data) => {
        //           return data?.label;
        //         })}
        //       >
        //         {warehouses?.map((warehouse: any, index: number) => {
        //           <Option key={index} value={warehouse.id}>
        //             {warehouse?.label}
        //           </Option>;
        //         })}
        //       </Select>
        //     );
        //   },
        // },
        {
          title: <span className="width--req">Rate Sold at</span>,
          dataIndex: "rate",
          key: CODE,
          ellipsis: false,
          editable: true,
          className: "text-right v-align",
          width: 55,
          render: (rate: any) => <Text>{`${currency}${rate.toFixed(2)}`}</Text>,
        },

        {
          title: "Quantity",
          dataIndex: "quantity_processed",
          key: CODE,
          ellipsis: true,
          editable: true,
          width: 70,
          className: "text-right v-align",

          render: (quantity: number | any, row: any, index: any) => (
            <div className="credit__note--quantity">
              <Input
                type="number"
                name="quantity"
                disabled={!row?.id}
                id={`qty_box${index}`}
                value={parseInt(quantity)}
                status={parseInt(quantity) && row.id ? "" : "error"}
                className={`qty_box box-perf ${row.id && quantity !== null ? "no-border" : ""}`}
                onBlur={() => {
                  if (quantity) {
                    const newData = [...dataSource];
                    let quantity_processed = quantity > row?.quantity ? row?.quantity : quantity;
                    newData[index] = {
                      ...newData[index],
                      quantity_processed,
                    };
                    setDataSource(newData);
                    handleItemList(newData);
                  } else {
                    const newData = [...dataSource];
                    newData[index] = {
                      ...newData[index],
                      quantity_processed: 1,
                    };
                    setDataSource(newData);
                    handleItemList(newData);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, index, "qty_box")}
                onFocus={(e) => {
                  e.preventDefault();
                  const element: any = document.getElementById(`qty_box${index}`);
                  element.select();
                  element.scrollIntoView({ block: "nearest", inline: "nearest" });
                  // setTimeout(() => {
                  //   element?.select();
                  // }, 10);
                }}
                onChange={handleNumberChange(row, index, "quantity_processed")}
              />
              <span className="qty_units">{row?.item_unit ? `${row?.item_unit}(s)` : ""}</span>
              {!parseInt(quantity) && row.id && (
                <>
                  <span style={{ color: "red" }}>required</span> <br />
                </>
              )}
            </div>
          ),
        },
        {
          title: "Return item?",
          dataIndex: "return_type",
          className: "v-align",

          key: CODE,
          ellipsis: false,
          editable: true,
          width: 40,
          render: (return_type: any, row: any, index: number) => (
            <>
              <Checkbox checked={return_type} onChange={handleRetunItem(row, index)} />
              {/* <label>{return_type ? "Yes" : "No"}</label> */}
            </>
          ),
        },

        {
          title: <span className="width--req">Deduction Policy</span>,
          dataIndex: "adjustment",
          key: CODE,
          ellipsis: false,
          editable: true,
          width: 67,
          className: "text-right",
          render: (adjustment: any, row: any, index: number) => {
            return (
              <div
                style={{
                  display: "flex",
                }}
                className="estimate_discount_field credit-disc"
              >
                <Input
                  min={0}
                  step="0.01"
                  type="number"
                  maxLength={10}
                  name="adjustment"
                  value={adjustment}
                  disabled={
                    !row?.id || create
                      ? !details?.preferences?.status
                      : !details?.invoice?.creditNote?.deduction_status
                  }
                  id={`adjustment_box${index}`}
                  className={`adjustment_box ${row.id && adjustment !== null ? "no-border" : ""}`}
                  onFocus={(e) => {
                    e.preventDefault();
                    const element: any = document.getElementById(`adjustment_box${index}`);
                    element.select();
                    element.scrollIntoView({ block: "nearest", inline: "nearest" });
                    // setTimeout(() => {
                    //   element?.select();
                    // }, 10);
                  }}
                  onBlur={() => {
                    adjustment = adjustment?.replace(/[eE]/g, "");
                    if (adjustment) {
                      const newData = [...dataSource];
                      newData[index] = {
                        ...newData[index],
                        adjustment: adjustment ? (parseFloat(adjustment).toFixed(2) as any) : 0.0,
                      };
                      setDataSource(newData);
                    } else {
                      const newData = [...dataSource];
                      newData[index] = {
                        ...newData[index],
                        adjustment: 0.0,
                      };
                      setDataSource(newData);
                    }
                  }}
                  onPaste={(e) => {
                    // Allow only numbers and one decimal point
                    //@ts-ignore
                    const isValidKey = /[0-9.]/.test(e.key);
                    //@ts-ignore
                    if (!isValidKey && e.key !== 'Backspace' && e.key !== 'Tab') {
                      e.preventDefault();
                    }}}
                  onKeyDown={(e) => {
                    // Allow only numbers and one decimal point
                    const isValidKey = /[0-9.]/.test(e.key);
                    if (!isValidKey && e.key !== 'Backspace' && e.key !== 'Tab') {
                      e.preventDefault();
                    }}}
                  onChange={handleNumberChange(row, index, "adjustment")}
                />
                <Select
                  disabled={
                    !row?.id || create
                      ? !details?.preferences?.status
                      : !details?.invoice?.creditNote?.deduction_status
                  }
                  popupClassName="overlap"
                  value={row?.adjustement_criteria}
                  onChange={handleDiscountType(row, index)}
                  getPopupContainer={(trigger) => trigger.parentElement}
                  className={`discount_dropdown ${
                    row.id && adjustment !== null ? "no-border" : ""
                  } `}
                  suffixIcon={
                    <img
                      alt="arrow icon"
                      src={`${
                        import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                      }/static/media/dropdown.svg`}
                    />
                  }
                >
                  <Option value="percent">%</Option>
                  <Option value={"amount"}>{currency}</Option>
                </Select>
              </div>
            );
          },
        },
        {
          title: "Deduction",
          dataIndex: "adjustment_amount",
          key: CODE,
          ellipsis: false,
          editable: true,
          width: 65,
          className: "text-right v-align",
          render: (_, data) => {
            return (
              <Statistic
                precision={2}
                prefix={currency}
                valueStyle={{ fontSize: "14px" }}
                value={data?.adjustment_amount ?? 0}
                className={`no-space text-right amount---fix ${
                  isModal ? "adjust-amount-width" : ""
                }`}
              />
            );
          },
        },
        {
          title: "",
          dataIndex: "",
          key: "x",
          width: 18,
          align: "center" as const,
          justify: "center",
          render: (data: any, row: any, key: number) => (
            <div className="del_btn text_center">
              <Popconfirm
                key="confirm"
                zIndex={1101}
                okText={YES}
                cancelText={NO}
                placement="left"
                title={`${DELETE}  Product ?`}
                onConfirm={() => handleConfirm(key, data)}
                disabled={!row.id || dataSource.length === 1}
              >
                <Button
                  size="small"
                  // shape="circle"
                  key="deletebtn"
                  className="__delete-btn"
                  aria-disabled="true"
                  disabled={!row.id || dataSource.length === 1}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/deleteqtyadjrow.svg`}
                  />
                </Button>
              </Popconfirm>
            </div>
          ),
        },
      ].filter((col: any) => {
        return !col.hidden as any;
      }),
    //eslint-disable-next-line
    [options, handleNumberChange, handleConfirm]
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result?.destination?.index === dataSource?.length - 1) return;

    const items = Array.from(dataSource);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const myitems = items.map((item, index) => ({ ...item, key: `${index}` }));
    setDataSource([...myitems]);
    handleItemList(myitems);
  };
  return (
    <>
      {itemLoading || loadingInvoice ? (
        <Spinner />
      ) : (
        <>
          {itemList?.length > 0 && (
            <>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="table" direction="vertical" mode="standard" type="row">
                  {(provided) => (
                    <Table
                      dataSource={dataSource}
                      columns={memoColumns}
                      pagination={false}
                      rowKey="key"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      components={{
                        body: {
                          row: DraggableRow,
                        },
                      }}
                    >
                      {provided.placeholder}
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}
        </>
      )}
      <div className={`bill_box justify_end ${!isModal ? "" : "mr-0"}`}>
        <div className="final_payment">
          <div className="d-flex align-center justify_between mb-15">
            <Typography.Title level={5}>Deductions</Typography.Title>
            <Statistic
              precision={2}
              prefix={currency}
              className="no-space"
              value={getAdjustmentTotal(dataSource)}
            />
          </div>

          <div className="d-flex align-center justify_between  mb-15">
            <div className="d-flex align-center ">
              <Typography.Title level={5}>Payment due</Typography.Title>
            </div>
            <Statistic className="no-space" value={payment_due} prefix={currency} precision={2} />
          </div>

          <div className="d-flex justify_between  mb-15">
            <div className="d-flex align-center">
              <Typography.Title level={5}>Issuable credits</Typography.Title>
            </div>
            <Statistic
              precision={2}
              prefix={currency}
              className="no-space"
              value={issueableCredits}
            />
          </div>

          <div className="d-flex align-center justify_between credit_amount  mb-15">
            <div className="d-flex align-center">
              <Typography.Title level={5}>Total credit</Typography.Title>
            </div>
            <Statistic
              precision={2}
              prefix={currency}
              className={`no-space ${isModal ? "width-auto" : ""}`}
              value={data?.issuedCredits || 0}
            />
          </div>
          {/* <div className="d-flex align-center justify_between">

        </div> */}
        </div>
      </div>
      <ItemDetailModal
        isModal
        bool={itemDetailModal}
        detail={{ id: itemId }}
        toggle={toggleItemDetailModal}
      />
    </>
  );
};

const itemsResponse = (itemList: any, created_by_platform, create, details) => {
  const itemdata = itemList.map((item: any, i) => {
    const itemUrl =
      create && item?.item?.images?.length
        ? ImagePath(item?.item?.images[0], created_by_platform)
        : item?.items?.images?.length
        ? ImagePath(item?.items?.images[0], created_by_platform)
        : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
            import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
          }`;

    return {
      ...item,
      unique_id: item?.id,
      id: item.item_id,
      // invoice_item_id: create ? item?.invoice_id : item?.invoice_item_details_id,
      sku: create ? item?.item?.sku : item?.items?.sku,
      image: create ? item?.item?.images[0] : item?.items?.images[0],
      item_obj: {
        key: `${Math.random()}`,
        value: item?.item_id,
        label: [
          <Avatar size="large" src={<Image preview={false} src={itemUrl} />} />,
          <span className="product_name"> {create ? item.item_name : item?.items?.name} </span>,
        ],
      },
      label: create ? item.item_name : item?.items?.name,
      item_name: create ? item.item_name : item?.items?.name,
      adjustment_amount: create ? adjustmentAmount(details, item) : +item?.adjustment_amount,
      adjustment: create
        ? details?.preferences?.status
          ? details?.preferences?.adjustment
          : 0
        : +item.adjustment,
      adjustement_criteria: create
        ? details?.preferences?.status
          ? details?.preferences?.adjustement_criteria
          : "amount"
        : item?.adjustement_criteria,
      quantity_processed: create ? item?.quantity : item?.quantity_processed,
      rate: create ? item?.rate : details?.invoice?.invoice_details[i]?.rate, //this code change after recommendation of farhan
      quantity: create ? item?.quantity : details?.invoice?.invoice_details[i]?.quantity, //this code change after recommendation of farhan
      warehouse_id: item.warehouse_id,
      extra_description: create ? item?.extra_description : item?.extra_description,
      item_unit: create ? item?.item?.unit : item?.items?.unit,
      return_type: create ? true : item?.return_type,
    };
  });
  return itemdata;
};

const DraggableRow = (props) => (
  <Draggable
    draggableId={props["data-row-key"]}
    index={Number(props["data-row-key"])}
    isDragDisabled={props?.children[0]?.props?.record?.id === null}
  >
    {(provided) => {
      return (
        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {React.Children.map(props.children, (child) =>
            React.cloneElement(child, { dragging: provided.dragging })
          )}
        </tr>
      );
    }}
  </Draggable>
);

const adjustmentAmount = (details, item) => {
  let amount = 0;
  if (details?.preferences?.status) {
    if (details?.preferences?.adjustement_criteria === "percent")
      amount = (item?.rate / 100) * details?.preferences?.adjustment * item?.quantity;
    else amount = details?.preferences?.adjustment;
  }
  return amount;
};
