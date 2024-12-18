/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { BillQueryResponse, PaginationProps } from "./Types";
import { getKeyFromSS, setSessionAndLocalObj } from "utils";

const { BILLS, RECURRING_BILL } = endpoints;

export const BillsQuery = createApi({
  reducerPath: "Bills",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getBillsListing: builder.query<BillQueryResponse, any>({
      query: ({ paginate, sidebarPosition }) => {
        const {
          page,
          sort,
          status,
          pageSize,
          contactId,
          end_range,
          search,
          date_range,
          is_applied,
          sort_column,
          start_range,
        } = paginate;
        let resolution: number;
        sidebarPosition?.open
          ? (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10))
          : (resolution = window.innerWidth - ((sidebarPosition?.width as number) + 10));

        return {
          url: `${BILLS}?page=${page}&sort_by=${sort_column}&order_by=${sort}&view=${pageSize}&resolution=${resolution}&status=${
            status ?? ""
          }&date_range=${date_range}&start=${start_range ?? ""}&end=${end_range ?? ""}&contactId=${
            contactId ?? ""
          }&search=${""}&is_applied=${is_applied ?? ""}&search=${search ?? ""}`,
        };
      },
      transformResponse: async (response: any) => {
        const dataFromLS = await JSON.parse(getKeyFromSS("obj"));
        const hasId = response?.bills?.data?.filter((e) => e.id === dataFromLS?.curr_id).length > 0;
        if (
          (!dataFromLS?.curr_id && dataFromLS?.module_name !== BILLS) ||
          (!hasId && dataFromLS?.once)
        ) {
          setSessionAndLocalObj(
            hasId ? dataFromLS?.curr_id : response?.bills?.data[0]?.id,
            dataFromLS ? dataFromLS?.once : false,
            BILLS,
            null,
            response?.bills?.data[1]?.id
          );
        }

        return response;
      },
    }),
    getBillRecurringListing: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize, sort } = paginate;
        return {
          url: `${RECURRING_BILL}?filter=${"all"}&page=${page}&sort_by=${sort}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
    }),
  }),
});

export const { useGetBillsListingQuery, useGetBillRecurringListingQuery } = BillsQuery;
