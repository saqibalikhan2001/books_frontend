/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const ReceivableSummaryReportsQuery = createApi({
  reducerPath: "ReceivableSummaryReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getReceivableSummaryReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/receivable/summary?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetReceivableSummaryReportsListingQuery } = ReceivableSummaryReportsQuery;
