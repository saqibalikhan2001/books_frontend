import { useGetListQuery } from "store/query/organization";

export const useListing = () => {
  const {
    data: {
      country_list = [],
      currency_list = [],
      business_type = [],
      fiscal_year_list = [],
      organization_type_list = [],
    } = {},
    isLoading,
  } = useGetListQuery("");
  const currncy_list = currency_list.map(
    ({ id, currency_code, name }: any) => ({
      id,
      label: `${currency_code} - ${name}`,
    })
  );
  return {
    isLoading,
    currncy_list,
    country_list,
    currency_list,
    business_type,
    fiscal_year_list,
    organization_type_list,
  };
};
