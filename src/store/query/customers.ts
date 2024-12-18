/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints, routeNames } from "static";
import { baseQuery } from "./baseQuery";
import { setSessionAndLocalObj, getKeyFromSS } from "utils";
import { CustomerQueryResponse } from "./Types";

const { SUPPLIERS } = endpoints;
const { CUSTOMERS } = routeNames;

export const CustomerQuery = createApi({
  reducerPath: "Customers",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCustomersListing: builder.query<CustomerQueryResponse, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          status,
          search,
          pageSize,
          end_range,
          is_applied,
          sort_column,
          start_range,
          current_balance,
          searchByAlphabet,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 40))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 40));

        return {
          url: `/customers?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&search=${""}&searchByAlphabet=${
            searchByAlphabet ?? ""
          }&status=${status ?? ""}&current_balance=${current_balance ?? ""}&start_range=${
            start_range ?? ""
          }&end_range=${end_range ?? ""}&is_applied=${is_applied ?? ""}&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        //@ts-ignore
        const hasId =
          response?.contacts?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== CUSTOMERS) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.contacts?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            CUSTOMERS,
            null,
            response?.contacts?.data[1]?.id
          );
        }

        return response;
      },
    }),
    getSuppliersListing: builder.query<CustomerQueryResponse, any>({
      query: ({ paginate, sidebarPosition }) => {
        //@ts-ignore
        const {
          page,
          sort,
          status,
          pageSize,
          end_range,
          is_applied,
          sort_column,
          start_range,
          current_balance,
          searchByAlphabet,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 40))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 40));

        return {
          url: `${SUPPLIERS}?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&search=${""}&searchByAlphabet=${
            searchByAlphabet ?? ""
          }&status=${status ?? ""}&current_balance=${current_balance ?? ""}&start_range=${
            start_range ?? ""
          }&end_range=${end_range ?? ""}&is_applied=${is_applied ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        //@ts-ignore
        const hasId =
          response?.contacts?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== "/suppliers") ||
          (!hasId && dataFromLS?.once)
          //  ||
          // (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.contacts?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            `/suppliers`,
            null,
            response?.contacts?.data[1]?.id
          );
        }

        return response;
      },
    }),
  }),
});

export const { useGetCustomersListingQuery, useGetSuppliersListingQuery } = CustomerQuery;
