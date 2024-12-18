/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const PaymentMadeReportQuery = createApi({
  reducerPath: "PaymentMade",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPaymentMadeReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: `/report/bill/payment?date_range=${date_range || "this_week"}${
            contactId ? `&contact_id=${contactId}` : ""
          }`,
        };
      },
    }),
  }),
});
export const { useGetPaymentMadeReportListingQuery } = PaymentMadeReportQuery;
