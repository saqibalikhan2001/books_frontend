/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const ReceivableDetailReportsQuery = createApi({
  reducerPath: "ReceivableDetailReports",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getReceivableDetailReportsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/report/receivable/details?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetReceivableDetailReportsListingQuery } = ReceivableDetailReportsQuery;
