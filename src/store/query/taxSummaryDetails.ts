/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryDetailsReportsQuery = createApi({
  reducerPath: "TaxSummaryDetailsReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTaxSummaryDetailsReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, itemId } = paginate;
        return {
          url: `/report/tax/details?date_range=${date_range ?? "this_week"}&items=${
            itemId ?? ""
          }&view=${paginate.pageSize}&page=${paginate.page}&order_by=${paginate.sort}&sort_by=${
            paginate.sort_column ?? "created_at"
          }`,
        };
      },
    }),
  }),
});
export const { useGetTaxSummaryDetailsReportsListingQuery } = TaxSummaryDetailsReportsQuery;
