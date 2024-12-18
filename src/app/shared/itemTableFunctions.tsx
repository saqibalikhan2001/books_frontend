import { ImagePath } from "utils";
import { Avatar, Image } from "antd";

export const editItemResponse = (itemList: any, PO_Warehouse_Id, created_by_platform, taxes) => {
  const itemdata = itemList.map((item: any) => {
    return {
      ...item,
      unique_id: item?.id,
      id: item.item_id,
      item_unit: item?.item?.unit,
      item_obj: {
        key: `${Math.random()}`,
        value: item?.item_id,
        label: [
          <Avatar
            size="large"
            src={
              <Image
                preview={false}
                src={
                  item?.item?.images?.length
                    ? ImagePath(item?.item?.images[0], created_by_platform)
                    : `${import.meta.env.VITE_AWS_S3_IMS_BUCKET_URL}${import.meta.env.VITE_ITEM_PLACEHOLDER_IMAGE}`
                }
              />
            }
          />,
          <div className="product_text_detail">
            <span className="product_name"> {item?.item.name} </span>
            <span className="product_sku ">{item?.item?.sku}</span>
          </div>,
        ],
      },
      extra_description: item.extra_description,

      item_name: item.item_name,
      tax_amount: item.tax_amount,
      discount_type: item.discount_type,
      discount_item_level: item.discount_item_level?.toFixed(2),
      warehouse_id: PO_Warehouse_Id || item.warehouse_id,
      rate: item.rate.toFixed(2) ?? item.purchase_order_item_unit_price?.toFixed(2),
      tax_id: (item.tax_id || item.purchase_order_item_tax_id) ?? null,
      sku: item?.item.sku,
      image: item?.item?.images?.length ? item?.item?.images[0] : "",
      label: item.item.name,
      account_id: (item.account_id || item.purchase_order_item_account_id) ?? null,
      tax_rate: item.tax
        ? item.tax.rate
        : taxes?.length
          ? taxes?.find((tax: any) => tax?.id === item?.purchase_order_item_tax_id)?.rate
          : 0,
      total:
        item.rate * item.quantity ??
        item.rate * item.remaining_quantity ??
        item?.purchase_order_item_unit_price * item?.quantity_billable_without_received,
      item_total_amount:
        item.rate * item.quantity ??
        item.rate * item.remaining_quantity ??
        item?.purchase_order_item_unit_price * item?.quantity_billable_without_received,
      quantity: item.remaining_quantity || item.quantity || item.quantity_billable_without_received,
    };
  });
  return itemdata;
};
