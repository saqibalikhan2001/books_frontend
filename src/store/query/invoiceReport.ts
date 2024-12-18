/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const InvoiveReportQuery = createApi({
  reducerPath: "InvoiceReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInvoiceReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, status, contactId } = paginate;
        const url = contactId
          ? `/report/invoice?date_range=${date_range || "this_week"}&status=${
              status || "all"
            }&contact_id=${contactId}`
          : `/report/invoice?date_range=${date_range || "this_week"}&status=${status || "all"}`;
        return {
          url: url,
        };
      },
    }),
  }),
});
export const { useGetInvoiceReportListingQuery } = InvoiveReportQuery;
