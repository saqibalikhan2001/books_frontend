/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";

const { WAREHOUSE } = endpoints;

export const warehouseQuery = createApi({
  reducerPath: "warehouse",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getListing: builder.query<any, any>({
      query: () => ({ url: WAREHOUSE }),
    }),
  }),
});

export const { useGetListingQuery, useLazyGetListingQuery } = warehouseQuery;
