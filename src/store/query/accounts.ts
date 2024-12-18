/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { setSessionAndLocalObj, getKeyFromSS } from "utils";

export const AccountsQuery = createApi({
  reducerPath: "Accounts",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAccountsList: builder.query<any, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          search,
          pageSize,
          added_by,
          is_applied,
          sort_column,
          account_type_id,
          account_subtype_id,
          account_category_id,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));

        return {
          url: `accounts/?page=${page ?? 1}&view=${
            pageSize ?? 10
          }&order_by=${sort}&sort_column=${sort_column}&resolution=${resolution}&is_applied=${
            is_applied ?? ""
          }&added_by=${added_by ?? ""}&account_type_id=${
            account_type_id ?? ""
          }&account_subtype_id=${account_subtype_id ?? ""}&account_category_id=${
            account_category_id ?? ""
          }&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId =
          response?.accounts?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== "/accounts") ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            dataFromLS?.curr_id ? dataFromLS?.curr_id : response?.accounts?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            "/accounts",
            null,
            response?.accounts?.data[1]?.id
          );
        }

        return response;
      },
    }),
  }),
});

export const { useGetAccountsListQuery } = AccountsQuery;
