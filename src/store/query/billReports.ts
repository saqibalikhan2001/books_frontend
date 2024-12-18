/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const BillReportsQuery = createApi({
  reducerPath: "BillReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getBillReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: `/report/bill?date_range=${date_range || "this_week"}${
            contactId ? `&contact_id=${contactId}` : ""
          }`,
        };
      },
    }),
  }),
});
export const { useGetBillReportsListingQuery } = BillReportsQuery;
