/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const SalesCustomerQuery = createApi({
  reducerPath: "SalesCustomers",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getSalesCustomerListing: builder.query<any, any>({
      query: ({ paginate }) => {
        const { date_range, contactId } = paginate;
        return {
          url: `/report/customer?date_range=${date_range || "this_week"}&contact_id=${
            typeof contactId === "object" ? contactId?.id : contactId ?? ""
          }`,
        };
      },
    }),
  }),
});
export const { useGetSalesCustomerListingQuery } = SalesCustomerQuery;
