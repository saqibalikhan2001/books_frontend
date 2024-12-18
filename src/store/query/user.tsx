/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps } from "./Types";

const { USERS } = endpoints;

export const UserQuery = createApi({
  reducerPath: "user",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getUserListing: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { page, pageSize } = paginate;
        return {
          url: `${USERS}?page=${page}&sort_by=${"name"}&order_by=${"asc"}&view=${pageSize}`,
        };
      },
    }),
  }),
});

export const { useGetUserListingQuery, useLazyGetUserListingQuery } = UserQuery;
