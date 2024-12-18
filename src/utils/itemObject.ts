export const itemObject = (item: any) => {
  const object = {
    amount: item.amount || 0,
    discount_type: item.discount_type ? item.discount_type : "percent",
    discount_item_level: 0,
    id: item.id,
    extra_description: null,
    item_id: item.id,
    item_name: item.name,
    organization_id: item.organization_id,
    platform_type: item.platform_type,
    quantity: item.quantity,
    name: item.name,
    account_id:
      item.inventory_type === "inventory" ? item.inventory_account?.id : item.purchase_account?.id,

    item: {
      images: item.images,
      id: item.id,
      mpn: item.mpn,
      name: item.name,
      sku: item.sku,
      rate: item.sales_unit_price || 0,
      category: item.category,
      inventory_type: item.inventory_type,
      type: item.type,

      unit: item.unit,
      upc: item.upc,
      stocks: item.stocks,
    },
    tax: item?.tax,
    tax_id: item?.tax?.id,
    tax_amount: item?.tax?.amount,
    tax_rate: item?.tax?.rate,
    tax_name: item?.tax?.name,
    rate: item.sales_unit_price || 0,
    warehouse_id: item.stocks[0].warehouse_id,
  };
  return object;
};
