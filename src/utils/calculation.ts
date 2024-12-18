export const calculateAmountReceived = (invoiceListing: object[]) => {
  let amountReceived = 0;
  invoiceListing.forEach((item: any) => {
    if (item.payment) amountReceived += item.payment || item.payment_made;
  });
  return parseFloat(amountReceived.toFixed(2));
};

export const getDiscounttotal = (dataSource) => {
  return dataSource
    ?.reduce((sum, item) => {
      if (item.discount_type === "percent") {
        return sum + getPercentage(item) || 0;
      } else {
        return sum + parseFloat(item.discount_item_level || 0);
      }
    }, 0)
    .toFixed(2);
};
export const getAdjustmentTotal = (dataSource) => {
  return dataSource
    ?.reduce((sum, item) => {
      return sum + parseFloat(item.adjustment_amount || 0);
    }, 0)
    .toFixed(2);
};
export const getFinalAmount = (item) => {
  const amount = item.quantity * item.rate;
  const discountAmount = +getSingleDiscount(item) ?? 0;
  const tax_amount = (item.total * parseFloat(item.tax_rate ?? 0)) / 100;
  const finalAmount = amount + tax_amount - discountAmount;
  return finalAmount.toFixed(2);
};

export const getSingleDiscount = (item) => {
  let amount;
  if (item.discount_type === "percent") {
    const total = item.item_total_amount ?? 0;
    amount = (total * parseFloat(item.discount_item_level)) / 100;
  } else amount = parseFloat(item.discount_item_level || 0);

  return amount.toFixed(2);
};

export const getSingleDiscountItemDetails = (item) => {
  let amount;
  let price = item.rate * item.quantity;
  if (item.discount_type === "percent")
    amount = (price * parseFloat(item.discount_item_level)) / 100;
  else amount = parseFloat(item.discount_item_level || 0);
  return amount.toFixed(2);
};

export const getItemRate = (item) => {
  return item.rate * item.quantity;
};

export const getInvoiceItemRate = (item) => {
  let discount = 0
  if (item.discount_type === "amount") {
    discount = item?.discount_item_level;
  } else if (item.discount_type === "percent") {
    discount = (item?.quantity * item?.rate * parseFloat(item?.discount_item_level)) / 100 || 0
  }
  return (item.rate * item.quantity) - discount
};

export const getPercentage = (dataSource) => {
  return (+dataSource.total * parseFloat(dataSource.discount_item_level)) / 100;
};

export const getTaxtotal = (dataSource) => {
  const totalTax = dataSource
    ?.reduce((sum, item) => {
      return sum + +getTaxPercentage(item) || 0;
    }, 0)
    .toFixed(2);
  return totalTax;
};
export const getTaxPercentage = (dataSource: any) => {
  return (dataSource.total * parseFloat(dataSource.tax_rate ?? 0)) / 100;
};

export const getSubtotal = (dataSource: object[]) => {
  return parseFloat(
    dataSource
      .reduce((total: number, item: object) => total + +getItemTotalAmount(item), 0)
      .toFixed(2)
  );
};

export const getAmountSum = (dataSource) => {
  const result = dataSource.reduce(
    (total: number, item: object) => total + getItemTotalAmount(item),
    0
  );
  return parseFloat(result).toFixed(2);
};

export function issuedCreditsTotal(dataSource: any, issueableCredits: any) {
  const result2 = parseFloat(
    dataSource
      .reduce((total: any, item: any) => total + (+item?.adjustment_amount ?? 0), 0)
      .toFixed(2)
  );

  return parseFloat(((issueableCredits ?? 0) - result2).toFixed(2));
}
export const getOrderTotal = (dataSource: object[]) => {
  let subTotal = getSubtotal(dataSource);
  let tax: number = 0;
  dataSource.forEach((item: any) => {
    tax += +item?.quantity * +item?.rate * (item?.tax_rate / 100 || 0);
  });
  let discount: number = 0;
  dataSource.forEach((item: any) => {
    if (item.discount_type === "percent") {
      return (discount += +(item.total * +parseFloat(item.discount_item_level)) / 100);
    } else {
      return (discount += +item.discount_item_level);
    }
  });
  return parseFloat((tax + subTotal - discount).toFixed(2));
};

