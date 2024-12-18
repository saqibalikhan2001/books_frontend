import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  Form,
  Image,
  Input,
  Table,
  Modal,
  Avatar,
  Button,
  Select,
  Statistic,
  Popconfirm,
  Typography,
} from "antd";
import { TooltipX } from "./ToolTip";
import { Content, Labels } from "static";
import TextArea from "antd/es/input/TextArea";
import DebouncedInput from "./DebouncedInput";
import { NegativeNumber } from "./NegativeNumber";
import CreateItem from "app/containers/Items/Create";
import { editItemResponse } from "./itemTableFunctions";
import { DataSourceProps, ItemTableProps } from "./types";
import { ImagePath, getOrderTotal, getSubtotal } from "utils";
import { CreateTax } from "app/containers/Settings/Tax/Create";
import { getDiscounttotal, getTaxtotal } from "utils/calculation";
import { TaxModal } from "app/containers/Sales/Estimates/TaxModal";
import { ItemDetailModal } from "app/containers/Items/itemDetailModal";
import { Buttonx, ConfirmPopup, Icons, InputNumberX, Spinner } from "app/shared";
import { useAxios, useDynamicSelectPagination, usePermissions, useStore } from "app/Hooks";

const { Option } = Select;
const { RxCross2, BsPlus } = Icons;
const { NAME, CODE, YES, NO, DELETE } = Labels;

