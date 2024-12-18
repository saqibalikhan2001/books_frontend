export const createTaxList = (taxList: object[]) => {
  const taxlist =
    taxList?.map((tax: any) =>
      tax?.tax_group_details
        ? {
            id: tax.id,
            name: tax.name,
            isGroup: true,
            rate: tax.tax_group_details.reduce(
              (prev: number, currVal: any) => prev + currVal.tax_details.rate,
              0
            ),
          }
        : { id: tax.id, name: tax.name, rate: tax.rate }
    ) || [];

  return taxlist;
};