export function getItemTotalAmount(item: any) {
  let total = item?.quantity * item?.rate;
  return parseFloat(total.toFixed(2)) || 0;
}

export function getSubTotalForDetails(items: any) {
  let sum = 0;
  items?.forEach((item) => (sum += item?.amount));
  return parseFloat(sum.toFixed(2)) || 0;
}

export const getSubTotalForInvBills = (items: any, discount_level: string) => {

  let sum = 0;
  let discount = 0
  items?.forEach((item) => {
    sum += (item?.rate * item?.quantity);
    if (discount_level === "item") {
      if (item?.discount_type === "amount") {
        discount += item?.discount_item_level || 0;
      } else {
        discount += (item?.quantity * item?.rate * parseFloat(item?.discount_item_level)) / 100 || 0
      }
    }
  });
  sum -= discount
  return parseFloat(sum.toFixed(2)) || 0;
}
/* Taxes Calculation*/

export const getTotal = (dataSource: object[]) => {
  let total = 0;
  dataSource?.forEach((item: any) => {
    const amount = parseFloat(item?.amount) || 0;
    total = total + amount;
  });
  return total.toFixed(2);
};

export const getTaxPrice = (
  id: number,
  taxes: object[] | undefined,
  amount: number,
  tax_inclusive: boolean,
  currency_symbol: string
) => {
  let total: string | number = 0;
  const applytax: any = taxes?.find((tax: any) => tax.id === id);
  if (applytax && amount) {
    return (total = tax_inclusive
      ? `${currency_symbol}${(amount - (amount * 100) / (100 + applytax?.rate)).toFixed(2)}`
      : `${currency_symbol}${(applytax?.rate * 0.01 * amount).toFixed(2)}`);
  }
  return total;
};

export const combinedItems = (arr: object[]) => {
  const res = arr.reduce((acc: any, obj: any) => {
    let found = false;
    for (let i = 0; i < acc.length; i++) {
      if (acc[i].label === obj.label) {
        found = true;
        acc[i].value += obj.value;
      }
    }
    if (!found) {
      acc.push(obj);
    }
    return acc;
  }, []);
  return res;
};

export const gettaxlist = (data: object[], taxes: any, tax_inclusive: boolean) => {
  if (data?.length > 0) {
    const taxlist = data?.map((item: any) => {
      if (item?.tax_id) {
        const applytax = taxes?.find((tax) => tax.id === item.tax_id);
        return {
          label: applytax.label,
          value: item.amount
            ? !tax_inclusive
              ? parseFloat((applytax?.rate * 0.01 * item.amount).toFixed(2))
              : parseFloat((item.amount - (item.amount * 100) / (100 + applytax?.rate)).toFixed(2))
            : 0,
        };
      } else {
        return [
          {
            label: "",
            value: 0,
          },
        ];
      }
    });

    return combinedItems(taxlist);
  } else return;
};

export const getTotalPrice = (expensetotal: any, applytaxes: any, tax_inclusive: boolean) => {
  let total_tax = 0;
  if (!tax_inclusive) {
    applytaxes?.forEach((element) => {
      if (element.value) {
        total_tax = total_tax + parseFloat(element.value);
      }
    });
  }
  return Math.floor(expensetotal) + total_tax;
};


const calculateTaxAmount = (quantity: number, unitPrice: number, taxRate: number): number =>
  parseFloat(((quantity * unitPrice * taxRate) / 100).toFixed(2));

export const getOverallTaxDetails = (items: any) => {
  const overallTax: any = [];

  items.forEach(item => {
    const taxInfo: any | undefined = item.tax || item.get_tax || item.taxInfo;
    let taxAmount: number | undefined = item.taxAmount || item.tax_amount || item.invoice_tax

    if (taxInfo && taxInfo.id !== null) {
      if (taxAmount === undefined) {
        taxAmount = calculateTaxAmount(item.quantity, item.rate || item.unitPrice || 0, taxInfo.rate) || 0;
      }

      const existingTax = overallTax.find(tax => tax.id === taxInfo.id);

      if (existingTax) {
        existingTax.total = parseFloat((existingTax.total + taxAmount).toFixed(2));
      } else {
        overallTax.push({
          id: taxInfo.id,
          rate: taxInfo.rate,
          name: taxInfo.name,
          total: taxAmount
        });
      }
    }
  });

  return overallTax;
}
