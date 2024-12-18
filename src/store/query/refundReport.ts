/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const RefundReportQuery = createApi({
  reducerPath: "RefundReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getRefundReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: contactId
            ? `/report/refund?date_range=${date_range || "this_week"}&contact_id=${contactId}`
            : `/report/refund?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetRefundReportListingQuery } = RefundReportQuery;
