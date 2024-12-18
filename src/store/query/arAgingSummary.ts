/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const ArAgingSummaryReport = createApi({
  reducerPath: "ArAgingSummaryReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getArAgingSummaryReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const {
          date_range,
          page,
          pageSize,
          // sort,
          aging_by,
          interval_type,
          number_of_columns,
          interval_range,
          show_by,
          is_include_credit_notes,
        } = paginate;
        const is_include_credit = is_include_credit_notes === true;
        return {
          url: `/report/aragingsummary?view=${pageSize}&page=${page}&date_range=${
            date_range || "this_week"
          }&aging_by=${aging_by || "invoiceduedate"}&interval_type=${
            interval_type || "weeks"
          }&number_of_columns=${number_of_columns || "1"}&interval_range=${
            interval_range || "1"
          }&show_by=${show_by || "amount"}&is_include_credit_notes=${is_include_credit}`,
        };
      },
    }),
  }),
});
export const { useGetArAgingSummaryReportListingQuery } = ArAgingSummaryReport;
