/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryReportsQuery = createApi({
  reducerPath: "TaxSummaryReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTaxSummaryReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/tax/summary?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetTaxSummaryReportsListingQuery } = TaxSummaryReportsQuery;
