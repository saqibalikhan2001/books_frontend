/**@format */

import { useGetTaxListQuery } from "store/query/organization";
import { usePermissions } from ".";
import { useSearchParam } from "./useSearchParam";

export const useTaxes = () => {
  const { checkPermission } = usePermissions();
  const { getParams } = useSearchParam("");
  const { has_TaxView_permission } = checkPermission("TaxView");
  const { data = [] } = useGetTaxListQuery(getParams(), {
    skip: !has_TaxView_permission,
    refetchOnMountOrArgChange: true,
  });

  const taxes_list =
    data?.map((tax: any) =>
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

  return { data, taxes_list };
};
