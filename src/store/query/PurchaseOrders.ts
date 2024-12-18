/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps, PurchaseOrderQueryResponse } from "./Types";

const { PURCHASE_ORDERS } = endpoints;

export const PurchaseOrdersQuery = createApi({
  reducerPath: "PurchaseOrders",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPurchaseOrdersListing: builder.query<
      PurchaseOrderQueryResponse,
      PaginationProps
    >({
      query: (paginate) => {
        const { page, pageSize } = paginate;
        return {
          url: `${PURCHASE_ORDERS}?filter=${"all"}&page=${page}&sort_by=${"vendor_id"}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
    }),
  }),
});

export const { useGetPurchaseOrdersListingQuery } = PurchaseOrdersQuery;
