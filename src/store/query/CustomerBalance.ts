/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const CustomerBalanceReportQuery = createApi({
  reducerPath: "customerBalanceReport",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getCustomerBalanceReportListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, page, pageSize, contactId } = paginate;
        return {
          url: `/report/customer/balance?page=${page}&view=${pageSize}&date_range=${
            date_range || "this_week"
          }&contact_id=${typeof contactId === "object" ? contactId?.id : contactId ?? ""}`,
        };
      },
    }),
  }),
});
export const { useGetCustomerBalanceReportListingQuery } = CustomerBalanceReportQuery;