export const ItemTable = ({
  edit,
  form,
  sales,
  current,
  url = "",
  ModuleName,
  taxes = [],
  totalAmount,
  customer_id,
  itemUrl = "",
  currency = "",
  purchaseOrder,
  itemList = [],
  setTotalAmount,
  handleItemList,
  discount_level,
  warehouses = [],
  PO_Warehouse_Id,
  isModal = false,
  handleWarehouseId,
  showButton = false,
  shipping_charge = 0,
  purchaseAccount = {},
  handlePrimaryWarehouse,
  discount_transaction_level,
  transaction_level_discount_type,
  adjustment = { sign: "+", value: 0 },
}: ItemTableProps) => {
  const { callAxios } = useAxios();
  let [page, setPage] = useState(1);
  const { created_by_platform } = useStore();
  const [taxObj, setTaxObj] = useState<any>();
  const [subTotal, setSubTotal] = useState(0);
  const [rowCount, setRowCount] = useState(1);
  const { checkPermission } = usePermissions();
  const [itemObj, setItemObj] = useState<any>();
  const [itemId, setItemId] = useState<number>();
  const [taxModal, setTaxModal] = useState(false);
  const [bulkItem, setbulkItem] = useState<any>();
  const [inputValue, setInputValue] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [taxList, setTaxList] = useState<any>(taxes);
  const [isItemModal, setisItemModal] = useState(false);
  const [isBulkModal, setIsBulkModal] = useState(false);
  const [itemOptions, setItemOptions] = useState<any>([]);
  const [itemDetailInfo, setItemDetailInfo] = useState(false);
  const [itemDetailModal, setItemDetailModal] = useState(false);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const { has_TaxCreate_permission } = checkPermission("TaxCreate");
  const [selectedbulkItem, setSelectedbulkItem] = useState<any>([]);
  const [selectedRowsArray, setSelectedRowsArray] = useState<any>([]);
  const [selectedItemsIds, setSelecteditemIds] = useState<(number | null)[]>([]);
  const adjust: any = `${adjustment.sign}${adjustment?.value}`;

  // const { data: taxes = [], refetch } = useGetAllTaxesQuery("");

  const first_expense_account = purchaseAccount["expenseAccounts"]?.[0]?.id;
  const first_inventory_account = purchaseAccount["inventoryAccounts"]?.[0]?.id;

  const [dataSource, setDataSource] = useState<DataSourceProps[]>([
    {
      rate: 0,
      id: null,
      key: "0",
      total: "",
      quantity: 1,
      tax_rate: 0,
      tax_id: null,
      tax_name: "",
      tax_amount: 0,
      item_name: "",
      label: "",
      item_obj: null,
      account_id: null,
      warehouse_id: null,
      extra_description: "",
      discount_item_level: 0,
      discount_type: "percent",
      item_total_amount: 0,
      item_unit: "",
      sku: "",
      image: "",
    },
  ]);
  const emptyRow = {
    key: `${rowCount}`,
    id: null,
    item_name: "",
    quantity: 1,
    tax_rate: 0,
    tax_id: null,
    tax_name: "",
    tax_amount: 0,
    label: "",
    item_obj: null,
    rate: 0,
    discount_type: "percent",
    discount_item_level: 0,
    warehouse_id: null,
    account_id: null,
    extra_description: "",
    total: "",
    item_total_amount: 0,
    item_unit: "",
    sku: "",
    image: "",
    taxLabel: "",
  };
  const handleClear = () => {
    const newData = {
      key: `0`,
      id: null,
      item_name: "",
      label: "",
      item_obj: null,
      quantity: 1,
      tax_rate: 0,
      tax_name: "",
      tax_id: null,
      tax_amount: 0,
      rate: 0,
      discount_item_level: 0,
      warehouse_id: null,
      account_id: null,
      extra_description: "",
      total: "",
      item_total_amount: 0,
      item_unit: "",
      sku: "",
      image: "",
    };
    setDataSource([newData]);
    handleItemList([newData]);
    setSubTotal(getSubtotal([newData]));
    toggleConfirmModal();
  };
  useEffect(() => {
    if (itemList?.length) {
      const newData = editItemResponse(itemList, PO_Warehouse_Id, created_by_platform, taxList);
      handleItemList(newData);
      if (isModal) setDataSource([...newData].map((item, i) => ({ ...item, key: `${i}` })));
      else setDataSource([...newData, emptyRow].map((item, i) => ({ ...item, key: `${i}` })));
      setSubTotal(getSubtotal(newData));
      setRowCount(isModal ? newData.length : newData.length + 1);
    }
    //eslint-disable-next-line
  }, [itemList]);
  useEffect(() => {
    const validAdjust = isNaN(parseFloat(adjust)) ? 0 : parseFloat(adjust);
    if (
      adjust ||
      shipping_charge ||
      edit ||
      transaction_level_discount_type ||
      discount_transaction_level
    ) {
      if (discount_level === "transaction") {
        if (transaction_level_discount_type === "percent") {
          let totalTransactionDiscount =
            //@ts-ignore
            (subTotal * parseFloat(discount_transaction_level ?? 1)) / 100;
          setTotalAmount(
            subTotal +
              validAdjust +
              +shipping_charge +
              +getTaxtotal(dataSource) -
              totalTransactionDiscount
          );
        } else {
          //@ts-ignore
          let totalTransactionDiscount = subTotal - parseFloat(discount_transaction_level ?? 0);
          setTotalAmount(
            validAdjust + +shipping_charge + totalTransactionDiscount + +getTaxtotal(dataSource)
          );
        }
      } else {
        setTotalAmount(validAdjust + +shipping_charge + getOrderTotal(dataSource));
      }
    } else {
      setTotalAmount(getOrderTotal(dataSource));
    }
    //eslint-disable-next-line
  }, [
    adjust,
    dataSource,
    shipping_charge,
    discount_transaction_level,
    transaction_level_discount_type,
  ]);
  const fetchinitialData = () => {
    callAxios({
      url: `${itemUrl}/items?page=1&view=20&search=`,
    }).then((res) => {
      setbulkItem(res);
      setPage(1 + 1);
      setInfiniteLoading(false);
    });
  };

  useEffect(() => {
    if (isBulkModal) {
      setInfiniteLoading(true);
      callAxios({
        url: `${itemUrl}/items?page=${page}&view=20&search=`,
      }).then((res) => {
        setbulkItem(res);
        setPage(page + 1);
        setInfiniteLoading(false);
      });
    }
    //eslint-disable-next-line
  }, [isBulkModal]);

  useEffect(() => {
    if (taxObj?.id) handleTax(taxObj?.id, taxObj?.index, "createNew");
    //eslint-disable-next-line
  }, [taxObj?.id]);

  useEffect(() => {
    //@ts-ignore
    if (itemObj?.id) handleSelectedItems(itemObj, itemObj?.row, itemObj?.index);
    //eslint-disable-next-line
  }, [itemObj?.id]);

  ////////////////////////////////////////////Privious Price related code ///////////////////////////////
  useEffect(() => {
    if (ModuleName === "Invoice" || ModuleName == "Bill") {
      const uniqueIds = Array.from(
        //@ts-ignore
        itemList.reduce((set, item) => set.add(item?.item.id), new Set())
      );
      if (uniqueIds?.length > 0) {
        //@ts-ignore
        setSelecteditemIds(uniqueIds);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedItemsIds?.length > 0 && (ModuleName === "Invoice" || ModuleName === "Bill")) {
      getPreviousPrive(
        customer_id,
        selectedItemsIds,
        dataSource,
        setDataSource,
        callAxios,
        ModuleName
      );
    }
  }, [selectedItemsIds]);

  useEffect(() => {
    if (selectedItemsIds?.length > 0 && (ModuleName === "Invoice" || ModuleName === "Bill")) {
      getPreviousPrive(
        customer_id,
        selectedItemsIds,
        dataSource,
        setDataSource,
        callAxios,
        ModuleName
      );
    }
    //@ts-ignore
  }, [customer_id?.id]);

  /////////////////////////////////////////////**** End ******///////////////////////////////////////////

  const toggleConfirmModal = () => setIsConfirm(!isConfirm);
  const toggleItemModal = () => setisItemModal(!isItemModal);
  const toggleItemDetailModal = () => setItemDetailModal(!itemDetailModal);
  const toggleItemDetailInfoModal = () => setItemDetailInfo(!itemDetailInfo);

  const handleSelectedItems = (option: any, row: any, index: number) => {
    const primary_warehouse = warehouses.find((item: any) => item.is_primary) || ({} as any);
    handlePrimaryWarehouse?.(primary_warehouse.id);
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      item_unit: option?.unit,
      discount_type: "percent",
      inventory_type: option?.inventory_type,
      key: `${index}`,
      id: option?.id,
      label: option?.name,
      item_obj: {
        key: `${Math.random()}`,
        value: option?.id,
        label: [
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
          />,
          <div className="product_text_detail">
            <span className="product_name"> {option?.label} </span>
            <span className="product_sku ">{option?.sku}</span>
          </div>,
        ],
      },
      extra_description: "",
      quantity: row.quantity,
      discount_item_level: 0,
      item_name: option?.name,
      tax_id: option?.tax?.id ?? null,
      tax_rate: option?.tax?.rate ?? 0,
      tax_name: option?.tax?.name,
      warehouse_id: primary_warehouse.id,
      account_id:
        import.meta.env.VITE_ADD_ACCOUNTS === "true" && option?.inventory_type == "inventory"
          ? option?.inventory_account_id
            ? Number(option?.inventory_account_id)
            : first_inventory_account
          : option?.purchase_account_id
          ? Number(option?.purchase_account_id)
          : first_expense_account,

      sku: option.sku,
      image: option?.images?.[0],
      //@ts-ignore
      rate: sales
        ? parseFloat(option?.sales_unit_price)?.toFixed(2)
        : parseFloat(option?.purchase_unit_price)?.toFixed(2) ?? 0,
      total: (sales ? option?.sales_unit_price : option?.purchase_unit_price) * row.quantity,
      item_total_amount:
        (sales ? option?.sales_unit_price : option?.purchase_unit_price) * row.quantity,
    };
    if (option?.value && row.id !== null) {
      const data = newData.map((item, i) => ({
        ...item,
        key: `${i}`,
      }));
      setDataSource(data);
      setSelecteditemIds([...selectedItemsIds, option?.id]);
    } else {
      setDataSource(
        [...newData, emptyRow].map((item, i) => ({
          ...item,
          key: `${i}`,
        }))
      );
      setSelecteditemIds([...selectedItemsIds, option?.id]);
    }
    setSubTotal(getSubtotal(newData));
    handleItemList(newData);
    setRowCount((prev) => prev + 1);
  };
  //@ts-ignore
  const handleSelectedOptionItems = (option: any, row: any, index: number) => {
    const primary_warehouse = warehouses.find((item: any) => item.is_primary) || ({} as any);
    handlePrimaryWarehouse?.(primary_warehouse.id);
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      ...option,
      discount_type: option?.discount_type,
      key: `${index}`,
      item_unit: option?.item?.unit,
      id: option?.item?.id,
      label: option?.item?.name,
      item_obj: {
        key: `${Math.random()}`,
        value: option?.item?.id,
        label: [
          <Avatar
            size="large"
            src={
              <Image
                preview={false}
                src={
                  option?.item?.images?.length
                    ? ImagePath(option?.item?.images[0], created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                        import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
                      }`
                }
              />
            }
          />,
          <div className="product_text_detail">
            <span className="product_name"> {option?.item?.name} </span>
            <span className="product_sku ">{option?.item?.sku}</span>
          </div>,
        ],
      },
      extra_description: option?.extra_description,
      quantity: option.quantity,
      discount_item_level: option?.discount_item_level,
      item_name: option?.item?.name,
      tax_id: option?.tax?.id ?? null,
      tax_rate: option?.tax?.rate ?? 0,
      tax_name: option?.tax?.name,
      warehouse_id: option?.warehouse_id ?? primary_warehouse.id,
      account_id: option?.purchase_account_id,
      rate: option?.rate ?? 0,
      total: option?.rate * option?.quantity,
      unique_id: option?.unique_id,
      item_total_amount: option?.rate * option?.quantity,
      image: option?.images?.[0],
    };
    const filteredItems = itemOptions.filter((item) => item?.unique_id !== option?.unique_id);
    setItemOptions(filteredItems);
    if (itemOptions.length - 1) {
      setDataSource([...newData, emptyRow].map((item, i) => ({ ...item, key: `${i}` })));
    } else setDataSource(newData);
    setSubTotal(getSubtotal(newData));
    handleItemList(newData);
    setRowCount((prev) => prev + 1);
  };

  const handleConfirm = (_, data: any) => {
    let newData;
    newData = dataSource.filter((item) => item.key !== String(data?.key));
    if (isModal) {
      const filteredItem = dataSource.find((item) => item?.unique_id === data?.unique_id);
      setItemOptions([...itemOptions, filteredItem]);
      if (!itemOptions.length) {
        setDataSource([...newData, emptyRow].map((item, i) => ({ ...item, key: `${i}` })));
      } else {
        setDataSource([...newData].map((item, i) => ({ ...item, key: `${i}` })));
      }
    } else {
      newData.map((mappedItem, index: number) => ({
        ...mappedItem,
        key: `${index}`,
      }));
      setDataSource(newData);
    }
    handleItemList(newData);
    setSubTotal(getSubtotal(newData));
  };
  const handleNumberChange = (row: any, index: number, name: string) => (event) => {
    let characterCheck = event.target.value;
    let newNumber;
    if (!characterCheck) {
      if (name === "quantity" || name === "rate") newNumber = null;
      else newNumber = null;
    } else newNumber = characterCheck.length <= 10 ? characterCheck : characterCheck.slice(0, 10);

    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      [name]:
        name === "discount_item_level" &&
        newData[index]?.discount_type === "percent" &&
        parseFloat(newNumber) > 100
          ? 100
          : newNumber,
      item_total_amount:
        name === "quantity"
          ? newNumber * row.rate
          : name === "rate"
          ? newNumber * row.quantity
          : row.total,
      total:
        name === "quantity"
          ? newNumber * row.rate
          : name === "rate"
          ? newNumber * row.quantity
          : row.total,
    };
    setDataSource(newData);
    setSubTotal(getSubtotal(newData));
    handleItemList(newData);
  };

  const handleTax = (value, index: number, type?: string) => {
    const ItemTax =
      (type !== "createNew" && taxList.find((tax: any) => tax.id === value)) || ({} as any);
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      tax_id: value,
      tax_rate: type === "createNew" ? taxObj?.rate : ItemTax.rate,
      tax_name: type === "createNew" ? taxObj?.name : ItemTax.name,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  const handleAccount = (index: number) => (value: number) => {
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      account_id: value,
    };

    setDataSource(newData);
    handleItemList(newData);
  };
  const handleWarehouse = (value: number, row: any) => {
    const newData = [...dataSource];
    newData[row.key] = {
      ...newData[row.key],
      warehouse_id: value,
    };
    handleWarehouseId?.(value);
    setDataSource(newData);
    handleItemList(newData);
  };

  const handleDiscountType = (index) => (value) => {
    const newData = [...dataSource];
    const item_level_discount = newData[index]?.discount_item_level ?? 0.0;
    newData[index] = {
      ...newData[index],
      discount_type: value,
      discount_item_level:
        value === "percent" && item_level_discount > 100
          ? (parseFloat("100").toFixed(2) as any)
          : item_level_discount,
    };
    setDataSource(newData);
    handleItemList(newData);
  };

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
  const toggleTax = () => setTaxModal(!taxModal);
  const addNewTax = (index) => {
    setTaxObj({ index: index });
    toggleTax();
  };
  const addNewItem = (row, index) => {
    setItemObj({ index: index, row: row });
    toggleItemModal();
  };
  const handleKeyDown = (e, index, idPrefix) => {
    e.stopPropagation();
    if (e.key === "ArrowDown" || (e.key === "ArrowUp" && index === 0) || e.keyCode === 69) {
      e.preventDefault();
    }
    const isNumericKey = /^[0-9.]$/.test(e.key);
    const isControlKey = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Delete",
      "Home",
      "End",
    ].includes(e.key);

    // Prevent decimal point, 'e' for scientific notation, and non-numeric keys
    if (!isNumericKey && !isControlKey) {
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
      if (element) {
        element?.select();
        element?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }, 100);
  };

  ////////////////////////////////////////////Privious Price related code ///////////////////////////////

  const handleprevPriceChange = (index, price) => {
    const newData = [...dataSource];
    newData[index] = {
      ...newData[index],
      rate: price,
    };
    setDataSource(newData);
    handleItemList(newData);
  };
  /////////////////////////////////////////////**** End ******///////////////////////////////////////////

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
              <ItemSelect
                row={row}
                url={url}
                index={index}
                isModal={isModal}
                item_id={item_id}
                setItemId={setItemId}
                showButton={showButton}
                addNewItem={addNewItem}
                itemOptions={itemOptions}
                customer_id={customer_id}
                handleDescription={handleDescription}
                handleSelectedItems={handleSelectedItems}
                toggleItemDetailModal={toggleItemDetailModal}
                handleSelectedOptionItems={handleSelectedOptionItems}
              />
            );
          },
        },
        {
          title: (
            <div>
              <span>Expense account</span>
              <TooltipX title={Content.ExpenseAccountPop}>
                <img
                  className="ml-10 hover-effect"
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/info.svg`}
                  alt="tooltip Icon"
                />
              </TooltipX>
            </div>
          ),
          dataIndex: "account_id",
          key: CODE,
          ellipsis: true,
          editable: true,
          hidden: sales,
          width: 120,
          render: (account_id: number, row: any, index: number) => {
            return (
              <AccountSelect
                row={row}
                index={index}
                isModal={isModal}
                account_id={account_id}
                handleAccount={handleAccount}
                purchaseAccount={purchaseAccount}
              />
            );
          },
        },
        {
          title: "Warehouse",
          dataIndex: "warehouse_id",
          key: CODE,
          align: "left",
          ellipsis: true,
          editable: true,
          width: 80,
          hidden: purchaseOrder,
          render: (warehouse_id: number, row: any) => {
            return (
              <WarehouseSelect
                row={row}
                isModal={isModal}
                warehouses={warehouses}
                warehouse_id={warehouse_id}
                handleWarehouse={handleWarehouse}
              />
            );
          },
        },

        {
          title: isModal ? "QTY" : "Quantity",
          dataIndex: "quantity",
          key: CODE,
          className: "text-right pr-7",
          ellipsis: true,
          editable: true,
          width: 60,
          render: (quantity: number | any, row: any, index: number) => (
            <div className="qunatity_table_box">
              <Input
                min={1}
                step="0.01"
                type="number"
                maxLength={10}
                name="quantity"
                disabled={!row?.id}
                id={`qty_box${index}`}
                value={parseInt(quantity)}
                onWheel={(e) => e.currentTarget.blur()}
                status={parseInt(quantity) && row.id ? "" : "error"}
                onKeyDown={(e) => handleKeyDown(e, index, "qty_box")}
                onChange={handleNumberChange(row, index, "quantity")}
                className={`qty_box text-right ${row.id && quantity !== null ? "no-border" : ""}`}
                onFocus={(e) => {
                  e.preventDefault();
                  const element: any = document.getElementById(`qty_box${index}`);
                  element.select();
                  element.scrollIntoView({ block: "nearest", inline: "nearest" });
                  // setTimeout(() => {
                  //   element?.select();
                  // }, 10);
                }}
              />
              {!parseInt(quantity) && row.id && (
                <>
                  <span style={{ color: "red" }}>required</span> <br />
                </>
              )}
              <span>{row?.item_unit ? `${row?.item_unit}(s)` : ""}</span>
            </div>
          ),
        },
        {
          title: "Rate",
          dataIndex: "rate",
          key: CODE,
          className: "text-right pr-7",
          ellipsis: true,
          editable: true,
          width: 65,
          render: (rate: any, row: any, index: number) => (
            <>
              <Input
                min={0}
                step="0.01"
                name="rate"
                value={rate}
                type="number"
                maxLength={10}
                disabled={!row?.id}
                id={`rate_box${index}`}
                className={` h-40 ${row.id && rate !== null ? "no-border" : ""}`}
                onBlur={() => {
                  if (rate) {
                    const newData = [...dataSource];
                    newData[index] = {
                      ...newData[index],
                      rate: rate ? (parseFloat(rate).toFixed(2) as any) : 0.0,
                    };
                    setDataSource(newData);
                  } else {
                    form.setFieldValue("rate", 0);
                    const newData = [...dataSource];
                    newData[index] = {
                      ...newData[index],
                      rate: 0.0,
                    };
                    setDataSource(newData);
                    handleItemList(newData);
                  }
                }}
                prefix={
                  <span
                    style={{
                      lineHeight: "30px",
                    }}
                  >
                    {currency}
                  </span>
                }
                onWheel={(e) => e.currentTarget.blur()}
                onChange={handleNumberChange(row, index, "rate")}
                onFocus={(e) => {
                  e.preventDefault();
                  const element: any = document.getElementById(`rate_box${index}`);
                  element.select();
                  element.scrollIntoView({ block: "nearest", inline: "nearest" });
                }}
                onPaste={(e) => handleKeyDown(e, index, "rate_box")}
                onKeyDown={(e) => handleKeyDown(e, index, "rate_box")}
              />
              {row?.previousprice && (
                <div
                  style={{
                    marginTop: "2px",
                    fontWeight: "400",
                    fontSize: "12px",
                    color: "#161616",
                    lineHeight: "15px",
                    textAlign: "left",
                  }}
                  onClick={() => handleprevPriceChange(index, row?.previousprice)}
                >
                  {ModuleName === "Invoice"
                    ? `Prev Sold: ${currency} ${row?.previousprice}`
                    : `Prev Purchase:${currency} ${row?.previousprice}`}
                </div>
              )}
            </>
          ),
        },
        {
          title: discount_level === "item" ? "Discount" : "",
          dataIndex: "discount_item_level",
          key: CODE,
          className: "pr-7",
          ellipsis: true,
          editable: true,
          width: discount_level === "item" ? 70 : 0,
          render: (discount_item_level: any, row: any, index: number) => {
            const isRateGreaterThanDiscount =
              row.discount_type === "amount" &&
              parseFloat(row.rate) < parseFloat(discount_item_level);
            return (
              <>
                <div
                  style={{
                    display: "flex",
                  }}
                  className="estimate_discount_field"
                >
                  <Input
                    min={0}
                    step="0.01"
                    type="number"
                    size="middle"
                    disabled={!row?.id}
                    name="discount_item_level"
                    value={discount_item_level}
                    id={`discount_field${index}`}
                    onBlur={() => {
                      if (discount_item_level) {
                        const newData = [...dataSource];
                        newData[index] = {
                          ...newData[index],
                          discount_item_level: discount_item_level
                            ? (parseFloat(discount_item_level).toFixed(2) as any)
                            : 0.0,
                        };
                        setDataSource(newData);
                      } else {
                        const newData = [...dataSource];
                        newData[index] = {
                          ...newData[index],
                          discount_item_level: 0.0,
                        };
                        setDataSource(newData);
                      }
                    }}
                    onChange={handleNumberChange(row, index, "discount_item_level")}
                    className={`discount_field ${
                      row.id && discount_item_level !== null ? "no-border" : ""
                    }`}
                    onFocus={(e) => {
                      e.preventDefault();
                      const element: any = document.getElementById(`discount_field${index}`);
                      setTimeout(() => {
                        element?.select();
                      }, 10);
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) => handleKeyDown(e, index, "discount_field")}
                  />

                  <Select
                    disabled={!row?.id}
                    className={`discount_dropdown ${
                      row.id && discount_item_level !== null ? "no-border" : ""
                    }`}
                    popupClassName={`${isModal ? "overlap" : "generic_dropdown"}`}
                    onChange={handleDiscountType(index)}
                    suffixIcon={
                      <img
                        alt="arrow icon"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/dropdown.svg`}
                      />
                    }
                    value={row?.discount_type}
                    getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
                  >
                    <Option value="percent">%</Option>
                    <Option value={"amount"}>{currency}</Option>
                  </Select>
                </div>
                {isRateGreaterThanDiscount && (
                  <>
                    <span className="discount--err">Discount cannot be grater than rate</span>
                  </>
                )}
              </>
            );
          },
        },
        {
          title: "Tax",
          dataIndex: "",
          key: CODE,
          ellipsis: true,
          editable: true,
          width: isModal ? 120 : 115,

          render: (tax: any, row: any, index: number) => (
            <TaxSelect
              taxes={taxList}
              tax={tax}
              row={row}
              index={index}
              handleTax={handleTax}
              addNewTax={addNewTax}
              isModal={isModal}
              showButton={showButton}
            />
          ),
        },
        {
          title: "Amount",
          dataIndex: "total",
          key: CODE,
          ellipsis: true,
          editable: true,
          width: 80,
          className: "text-right pr-7",
          render: (total: number) => (
            <Statistic
              precision={2}
              prefix={currency}
              value={total || 0}
              valueStyle={{ fontSize: "14px" }}
              className="text_center no-space amount---fix"
            />
          ),
        },
        {
          title: "",
          dataIndex: "",
          width: isModal ? 30 : 18,
          key: "x",
          className: "item_delete_btn",
          align: "center" as const,
          render: (data: any, row: any, key: number) => (
            <div className="del_btn text_center">
              <Popconfirm
                // overlayClassName="confirm-popp--main"
                overlayStyle={{ zIndex: isModal ? 1101 : "auto" }}
                key="confirm"
                getPopupContainer={(trigger) =>
                  isModal ? (trigger.parentNode as HTMLElement) : document.body
                }
                okText={YES}
                cancelText={NO}
                placement="left"
                title={`${DELETE}  Product ?`}
                disabled={!row.id || dataSource?.length === 1}
                onConfirm={() => handleConfirm(key, data)}
                icon={
                  <img
                    alt="info icon"
                    src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/info.svg`}
                  />
                }
              >
                <Button
                  size="small"
                  className="__delete-btn"
                  key="deletebtn"
                  aria-disabled="true"
                  disabled={!row.id || dataSource?.length === 1}
                >
                  <img
                    src={`${
                      import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                    }/static/media/deleteqtyadjrow.svg`}
                  />{" "}
                </Button>
              </Popconfirm>
            </div>
          ),
        },
      ].filter((col) => !col.hidden),
    //eslint-disable-next-line
    [handleNumberChange, handleConfirm, dataSource]
  );
  const columns = [
    {
      title: "Products",
      dataIndex: "name",
      render: (text: any, record: any) => (
        <div className="d-flex bulk_product_inner">
          <Image
            preview={false}
            src={
              record?.images.length
                ? ImagePath(record?.images[0], created_by_platform)
                : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                    import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                  }`
            }
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="product_title">{text}</span>
            <span className="product_sku">
              <strong>SKU</strong>:{`${record.sku}`}
            </span>
          </div>
        </div>
      ),
      key: "name",
    },
    {
      title: "Rate",
      dataIndex: "sales_unit_price",
      key: "Price",
      align: "right" as const,
      render: (sales_unit_price: any) => (
        <div>
          {currency}
          {sales_unit_price.toFixed(2)}
        </div>
      ),
    },
  ];

  const columnsTwo = [
    {
      title: `Selected Products (${selectedbulkItem.length})`,
      dataIndex: "name",
      render: (text: any, record: any) => (
        <div className="d-flex bulk_product_inner">
          <Image
            preview={false}
            src={
              record?.images.length
                ? ImagePath(record?.images[0], created_by_platform)
                : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                    import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                  }`
            }
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="product_title">{text}</span>
            <span className="product_sku">
              <strong>SKU</strong>:{`${record.sku}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Add quantity",
      dataIndex: "quantity",
      render: (quantity: any, row: any, index: any) => (
        <div className="d-flex">
          <Input
            min={1}
            type="number"
            maxLength={10}
            name="quantity"
            className="bulk_item_input"
            value={parseInt(quantity)}
            onChange={handleQunatity(index, row)}
            onKeyDown={preventDecimalInput}
            onBlur={() => {
              if (quantity) {
                const newData = [...selectedbulkItem];
                newData[index] = {
                  ...newData[index],
                  //@ts-ignore
                  quantity: parseFloat(quantity).toFixed(2) as any,
                };
                setSelectedbulkItem(newData);
              } else {
                const newData = [...selectedbulkItem];
                newData[index] = {
                  ...newData[index],
                  quantity: 0.0,
                };
                setSelectedbulkItem(newData);
              }
            }}
          />
          <span className="ml-5 bulk_item_unit text_truncate">{row?.unit}</span>
        </div>
      ),
    },
    {
      title: "",
      dataIndex: "",
      render: (row: any, _index: any) => (
        <Buttonx type="link" btnText="" icon={<RxCross2 />} clickHandler={() => onCross(row)} />
      ),
    },
  ];

  const toggleBulkItemModal = () => {
    setPage(1);
    setSelectedbulkItem([]);
    setSelectedRowsArray([]);
    setIsBulkModal(!isBulkModal);
  };

  const handleQunatity = (index, row?: any, isSearch?: boolean) => (event) => {
    let characterCheck = event.target.value;
    const newNumber = characterCheck.length <= 10 ? characterCheck : characterCheck.slice(0, 10);
    const newData = [...selectedbulkItem];
    newData[index] = {
      ...newData[index],
      quantity: isSearch ? row.quantity + 1 : newNumber,
    };
    setSelectedbulkItem(newData);
  };
  const preventDecimalInput = (event) => {
    // Prevent "." (decimal point), "Decimal", and "e" key inputs
    const isNumericKey = /^[0-9]$/.test(event.key);
    const isControlKey = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Delete",
      "Home",
      "End",
    ].includes(event.key);

    // Prevent decimal point, 'e' for scientific notation, and non-numeric keys
    if (!isNumericKey && !isControlKey) {
      event.preventDefault();
    }
  };
  const rowSelection = {
    selectedRowKeys: selectedRowsArray,
    onSelect: (row, check) => {
      if (check) {
        setSelectedbulkItem([...selectedbulkItem, row]);
        const copyitems = [...selectedbulkItem, row];
        const selectedIds = copyitems.map((item) => item.id);
        setSelectedRowsArray(selectedIds);
      } else {
        const rowdata = [...selectedbulkItem];
        const index = rowdata.findIndex((x) => x.id === row.id);
        rowdata.splice(index, 1);
        setSelectedbulkItem(rowdata);
        const selectedIds = rowdata.map((item) => item.id);
        setSelectedRowsArray(selectedIds);
      }
    },

    hideSelectAll: true,
  };

  function onCross(row) {
    let selectedRows = selectedbulkItem.filter((val) => val.id !== row.id);
    setSelectedbulkItem(selectedRows);
    setSelectedRowsArray(selectedRowsArray.filter((rows: any) => rows !== row?.id));
  }

  const onFinsihBulk = () => {
    const primary_warehouse = warehouses.find((item: any) => item.is_primary) || ({} as any);
    handlePrimaryWarehouse?.(primary_warehouse.id);
    setPage(1);
    setSelectedbulkItem([]);
    setSelectedRowsArray([]);
    const newSelectedItems = selectedbulkItem.map((item) => {
      return {
        ...item,
        id: item?.id,
        item_unit: item?.unit,
        item_name: item?.name,
        label: item?.label,
        item_obj: {
          key: `${Math.random()}`,
          value: item?.id,
          label: [
            <Avatar
              size="large"
              src={
                <Image
                  preview={false}
                  src={
                    item?.images?.length
                      ? ImagePath(item?.images?.[0], created_by_platform)
                      : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                          import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE
                        }`
                  }
                />
              }
            />,
            <div className="product_text_detail">
              <span className="product_name"> {item?.name} </span>
              <span className="product_sku ">{item?.sku}</span>
            </div>,
          ],
        },
        quantity: item?.quantity,
        tax_rate: item?.tax?.rate ?? 0,
        tax_name: item?.tax?.name,
        tax_id: item?.tax?.id ?? null,
        tax_amount: item?.tax?.rate,
        discount_item_level: 0,
        discount_type: "percent",
        rate: sales ? item?.sales_unit_price : item?.purchase_unit_price ?? 0,
        warehouse_id: primary_warehouse?.id,
        account_id: sales ? item?.sales_account_id : item?.purchase_account_id ?? null,
        //extra_description: item?.description,
        extra_description: null,
        image: item?.images?.[0],
        total: sales
          ? item?.sales_unit_price * item?.quantity
          : item?.purchase_unit_price * item?.quantity,
        item_total_amount: sales
          ? item?.sales_unit_price * item?.quantity
          : item?.purchase_unit_price * item?.quantity,
      };
    });
    const copyArray = [...dataSource];
    if (dataSource.length) copyArray.pop();
    const blukitemids = selectedbulkItem
      .filter((singleitem) => singleitem.id != null) // Filter out items where id is null or undefined
      .map((singleitem) => singleitem.id);
    const newData = [...copyArray, ...newSelectedItems];
    const mergedArray = [...selectedItemsIds, ...blukitemids];
    setDataSource(
      [...newData, emptyRow].map((item, i) => ({
        ...item,
        key: `${i}`,
      }))
    );
    setSelecteditemIds([...new Set(mergedArray)]);
    setSubTotal(getSubtotal(newData));
    handleItemList(newData);
    setRowCount(newData?.length);
    toggleBulkItemModal();
  };

  const loadProducts = () => {
    setPage(page + 1);
    callAxios({
      url: `${itemUrl}/items?page=${page}&view=20&search=`,
      method: "get",
    }).then((res) => {
      const mergedResponse = {
        ...res,
        data: [...bulkItem.data, ...res.data],
      };

      setbulkItem(mergedResponse);
    });
  };

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

  const searchData = (value) => {
    setInfiniteLoading(true);

    callAxios({
      url: `${itemUrl}/items?page=&view=20&search=${value}`,
      method: "get",
    }).then((res) => {
      setInfiniteLoading(false);

      setbulkItem(res);
      let currentItem = res?.data.find(
        (val) =>
          val.name.toLowerCase() === value.toLowerCase() ||
          val.sku.toLowerCase() === value.toLowerCase()
      );
      if (currentItem && res?.data?.length === 1) {
        const exist = selectedbulkItem.some((val) => val.id === currentItem.id);
        if (exist) {
          const itemIndex = selectedbulkItem.findIndex((val) => val.id === currentItem.id);
          const row = selectedbulkItem.find((val) => val.id === currentItem.id);
          const newData = [...selectedbulkItem];
          newData[itemIndex] = {
            ...newData[itemIndex],
            quantity: row.quantity + 1,
          };
          setSelectedbulkItem(newData);
          callAxios({
            url: `${itemUrl}/items?page=&view=20`,
            method: "get",
          }).then((res) => {
            setbulkItem(res);
            setInputValue("");
          });
        } else {
          setSelectedRowsArray([...selectedRowsArray, currentItem?.id]);
          setSelectedbulkItem([...selectedbulkItem, currentItem]);
          callAxios({
            url: `${itemUrl}/items?page=&view=20`,
            method: "get",
          }).then((res) => {
            setbulkItem(res);
            setInputValue("");
          });
        }
      }
    });
  };
  return (
    <>
      <Modal
        centered
        width={1140}
        destroyOnClose
        footer={false}
        open={isBulkModal}
        title="Add bulk products"
        className="estimate_lg_modal"
        onCancel={toggleBulkItemModal}
        wrapClassName="generic_modal_style bulk_items_modal"
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
          />
        }
      >
        <div className="px-30">
          <div className="form-group bulk_item_search_box">
            <DebouncedInput
              onSearch={searchData}
              inputValue={inputValue}
              setInputValue={setInputValue}
              setPage={setPage}
              fetchinitialData={fetchinitialData}
            />
            <Icons.FaSearch />
          </div>
        </div>

        <div className="bulk_item_modal_column px-30 d-flex  mb-30 gap-10">
          <div className=" table_outer_container">
            <div className="bulk_items_col_one">
              <InfiniteScroll
                height={300}
                next={loadProducts}
                className="table_inner"
                dataLength={bulkItem?.data?.length || 0}
                hasMore={bulkItem?.last_page > bulkItem?.current_page}
                style={{ overflow: "auto", height: "calc(100vh - 360px)" }}
                loader={
                  <div style={{ width: "100%", textAlign: "center" }}>
                    <Spinner size={"50px"} />
                  </div>
                }
              >
                <Table
                  columns={columns}
                  pagination={false}
                  dataSource={bulkItem?.data}
                  rowSelection={{ ...rowSelection }}
                  rowKey={(record: any) => record.id}
                  className="generic-table add_bulk_item no-radius"
                  loading={{
                    spinning: infiniteLoading,
                    indicator: <Spinner directionSize={"61.5vh"} />,
                  }}
                  onRow={(record) => {
                    return {
                      onClick: (event) => {
                        event.stopPropagation();
                        const exist = selectedRowsArray.find((item) => item === record.id);
                        if (exist) {
                          setSelectedRowsArray(selectedRowsArray.filter((id) => id !== record.id));
                          setSelectedbulkItem(
                            selectedbulkItem.filter((item) => item.id !== record.id)
                          );
                        } else {
                          setSelectedRowsArray([...selectedRowsArray, record.id]);
                          setSelectedbulkItem([...selectedbulkItem, record]);
                        }
                      },
                    };
                  }}
                />
              </InfiniteScroll>
            </div>
          </div>
          <div className=" table_outer_container selected_item_table">
            <Table
              pagination={false}
              columns={columnsTwo}
              dataSource={selectedbulkItem}
              rowKey={(record) => record.id}
              className="generic-table bulk_items_col_two"
            />
          </div>
        </div>
        <div className="button_flexbox flex-end px-30   w-100 ">
          <Buttonx
            type="default"
            btnText="Cancel"
            htmlType="button"
            clickHandler={toggleBulkItemModal}
            className="btn-default btn-form-size cate_cancel_btn mr-20 mb-20"
          />
          <Buttonx
            btnText="Save"
            clickHandler={onFinsihBulk}
            disabled={!selectedbulkItem?.length}
            className="btn-primary btn-form-size mb-20"
          />
        </div>

        {/* </div> */}
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="table" direction="vertical" mode="standard" type="row">
          {(provided) => (
            <Table
              className="no-radius"
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
      <div className={`bill_box ${isModal ? "justify_end" : "justify_between"}`}>
        {!isModal && (
          <div className={`d-flex align-center self-start`}>
            {sales && (
              <Button
                disabled={!customer_id}
                onClick={toggleBulkItemModal}
                className={`btn-form-size btn-default mr-10 bulk-item-btn ${
                  !customer_id ? "disabled-btn" : ""
                }`}
              >
                Add bulk products
              </Button>
            )}
            <ConfirmPopup
              isModalOpen={isConfirm}
              handleConfirm={handleClear}
              toggleModal={toggleConfirmModal}
              text={Content.clearLinesConfirm}
            />
            <Button
              onClick={toggleConfirmModal}
              disabled={!!(dataSource.length === 1)}
              className="btn-form-size btn-default bulk-item-btn"
            >
              Clear all lines
            </Button>
          </div>
        )}

        <div className="final_payment">
          <div className="d-flex align-center justify_between mb-10 subtotal">
            <Typography.Title level={5} className="min-50">
              Subtotal:
            </Typography.Title>
            <Statistic
              precision={2}
              value={subTotal}
              prefix={currency}
              className="no-space min-50 text-right"
            />
          </div>

          <div className="d-flex align-center justify_between mb-10 discount_input_field">
            {discount_level === "item" && (
              <>
                <div className="d-flex align-center discount_label">
                  <Typography.Title level={5}>Discount:</Typography.Title>
                  <TooltipX
                    overlayClassName={isModal ? "overlap" : ""}
                    title=" This option will show Discount on products"
                  >
                    <img
                      alt="info icon"
                      className="ml-10  _info_icon--hover"
                      onClick={toggleItemDetailInfoModal}
                      src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/info.svg`}
                    />
                  </TooltipX>
                </div>
                <Statistic
                  precision={2}
                  prefix={currency}
                  className="no-space"
                  value={getDiscounttotal(dataSource)}
                />
              </>
            )}

            {discount_level === "transaction" && (
              <>
                <div className="bill_discount_field d-flex w-100 justify_between align-center">
                  <div
                    className={`estimate_discount_field d-flex overlap-fix ${
                      ModuleName === "Bill" ? "min-50" : "w-100"
                    }`}
                  >
                    <Form.Item
                      colon={false}
                      className="shipping_inputbox"
                      name="discount_transaction_level"
                      label={
                        <Typography style={{ marginRight: 5 }} aria-level={5}>
                          Discount:
                        </Typography>
                      }
                    >
                      <Input
                        min={0}
                        step="0.01"
                        size="small"
                        type="number"
                        className={`discount_field`}
                        id="discount_transaction_level"
                        name="discount_transaction_level"
                        value={discount_transaction_level}
                        onFocus={() => {
                          const element: any = document.getElementById(
                            `discount_transaction_level`
                          );
                          setTimeout(() => {
                            element?.select();
                          }, 10);
                        }}
                        onBlur={() => {
                          if (!discount_transaction_level) {
                            form.setFieldValue("discount_transaction_level", 0.0);
                          } else {
                            form.setFieldValue(
                              "discount_transaction_level",
                              parseFloat(discount_transaction_level as any).toFixed(2)
                            );
                          }
                        }}
                        onChange={(e) => {
                          const check = e.target.value;
                          const amount_discount = check.length <= 10 ? check : check.slice(0, 10);
                          if (transaction_level_discount_type === "amount") {
                            form.setFieldValue("discount_transaction_level", amount_discount);
                          }
                          if (transaction_level_discount_type === "percent") {
                            const discount_in_percent = parseFloat(check);
                            form.setFieldValue(
                              "discount_transaction_level",
                              discount_in_percent > 100 ? 100 : discount_in_percent
                            );
                          }
                        }}
                        onPaste={(e) => {
                          // Allow only numbers and one decimal point
                          //@ts-ignore
                          const isValidKey = /[0-9.]/.test(e.key);
                          //@ts-ignore
                          if (!isValidKey && e.key !== "Backspace" && e.key !== "Tab") {
                            e.preventDefault();
                          }
                        }}
                        onKeyDown={(e) => {
                          // Allow only numbers and one decimal point
                          const isValidKey = /[0-9.]/.test(e.key);
                          if (!isValidKey && e.key !== "Backspace" && e.key !== "Tab") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="transaction_level_discount_type" colon={false}>
                      <Select
                        popupClassName="overlap"
                        className={`discount_dropdown`}
                        getPopupContainer={
                          isModal ? (trigger) => trigger.parentNode as HTMLElement : undefined
                        }
                        onChange={(checked) => {
                          if (
                            checked === "percent" &&
                            //@ts-ignore
                            discount_transaction_level > 100
                          ) {
                            form.setFieldValue("discount_transaction_level", 100);
                          }
                        }}
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
                    </Form.Item>
                  </div>
                  {ModuleName === "Bill" && (
                    <Statistic
                      precision={2}
                      prefix={currency}
                      className="no-space min-50 text-right"
                      value={
                        transaction_level_discount_type === "amount"
                          ? discount_transaction_level
                          : (subTotal / 100) * (discount_transaction_level as any)
                      }
                    />
                  )}
                </div>
              </>
            )}
          </div>
          <div className="d-flex align-center justify_between mb-10 tax-container">
            <div className="d-flex align-center justify_end tax_value">
              <Typography.Title level={5}>Tax:</Typography.Title>
              <TooltipX
                title=" This option will show taxes on products"
                overlayClassName={isModal ? "overlap" : ""}
              >
                <img
                  alt="info icon "
                  className="ml-10 _info_icon--hover"
                  onClick={toggleItemDetailInfoModal}
                  src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/info.svg`}
                />
              </TooltipX>
            </div>
            <Statistic
              precision={2}
              prefix={currency}
              className="no-space"
              value={getTaxtotal(dataSource)}
            />
          </div>
          {sales && (
            <div className="d-flex align-center justify_between mb-10">
              <Form.Item
                colon={false}
                name="shipping_charge"
                className="shipping_inputbox bill_rounding"
                label={<Typography aria-level={5}>{"Shipping & Handling"}:</Typography>}
              >
                <InputNumberX
                  step="0.01"
                  allowDecimal
                  name="shipping_charge"
                  value={shipping_charge}
                  className="shipping_input_field "
                  prefix={<span>{currency}</span>}
                  onBlur={() => {
                    if (!shipping_charge || isNaN(parseFloat(shipping_charge as any)))
                      form.setFieldValue("shipping_charge", 0.0);
                    else
                      form.setFieldValue(
                        "shipping_charge",
                        parseFloat(shipping_charge as string).toFixed(2)
                      );
                  }}
                  onChange={(value) => {
                    const check = value;
                    const shiping_charges_lenght = check.length <= 10 ? check : check.slice(0, 10);
                    form.setFieldValue("shipping_charge", shiping_charges_lenght);
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              </Form.Item>
            </div>
          )}
          {current && (
            <div className="d-flex align-center justify_between mb-10 adjustment_value">
              <Form.Item
                label={
                  <Typography aria-level={5} className="my-custom-label pl-40">
                    {ModuleName !== "Bill" ? `${Labels.ADJUSTMENT}` : "Rounding & Adjustment"}:
                    <TooltipX title="Rounding & Adjustment" overlayClassName="overlap">
                      <img
                        alt="info icon"
                        className="ml-20  _info_icon--hover"
                        src={`${
                          import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL
                        }/static/media/tooltip.svg`}
                      />
                    </TooltipX>
                  </Typography>
                }
                colon={false}
                name="adjustment"
                style={{ paddingBottom: "10" }}
                className={`shipping_inputbox no-space bill_rounding ${
                  ModuleName === "Bill" ? "w-59 " : " w-59 _1px"
                }`}
              >
                <NegativeNumber
                  form={form}
                  value={adjustment}
                  name={"adjustment"}
                  currency={currency}
                />
              </Form.Item>
            </div>
          )}
          <div
            className={`d-flex align-center justify_between py-10 bill-total ${
              !current ? "_2px  border_top " : "mb-0"
            }`}
          >
            <Typography.Title
              level={5}
              className={`${ModuleName === "Bill" ? "mt-10" : ""}`}
            >{`${ModuleName} total:`}</Typography.Title>
            <Statistic
              precision={2}
              prefix={currency}
              value={totalAmount || 0}
              className={`no-space ${ModuleName === "Invoice" ? "" : ""}`}
            />
          </div>
          {current && (
            <div>
              {ModuleName !== "Bill" && (
                <div className="d-flex align-center justify_between _2px">
                  <Typography.Title level={5}>{`Balance due:`}</Typography.Title>
                  <Statistic
                    precision={2}
                    prefix={currency}
                    className="no-space"
                    value={totalAmount || 0}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        centered
        width={1140}
        footer={false}
        open={itemDetailInfo}
        onCancel={toggleItemDetailInfoModal}
        wrapClassName="generic_modal_style gap-adjustment"
        title="Tax is applied on the subtotal before discount"
        closeIcon={
          <img
            alt="close Icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
          />
        }
      >
        <div className="custom-tax-modal">
          <TaxModal isDataSource={dataSource} currency={currency} />
        </div>
      </Modal>
      <CreateTax
        taxObj={taxObj}
        bool={taxModal}
        toggle={toggleTax}
        setTaxObj={setTaxObj}
        setTaxList={setTaxList}
        has_permission={has_TaxCreate_permission}
      />
      <Modal
        centered
        width={940}
        footer={false}
        destroyOnClose
        title="Add Product"
        style={{ top: 0 }}
        open={isItemModal}
        onCancel={toggleItemModal}
        wrapClassName="generic_modal_style get-spacing"
        className="estimate_modal estimate_lg_modal add_product_modal add-new-item--modal popup--z-index"
        bodyStyle={{
          height: "100%",
        }}
        closeIcon={
          <img
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/close-modal.svg`}
            alt="close Icon"
          />
        }
      >
        <CreateItem
          isModal
          itemObj={itemObj}
          setItemObj={setItemObj}
          toggleItemModal={toggleItemModal}
        />
      </Modal>
      <ItemDetailModal
        isModal
        bool={itemDetailModal}
        detail={{ id: itemId }}
        toggle={toggleItemDetailModal}
      />
    </>
  );
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

const TaxSelect = ({
  row,
  tax,
  taxes = [],
  index,
  handleTax,
  addNewTax,
  isModal = false,
  showButton = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [taxSelectOpen, setTaxSelectOpen] = useState(false);
  const toggleTaxSelect = () => setTaxSelectOpen(!taxSelectOpen);
  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };

  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };
  return (
    <Select
      allowClear
      showSearch
      showArrow
      open={taxSelectOpen}
      disabled={!row?.id}
      onSearch={handleSearch}
      placeholder="Select Tax"
      searchValue={searchValue}
      onClick={toggleTaxSelect}
      style={{ width: isModal ? 160 : 154 }}
      onChange={(value) => handleTax(value, index)}
      getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
      // getPopupContainer={isModal ? (trigger) => trigger.parentNode as HTMLElement : undefined}
      value={tax?.tax_id ? { id: tax?.tax_id, label: `${tax.tax_name} (${tax.tax_rate}%)` } : null}
      popupClassName="item_dropdown generic_item_dropdown scroll_visible tax_dropdown dropdown--scroll res--top"
      onBlur={(e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
          e.preventDefault();
          setTaxSelectOpen(false);
        }
      }}
      className={`estimate_select remove-select-icon ${row?.id ? "no-border" : ""} ${
        tax ? "selected_tax" : "unselect_tax "
      }`}
      suffixIcon={
        <img
          alt="arrow icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
        />
      }
      dropdownRender={(menu) => (
        <>
          {showButton && (
            <Buttonx
              htmlType="button"
              btnText="Add new"
              icon={<BsPlus size={25} />}
              clickHandler={() => addNewTax(index)}
              className="btn-primary btn-form-size w-100 d-flex align-center justify-center"
            />
          )}
          {menu}
        </>
      )}
      filterOption={(input, option) =>
        // @ts-ignore
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {taxes.map((tax: any, index: number) => (
        <Option key={index} value={tax.id}>
          {`${tax.name} (${tax.rate}%)`}
        </Option>
      ))}
    </Select>
  );
};

const WarehouseSelect = ({ warehouses, warehouse_id, isModal, row, handleWarehouse }) => {
  const [searchValue, setSearchValue] = useState("");
  const [warehouseSelectOpen, setWarehouseSelectOpen] = useState(false);
  const toggleWarehouseSelect = () => setWarehouseSelectOpen(!warehouseSelectOpen);
  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };

  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };

  return (
    <Select
      showSearch
      onSearch={handleSearch}
      searchValue={searchValue}
      open={warehouseSelectOpen}
      getPopupContainer={(trigger) => trigger.parentNode as HTMLElement}
      onClick={toggleWarehouseSelect}
      onBlur={(e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
          e.preventDefault();
          setWarehouseSelectOpen(false);
        }
      }}
      value={warehouse_id}
      placeholder="Warehouse"
      disabled={isModal || !row?.id}
      style={{ width: isModal ? 120 : "100%" }}
      className={`estimate_select ${row?.id && warehouse_id !== null ? "no-border" : ""}`}
      suffixIcon={
        <img
          alt="arrow icon"
          src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
        />
      }
      onChange={(e) => handleWarehouse(e, row)}
      filterOption={(input, option) =>
        // @ts-ignore
        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {warehouses.map((warehouse: any, index: number) => (
        <Option key={index} value={warehouse.id}>
          {warehouse.label}
        </Option>
      ))}
    </Select>
  );
};

const ItemSelect = ({
  url,
  row,
  index,
  isModal,
  item_id,
  setItemId,
  addNewItem,
  customer_id,
  itemOptions = [],
  handleDescription,
  showButton = false,
  handleSelectedItems,
  toggleItemDetailModal,
  handleSelectedOptionItems,
}) => {
  const { created_by_platform } = useStore();
  const [searchValue, setSearchValue] = useState("");
  const [itemSelectOpen, setItemSelectOpen] = useState(false);

  const {
    fetching,
    options,
    handleScroll,
    debounceFetcher,
    hasContentLoading,
    handleOptionDeselect,
  } = useDynamicSelectPagination(url, true);

  const toggleItemSelect = () => setItemSelectOpen(!itemSelectOpen);

  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };

  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };

  return (
    <div>
      {!row?.id ? (
        !isModal ? (
          <Select
            showSearch
            labelInValue
            virtual={false}
            value={item_id}
            listHeight={220}
            filterOption={false}
            open={itemSelectOpen}
            placement="bottomRight"
            disabled={!customer_id}
            searchValue={searchValue}
            onClick={toggleItemSelect}
            id={`select_item${index}`}
            onPopupScroll={handleScroll}
            getPopupContainer={(trigger) =>
              window.innerWidth < 1366 ? trigger.parentElement : document.body
            }
            loading={fetching || hasContentLoading}
            placeholder={
              !customer_id ? "Please select customer" : "Click to select product/service"
            }
            onSearch={(value) => {
              const emoji = /[^\x00-\x7F]/g;
              const filteredValue = removeEmojis(value);
              setSearchValue(filteredValue);
              //@ts-ignore
              !emoji.test(value) && debounceFetcher(filteredValue);
            }}
            onBlur={(e) => {
              if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
                e.preventDefault();
                setItemSelectOpen(false);
              }
            }}
            onDropdownVisibleChange={(open) => open && handleOptionDeselect()}
            style={{
              width: isModal ? 300 : "100%",
              height: "100%",
              pointerEvents: item_id ? "none" : "auto",
            }}
            onChange={async (_, option: any) => {
              await handleSelectedItems(option?.dataObject, row, index);
              const element = document.getElementById(`select_item${index + 1}`);
              setTimeout(() => {
                element?.focus();
              }, 0);
            }}
            suffixIcon={
              <img
                alt="arrow icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
              />
            }
            popupClassName="item_dropdown clear-white-space generic_item_dropdown"
            className={`select_item ${row?.id ? "no-border" : "estimate_select_items"}`}
            dropdownRender={(menu) =>
              fetching ? (
                <div style={{ width: "100%", textAlign: "center", paddingBottom: "16px" }}>
                  {/* <Spin size="small" style={{ padding: "0 12px" }} /> */}
                  <Spinner size={"50px"} />
                </div>
              ) : (
                <>
                  {showButton && (
                    <Buttonx
                      htmlType="button"
                      btnText="Add new"
                      icon={<BsPlus size={25} />}
                      clickHandler={() => addNewItem(row, index)}
                      className="btn-primary btn-form-size w-100 d-flex align-center justify-center"
                    />
                  )}
                  {menu}
                </>
              )
            }
          >
            {options?.map((item) => (
              <Option
                dataObject={item}
                key={`${Math.random()}`}
                value={item.value}
                label={item.label}
              >
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
                <div className="product_text_detail">
                  <span className="product_name"> {item.label} </span>
                  <span className="product_sku ">{item.sku}</span>
                </div>
              </Option>
            ))}
          </Select>
        ) : (
          <Select
            showSearch
            labelInValue
            value={item_id}
            filterOption={false}
            open={itemSelectOpen}
            placement="bottomRight"
            onSearch={handleSearch}
            disabled={!customer_id}
            searchValue={searchValue}
            onClick={toggleItemSelect}
            id={`select_item${index}`}
            popupClassName="item_dropdown overlap"
            getPopupContainer={(trigger) => trigger.parentElement}
            placeholder={
              !customer_id ? "Please select customer" : "Click to select product/service"
            }
            onBlur={(e) => {
              if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
                e.preventDefault();
                setItemSelectOpen(false);
              }
            }}
            suffixIcon={
              <img
                alt="arrow icon"
                src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
              />
            }
            style={{
              height: "100%",
              width: isModal ? 286 : "100%",
              pointerEvents: item_id ? "none" : "auto",
            }}
            onChange={async (_, option: any) => {
              await handleSelectedOptionItems(option?.dataObject, row, index);
              const element = document.getElementById(`select_item${index + 1}`);
              setTimeout(() => {
                element?.focus();
              }, 0);
            }}
            className={`select_item ${row?.id ? "no-border" : "estimate_select_items"}`}
          >
            {itemOptions?.map((itemoption: any) => (
              <Option
                dataObject={itemoption}
                key={`${Math.random()}`}
                value={itemoption?.item?.id}
                label={itemoption?.item?.name}
              >
                <Avatar
                  size="large"
                  src={
                    <Image
                      preview={false}
                      src={
                        itemoption?.item?.images.length
                          ? ImagePath(itemoption?.item?.images[0], created_by_platform)
                          : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                              import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                            }`
                      }
                    />
                  }
                />
                <div className="product_text_detail">
                  <span className="product_name"> {itemoption?.item?.name} </span>
                  <span className="product_sku ">{itemoption?.item?.sku}</span>
                </div>
              </Option>
            ))}
          </Select>
        )
      ) : (
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
              marginLeft: "10px",
              flexDirection: "column",
            }}
          >
            <span
              className="product_name cursor text_underline"
              onClick={() => {
                if (!isModal) {
                  toggleItemDetailModal();
                  setItemId(item_id?.value);
                } else null;
              }}
            >
              {" "}
              {row.label}{" "}
            </span>
            <span className="product_sku ">{row.sku}</span>
          </div>
        </div>
      )}

      {item_id ? (
        <div className="desc_box mt-20">
          <TextArea
            rows={4}
            showCount
            cols={4}
            maxLength={1000}
            value={row?.extra_description}
            onChange={handleDescription(index)}
            className={`${row?.id === item_id?.value}` ? "my-text-area" : ""}
            placeholder={"Add a description to your product, Max 1000 characters are allowed."}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const AccountSelect = ({ account_id, purchaseAccount, handleAccount, index, isModal, row }) => {
  const [searchValue, setSearchValue] = useState("");
  const [accountSelectOpen, setAccountSelectOpen] = useState(false);
  const toggleAccountSelect = () => setAccountSelectOpen(!accountSelectOpen);
  const removeEmojis = (value) => {
    return value.replace(/[^\x00-\x7F]/g, "");
  };
  const handleSearch = (value) => {
    const filteredValue = removeEmojis(value);
    setSearchValue(filteredValue);
  };

  return (
    <div className="d-flex">
      <Select
        showSearch
        value={account_id}
        onSearch={handleSearch}
        open={accountSelectOpen}
        searchValue={searchValue}
        placeholder="Select Account"
        getPopupContainer={(trigger) => trigger.parentElement}
        onClick={toggleAccountSelect}
        disabled={isModal || !row?.id}
        onChange={handleAccount(index)}
        popupClassName="dropdown--scroll"
        style={{ width: isModal ? 120 : "100%" }}
        onBlur={(e) => {
          if (!e.relatedTarget || !e.relatedTarget.closest("#closingSlector")) {
            e.preventDefault();
            setAccountSelectOpen(false);
          }
        }}
        suffixIcon={
          <img
            alt="arrow icon"
            src={`${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}/static/media/dropdown.svg`}
          />
        }
        className={`estimate_select ${row?.id && account_id !== null ? "no-border" : ""}`}
        filterOption={(input, option) =>
          // @ts-ignore
          option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {import.meta.env.VITE_ADD_ACCOUNTS === "false"
          ? purchaseAccount["expenseAccounts"]?.map(({ title, id }: any) => (
              <Option key={id} value={id}>
                {title}
              </Option>
            ))
          : purchaseAccount[
              row?.inventory_type || row?.item?.inventory_type === "inventory"
                ? "inventoryAccounts"
                : "expenseAccounts"
            ]?.map(({ title, id }: any) => (
              <Option key={id} value={id}>
                {title}
              </Option>
            ))}
        {/* {purchaseAccount?.map(({ accounts, name }: any) => (
<OptGroup key={name} label={name} className="discount_dropdown">
{accounts?.map((acct: { id: number; title: string }, acctIndex: number) => (
<Option key={`${name}-${acct.id}-${acctIndex}`} value={acct.id}>
{acct.title}
</Option>
))}
</OptGroup>
))} */}
      </Select>
    </div>
  );
};

const getPreviousPrive = (
  customer_id,
  selectedItemsIds,
  dataSource,
  setDataSource,
  callAxios,
  ModuleName
) => {
  const url =
    ModuleName === "Invoice" ? "/invoice/previoussoldprice" : "/bills/previouspurchaseprice";
  const INV_payload = {
    customer_id: customer_id?.id,
    item_id: selectedItemsIds,
    object: "invoice",
    object_id: null,
  };
  const BIL_payload = {
    vendor_id: customer_id?.id,
    item_id: selectedItemsIds,
    object: "bill",
    object_id: null,
  };
  {
    customer_id &&
      callAxios({
        url: url,
        method: "post",
        data: ModuleName === "Invoice" ? INV_payload : BIL_payload,
      }).then((res) => {
        if (res) {
          const privemanupulation = dataSource.map(({ previousprice, ...rest }) => rest);
          const newData = privemanupulation?.map((item1) => {
            const item2 = res.find((item) => item.item_id === item1.id);
            return item2 ? { ...item1, previousprice: item2?.rate } : item1;
          });
          setDataSource(newData);
        }
      });
  }
};
