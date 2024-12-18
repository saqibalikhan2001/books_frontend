/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryDetailsCutomerQuery = createApi({
  reducerPath: "TaxSummaryDetailsCutomer",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    TaxSummaryDetailsCutomerListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/tax_customers/details_time_duration?view=${paginate.pageSize}&page=${
            paginate.page
          }&order_by=${paginate.sort}&sort_by=${paginate.sort_column ?? "created_at"}&date_range=${
            date_range ?? "this_year"
          }&contact_id=${paginate.contactId ?? ""}`,
        };
      },
    }),
  }),
});
export const { useTaxSummaryDetailsCutomerListingQuery } = TaxSummaryDetailsCutomerQuery;
