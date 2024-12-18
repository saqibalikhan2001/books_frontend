/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { ItemQueryResponse } from "./Types";
import { setSessionAndLocalObj, getKeyFromSS } from "utils";

const { ITEMS } = endpoints;

export const ItemsQuery = createApi({
  reducerPath: "Items",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getItemsListing: builder.query<ItemQueryResponse, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          type,
          status,
          search,
          pageSize,
          is_applied,
          sort_column,
          category_id,
          stock_status,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));

        return {
          url: `${ITEMS}?stock_status=${stock_status ?? "all"}&type=${type ?? ""}&category_id=${
            category_id ?? ""
          }&status=${
            status ?? ""
          }&page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&search=${""}&is_applied=${
            is_applied ?? ""
          }&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId = response?.items?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== ITEMS) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.items?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            ITEMS,
            null,
            response?.items?.data[1]?.id
          );
        }

        return response;
      },
    }),
  }),
});

export const { useGetItemsListingQuery } = ItemsQuery;
