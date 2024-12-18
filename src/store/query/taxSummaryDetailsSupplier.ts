/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TaxSummaryDetailsSupplierQuery = createApi({
  reducerPath: "TaxSummaryDetailsSupplier",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    TaxSummaryDetailsSupplierListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/tax_suppliers/details_time_duration?view=${paginate.pageSize}&page=${
            paginate.page
          }&order_by=${paginate.sort}&sort_by=${paginate.sort_column ?? "created_at"}&date_range=${
            date_range ?? "this_year"
          }&contact_id=${paginate.contactId ?? ""}`,
        };
      },
    }),
  }),
});
export const { useTaxSummaryDetailsSupplierListingQuery } = TaxSummaryDetailsSupplierQuery;
