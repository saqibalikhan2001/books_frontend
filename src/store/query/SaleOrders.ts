/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps, SalesOrderQueryResponse } from "./Types";

const { SALES_ORDERS } = endpoints;

export const SalesOrdersQuery = createApi({
  reducerPath: "SalesOrders",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSalesOrdersListing: builder.query<
      SalesOrderQueryResponse,
      PaginationProps
    >({
      query: (paginate) => {
        const { page, pageSize } = paginate;
        return {
          url: `${SALES_ORDERS}?filter=${"all"}&page=${page}&sort_by=${"customer_id"}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
    }),
  }),
});

export const { useGetSalesOrdersListingQuery } = SalesOrdersQuery;
