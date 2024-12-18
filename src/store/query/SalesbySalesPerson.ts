/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const SalesBySalesPersonQuery = createApi({
    reducerPath: "SalesPerson",
    keepUnusedDataFor: 3600,
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getSalesPersonListing: builder.query<any, any>({
            query: ({ paginate }) => {
                const { date_range } = paginate;
                return {
                    url: `/report/salesbysalesperson?date_range=${date_range || "this_week"}`,
                };
            },
        }),
    }),
});
export const { useGetSalesPersonListingQuery } = SalesBySalesPersonQuery;
