/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const SalesItemsQuery = createApi({
  reducerPath: "SalesItems",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSalesItemsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/salesbyitem?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetSalesItemsListingQuery } = SalesItemsQuery;
