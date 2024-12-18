/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const LedgerReportsQuery = createApi({
  reducerPath: "LedgerReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getLedgerReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/ledger?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetLedgerReportsListingQuery } = LedgerReportsQuery;
