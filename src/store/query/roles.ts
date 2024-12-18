/** @format */

import { createApi } from "@reduxjs/toolkit/query/react";
import { endpoints } from "static";
import { baseQuery } from "./baseQuery";
import { PaginationProps } from "./Types";

const { ROLE } = endpoints;

export const roleQuery = createApi({
  reducerPath: "roles",
  keepUnusedDataFor: 3600,
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getroleListing: builder.query<any, PaginationProps>({
      query: (paginate) => {
        const { sort: sort_order, sort_column } = paginate;
        return {
          url: `${ROLE}?sort_by=${sort_order === undefined ? "" : sort_column}&order_by=${
            sort_order === "descend" ? "desc" : "asc"
          }`,
        };
      },
    }),
  }),
});

export const { useGetroleListingQuery, useLazyGetroleListingQuery } = roleQuery;
