/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps } from "./Types";

const { ALL_USERS } = endpoints;

export const inviteUserQuery = createApi({
  reducerPath: "invite_user",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getInviteeListing: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { sort: sort_order, sort_column, filter } = paginate;
        return {
          url: `${ALL_USERS}?sort_by=${sort_order === undefined ? "" : sort_column}&order_by=${
            sort_order === "descend" ? "desc" : "asc"
          }&filter=${filter ?? ""}`,
        };
      },
    }),
  }),
});

export const { useGetInviteeListingQuery, useLazyGetInviteeListingQuery } = inviteUserQuery;
