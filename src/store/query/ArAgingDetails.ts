/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const ArAgingDetails = createApi({
  reducerPath: "ArAgingDetailsReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getArAgingDetailsListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const {
          // sort,
          page,
          show_by,
          pageSize,
          aging_by,
          contactId,
          date_range,
          interval_type,
          interval_range,
          number_of_columns,
          is_include_credit_notes,
        } = paginate;
        const is_include_credit = is_include_credit_notes === true;
        return {
          url: `/report/aragingsummarydetails?customer_id=${
            typeof contactId === "object" ? contactId?.id : contactId ?? ""
          }&view=${pageSize}&page=${page}&order_by=${"asc"}&sort_by=display_name&date_range=${
            date_range || "this_week"
          }&aging_by=${aging_by || "invoicedate"}&interval_type=${
            interval_type || "weeks"
          }&number_of_columns=${number_of_columns || "1"}&interval_range=${
            interval_range || "1"
          }&show_by=${
            show_by || "amount"
          }&is_include_credit_notes=${is_include_credit}&interval=total`,
        };
      },
    }),
  }),
});
export const { useGetArAgingDetailsListingQuery } = ArAgingDetails;
