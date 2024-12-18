/** @format */

import { useMemo, useState } from "react";
import { Image, Statistic, Table, Typography } from "antd";
import { ImagePath } from "utils";
import { useStore } from "app/Hooks";
import { ItemDetailTableProps } from "./Types";
import { ItemDetailModal } from "app/containers/Items/itemDetailModal";

const { Text } = Typography;

export const ItemDetailTable = ({ details, tableData, isModal }: ItemDetailTableProps) => {
  const [itemId, setItemid] = useState();
  const { created_by_platform } = useStore();
  const [itemDetailModal, setItemDetailModal] = useState(false);
  const [tabledataset, setTabledata] = useState(
    tableData.map((data) => ({ ...data, expands: true }))
  );
  const currenySymbol =
    details?.base_currency?.symbol || details?.invoice_info?.base_currency?.symbol;

  const toggleItemDetailModal = (id) => {
    setItemDetailModal(!itemDetailModal);
    setItemid(id);
  };
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

  const memoColumns = useMemo(
    () => [
      {
        title: "Item",
        dataIndex: "",
        width: 55,
        ellipsis: true,
        className: "image_cell",
        render: (props: any, __, index) => (
          <>
            <div className="__product_image">
              <Image
                preview={false}
                onClick={(e) => e.stopPropagation()}
                src={
                  props?.items?.images.length
                    ? ImagePath(props?.items?.images[0] as string, created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${import.meta.env.VITE_ITEM_PLACEHOLDER_SMALL_IMAGE}`
                }
              />
              {/* UI DEV NOTE :white-space--normal is a custom/utility class in common file   */}
              <div className="__product_info white-space--normal">
                <Text
                  className={isModal ? "block" : "_display_name block cursor"}
                  onClick={() => !isModal && toggleItemDetailModal(props.item_id)}
                >
                  {props.item_name || props.items.name}
                </Text>
                <Text>{props.item?.sku || props.items.sku}</Text>
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
                      <p className="color-1616">
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
      },
      {
        title: "Qty",
        dataIndex: "",
        width: 30,
        ellipsis: true,
        className: "text-right ver_tic_al--top pr-7 color-1616",
        render: (props: any) => (
          <div className="unit-badge">
            <Statistic value={props?.quantity_processed} valueStyle={{ fontSize: "14px" }} />
            <span>{props?.items?.unit ? `${props?.items?.unit}(s)` : ""}</span>
          </div>
        ),
      },
      {
        title: "Rate",
        dataIndex: "",
        width: 35,
        ellipsis: true,
        className: "text-right ver_tic_al--top pr-7",
        render: (props: any) => (
          <Statistic
            precision={2}
            className="no-space  w-break"
            value={props?.invoice_item_detail?.rate ?? 0}
            prefix={currenySymbol}
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Amount",
        dataIndex: "",
        width: 35,
        ellipsis: true,
        className: "text-right ver_tic_al--top pr-7",
        render: (props: any) => (
          <Statistic
            precision={2}
            className="no-space break-amount"
            value={
              `${currenySymbol}` +
              (props?.quantity_processed * props?.invoice_item_detail?.rate).toFixed(2) ?? 0
            }
            valueStyle={{ fontSize: "14px" }}
          />
        ),
      },
      {
        title: "Deduction",
        dataIndex: "",
        width: 30,
        ellipsis: true,
        className: "text-right ver_tic_al--top pr-7",
        render: (props: any) => (
          <Statistic
            precision={2}
            className="no-space break-amount"
            valueStyle={{ fontSize: "14px" }}
            value={
              `${currenySymbol}` +
              parseFloat(
                props?.adjustement_criteria === "percent"
                  ? ((props?.quantity_processed * props?.invoice_item_detail?.rate) / 100) *
                  props.adjustment
                  : props.adjustment
              ).toFixed(2) ?? 0
            }
          />
        ),
      },
      // {
      //   title: "Tax",
      //   dataIndex: "tax_amount",
      //   width: 30,
      //   ellipsis: true,
      //   render: (tax_amount: any) => (
      //     <Statistic
      //       precision={2}
      //       className="no-space"
      //       value={`${currenySymbol}` + (tax_amount ?? 0)}
      //       valueStyle={{ fontSize: "14px", display: "flex" }}
      //     />
      //   ),
      // },
      // {
      //   title: "After tax & discount",
      //   dataIndex: "",
      //   width: 35,
      //   ellipsis: true,
      //   render: (props: any) => (
      //     <Statistic
      //       precision={2}
      //       value={`${currenySymbol}` + getItemRate(props.invoice_item_detail)}
      //       className="no-space"
      //       valueStyle={{ fontSize: "14px", textAlign: "right", paddingRight: "6px" }}
      //     />
      //   ),
      // },
    ],
    //eslint-disable-next-line
    [created_by_platform, currenySymbol, itemDetailModal]
  );
  return (
    <>
      <Table
        rowKey="id"
        pagination={false}
        columns={memoColumns}
        dataSource={tabledataset || []}
        className="generic-table mb-20 no-radius invoices-tbl m--unset"
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
