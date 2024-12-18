/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const PaymentReceiptReportQuery = createApi({
  reducerPath: "PaymentReceiptReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPaymentReceiptReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: contactId
            ? `/report/invoice/payment?date_range=${
                date_range || "this_week"
              }&contact_id=${contactId}`
            : `/report/invoice/payment?date_range=${date_range || "this_week"}`,
        };
      },
    }),
  }),
});
export const { useGetPaymentReceiptReportListingQuery } = PaymentReceiptReportQuery;
