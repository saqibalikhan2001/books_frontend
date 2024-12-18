/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryTimeDurationQuery = createApi({
  reducerPath: "TaxSummaryTimeDurationReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTaxSummaryTimeDurationListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/tax/summary_time_duration?view=20&page=1&order_by=asc&sort_by=created_at&date_range=${date_range || "this_year"}`,
        };
      },
    }),
  }),
});
export const { useGetTaxSummaryTimeDurationListingQuery } = TaxSummaryTimeDurationQuery;
