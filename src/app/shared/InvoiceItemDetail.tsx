/** @format */

import { useMemo, useState } from "react";
import { Image, Statistic, Table, Typography } from "antd";
import { useStore } from "app/Hooks";
import { ItemDetailModal } from "app/containers/Items/itemDetailModal";
import { ImagePath } from "utils";
import { getInvoiceItemRate } from "utils/calculation";
import { TooltipX } from "./ToolTip";
import { ItemDetailTableProps } from "./types";

const { Text } = Typography;

export const InvoiceItemDetailTable = ({
  details,
  tableData,
  isModal,
  expenseAccount,
}: ItemDetailTableProps) => {
  const [itemId, setItemid] = useState();
  const { created_by_platform } = useStore();
  const [itemDetailModal, setItemDetailModal] = useState(false);
  const [tabledataset, setTabledata] = useState(
    tableData.map((data) => ({ ...data, expands: true }))
  );

  const handleExpand = (index: number) => {
    const copyArray = [...tabledataset];
    copyArray[index].expands = false;
    setTabledata(copyArray);
  };
  const handleCollapse = (index: number) => {
    const copyArray = [...tabledataset];
    copyArray[index].expands = true;
    setTabledata(copyArray);
  };
  const currenySymbol =
    details?.base_currency?.symbol || details?.invoice_info?.base_currency?.symbol;

  const toggleItemDetailModal = (id) => {
    setItemDetailModal(!itemDetailModal);
    setItemid(id);
  };

  const memoColumns = useMemo(
    () =>
      [
        {
          title: "Item",
          dataIndex: "",
          width: 75,
          ellipsis: false,

          render: (props: any, _, index: any) => (
            <>
              <div className="__product_image">
                <Image
                  preview={false}
                  onClick={(e) => e.stopPropagation()}
                  src={
                    props?.item?.images.length
                      ? ImagePath(props?.item?.images[0] as string, created_by_platform)
                      : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${
                          import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE
                        }`
                  }
                />
                <div className="__product_info">
                  <Text
                    className={isModal ? "block" : "_display_name block cursor"}
                    onClick={() => !isModal && toggleItemDetailModal(props.item_id)}
                  >
                    {props.item_name || props.items.name}
                  </Text>
                  <Text className="product_sku_detail">{props.item?.sku || props.items.sku}</Text>
                  {props?.extra_description?.length > 0 ? (
                    props.expands ? (
                      <>
                        <p className="color-1616 w-break">
                          {props.extra_description.substring(0, 77)} &nbsp;
                          {props.extra_description.length > 77 && (
                            <span
                              className="cursor"
                              style={{ color: "#0061DD" }}
                              onClick={() => handleExpand(index)}
                            >
                              Show more
                            </span>
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="color-1616 w-break">
                          {props.extra_description} &nbsp;
                          {props.extra_description.length > 77 && (
                            <span
                              className="cursor"
                              style={{ color: "#0061DD" }}
                              onClick={() => handleCollapse(index)}
                            >
                              Show less
                            </span>
                          )}
                        </p>
                      </>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          ),
          className: "image_cell",
        },
        // {props?.account?.title &&
        {
          title: "Expense Account",
          dataIndex: "",
          width: 35,
          editable: true,
          key: "CODE",
          ellipsis: true,
          hidden: !expenseAccount,
          className: "text-left expence_account",
          render: (props: any) => {
            if (props?.account?.title) {
              return (
                <Statistic
                  precision={2}
                  className="no-space"
                  value={props?.account?.title ?? ""}
                  valueStyle={{ fontSize: "14px" }}
                />
              );
            } else {
              return null;
            }
          },
        },
        {
          title: "Qty",
          dataIndex: "",
          width: 15,
          ellipsis: true,
          className: "text-right qty_column",
          render: (props: any) => (
            <div className="unit-badge">
              <Statistic
                value={props?.quantity}
                valueStyle={{ fontSize: "14px", color: "#161616" }}
              />
              <span>{props?.item?.unit ? `${props?.item?.unit}(s)` : ""}</span>
            </div>
          ),
        },
        {
          title: "Rate",
          dataIndex: "rate",
          width: 31,
          ellipsis: true,
          className: "text-right",
          render: (rate: number) => (
            <Statistic
              precision={2}
              value={rate ?? 0}
              className="no-space"
              prefix={currenySymbol}
              valueStyle={{ fontSize: "14px", display: "flex", justifyContent: "flex-end" }}
            />
          ),
        },
        {
          title:
            (details?.invoice_info?.discount_level || details?.discount_level) === "item"
              ? "Discount"
              : "",
          dataIndex: "",
          width:
            (details?.invoice_info?.discount_level || details?.discount_level) === "item" ? 32 : 0,
          ellipsis: true,
          className: "text-right discount_column",
          render: (item: any) => (
            <TooltipX
              title={
                item?.discount_type === "percent"
                  ? `${currenySymbol} ${(
                      (item?.rate * parseFloat(item?.discount_item_level)) /
                      100
                    ).toFixed(2)} @ ${item?.discount_item_level}% of ${item?.rate}`
                  : "Dollar value discount."
              }
            >
              <Statistic
                precision={item?.discount_type === "amount" ? 2 : 0}
                className="no-space"
                prefix={item?.discount_type === "amount" ? currenySymbol : ""}
                suffix={item?.discount_type === "percent" ? "%" : ""}
                valueStyle={{ fontSize: "14px" }}
                value={`${item?.discount_item_level ?? null}`}
              />
            </TooltipX>
          ),
        },

        {
          title: "Tax",
          dataIndex: "",
          width: 32,
          ellipsis: true,
          className: "text-right tax_column",
          hidden: expenseAccount,
          render: (tax_amount: any) => (
            <TooltipX
              title={`${currenySymbol} ${(
                (tax_amount?.quantity * tax_amount?.rate * parseFloat(tax_amount?.tax_rate ?? 0)) /
                100
              ).toFixed(2)} @ ${tax_amount?.tax_rate ?? 0}% of ${
                tax_amount?.quantity * tax_amount?.rate
              }`}
            >
              <span className="tax_column">{`${currenySymbol} ${(
                (tax_amount?.quantity * tax_amount?.rate * parseFloat(tax_amount?.tax_rate ?? 0)) /
                100
              )
                // tax_amount
                .toFixed(2)}`}</span>
              {/* <div className="unit-badge">
                <span>{`${tax_amount?.tax_rate ?? 0}%`}</span>
              </div> */}
            </TooltipX>
          ),
        },

        {
          title: "Amount",
          dataIndex: "",
          width: 30,
          ellipsis: true,
          className: "text-right amount_column",
          render: (item: any) => (
            <Statistic
              precision={2}
              className="no-space amount---fix"
              prefix={currenySymbol}
              value={getInvoiceItemRate(item) ?? 0}
              valueStyle={{ fontSize: "14px" }}
            />
          ),
        },
      ].filter((col) => !col.hidden),
    //eslint-disable-next-line
    [created_by_platform, currenySymbol, itemDetailModal, tabledataset]
  );

  return (
    <>
      <Table
        rowKey="id"
        pagination={false}
        columns={memoColumns}
        dataSource={tabledataset || []}
        className="generic-table  no-radius invoices-tbl detail_item_table table-spacing-adjustment"
      />
      {itemDetailModal && (
        <ItemDetailModal
          isModal
          bool={itemDetailModal}
          detail={{ id: itemId }}
          toggle={toggleItemDetailModal}
        />
      )}
    </>
  );
};
