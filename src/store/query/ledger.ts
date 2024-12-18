/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const LedgerQuery = createApi({
  reducerPath: "ledger",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getLedgerListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/ledger?date_range=${date_range || "this_month"}`,
        };
      },
    }),
  }),
});

export const { useGetLedgerListingQuery } = LedgerQuery;
