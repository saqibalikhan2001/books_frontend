export const DataToIdLabel = (data: any) => {
  const newData =
    data?.map((item: any) => ({
      ...item,
      id: item.id,
      label: item?.name || item?.display_name || item?.sales_order_no,
    })) || [];
  return newData;
};
