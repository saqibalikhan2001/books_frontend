/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryDetailTimeDurationQuery = createApi({
  reducerPath: "TaxSummaryDetailTimeDurationReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTaxSummaryDetailTimeDurationListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/tax/details_time_duration?view=${paginate.pageSize}&page=${
            paginate.page
          }&order_by=asc&sort_by=created_at&date_range=${date_range ?? "this_year"}&items=${
            paginate.itemId ?? ""
          }`,
        };
      },
    }),
  }),
});
export const { useGetTaxSummaryDetailTimeDurationListingQuery } = TaxSummaryDetailTimeDurationQuery;
