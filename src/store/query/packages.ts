/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps } from "./Types";

const { PACKAGES } = endpoints;

export const PackagesQuery = createApi({
  reducerPath: "Packages",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getPackagesListing: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize } = paginate;
        return {
          url: `${PACKAGES}?filter=${"all"}&page=${page}&sort_by=${"customer_id"}&order_by=${"asc"}&view=${pageSize}&search=${""}`,
        };
      },
    }),
  }),
});

export const { useGetPackagesListingQuery } = PackagesQuery;
