/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const TrialBalanceQuery = createApi({
  reducerPath: "TrialBalance",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getTrialBalanceListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range } = paginate;
        return {
          url: `/trial_balance?date_range=${date_range || "this_month"}`,
        };
      },
    }),
  }),
});

export const { useGetTrialBalanceListingQuery } = TrialBalanceQuery;
