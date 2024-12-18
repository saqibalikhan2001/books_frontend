export const validateQuantityInArray = (array) => {
  for (const item of array) {
    const items = item?.quantity_processed || item?.quantity;
    if (!items || items <= 0 || items === null) {
      return "Quantity is required.";
    }
  }
  return null;
};

export const validateDiscountInArray = (array) => {
  for (const item of array) {
    if (
      item?.discount_type === "amount" &&
      parseFloat(item?.discount_item_level) > parseFloat(item.rate)
    ) {
      return "Greater that rate";
    }
  }
  return null;
};
