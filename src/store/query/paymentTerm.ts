/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const PaymentTermsQuery = createApi({
  reducerPath: "paymentTerms",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPaymentTerms: builder.query<any, any>({
      query: () => {
        return {
          url: `/terms`,
        };
      },
    }),
  }),
});

export const { useGetPaymentTermsQuery } = PaymentTermsQuery;
